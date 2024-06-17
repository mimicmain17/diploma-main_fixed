from django.contrib.admin import action
from django.views.generic import detail
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from student.models import *
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from rest_framework import generics, permissions
from rest_framework.decorators import action
from rest_framework import status
from .permissions import IsTeacher
import datetime

class AllStudentsView(APIView):
    permissions_classes = [permissions.IsAuthenticated, IsTeacher]
    def get(self, request):
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True, context={'request': request})
        return Response(serializer.data)
    
class TeacherAnswerView(APIView):
    permissions_classes = [permissions.IsAuthenticated, IsTeacher]

    def get(self, request, pk):
        try:
            problem = Problem.objects.get(pk=pk)
            answers = Answer.objects.filter(problem=problem)
            teacher = Teacher.objects.get(user=request.user)
            if answers.exists() and answers[0].problem.teacher == teacher:
                serializer = TeacherAnswerSerializer(answers, many=True)
                return Response(serializer.data)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_404_NOT_FOUND)

class TeacherRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = TeacherRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    # generate ten different strings of length 20
    inviteCodes = [   
        "invite", 
        "a8xF@kG!3lPzB#7HmQ$n",
        "R2v^J&gH1sKq8W$zT*6y",
        "9jN#5YbL@2cVq*X4D^7p",
        "Z3r!8T&hJmG9L$k2W#1x",
        "d6K^b#X$7jNp!Tz9G&3L",
        "Q4y*1V@g5X#2zJmR$6c",
        "W8h&3R#P@7KfT1yL^2q",
        "9L$k2N#8T@7vH&1Pj^G3",
        "5G$z8W@q!2XrL7T#J^1v",
        "y6R$7P*8G2Tq#z1@L^9m",
        "3xV#2yL$8JkP!T7N^5q",
        "5zX@3T#L9G8R^2k&1jNp",
        "h9@W8G$T2L#7P1v*3q^k",
        "7mQ$8R#P1L^2Gz&3T*6j",
        "2L@9k&3J^1T$8W#7pGv",
        "6Kz!5L$1T3N@8P#G^2R",
        "3T^L$8J#5Pz2N@7R1q&k",
        "9vL@1G$7T#8P2X^k&3R",
        "6R@k3J$1L#9T8N^2Pz5G",
        "8T^1qL$9P#7k2Gz@3R*"
    ]

    def create(self, request, *args, **kwargs):
        if request.data['inviteCode'] not in self.inviteCodes:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)
        response_data = serializer.data
        response_data['refresh'] = str(token)
        response_data['access'] = str(token.access_token)
        return Response(response_data)

class AnswerCheck(APIView):
    permissions_classes = [permissions.IsAuthenticated, IsTeacher]
    def post(self, request, format=None):
        try:
            teacher = Teacher.objects.get(user=request.user)
            answer = Answer.objects.get(id=request.data['id'])
            if not answer or not teacher or answer.problem.teacher != teacher:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            if answer.is_check:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            answer.is_right = request.data['is_right']
            answer.is_check = True
            answer.create_at = datetime.datetime.now()
            answer.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

class TeacherAnswersViewSet(ModelViewSet):
    serializer_class = AnswerSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return Answer.objects.filter(problem__teacher__user=self.request.user)

    @action(detail=False, methods=['get'], url_path='answers')
    def teacher_answers(self, request):
        queryset = self.get_queryset()
        # answers = Answer.objects.filter(problem__teacher__user=request.user)
        serializer = AnswerSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)
    
class TeacherProblemViewSet(ModelViewSet):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]
    @action(detail=False, methods=['get'], url_path='problems')
    def tasks(self, request):
        tasks = Problem.objects.filter(teacher__user=request.user)
        serializer = ProblemSerializer(tasks, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='problem/<int:pk>')
    def problem(self, request, pk=None):
        problem = self.get_object()
        student = Student.objects.get(user=request.user)
        if problem.students.filter(id=student.id).exists():
            serializer = StudentProblemSerializer(problem, context={'request': request})
            return Response(serializer.data)
        else:
            return Response({'status': 'problem not found'}, status=status.HTTP_404_NOT_FOUND)

class ProblemCreateView(APIView):
    permissions_classes = [permissions.IsAuthenticated, IsTeacher]
    def post(self, request, format=None):
        try:
            data = request.data.copy()
            teacher = Teacher.objects.get(user=request.user)
            data.update({'teacher': teacher.id})
            serializer = CreateProblemSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print(serializer.errors)
        except Exception as e:
            print(e)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class DeleteProblem(APIView):
    permissions_classes = [permissions.IsAuthenticated, IsTeacher]
    def post(self, request, format=None):
        try:
            problem = Problem.objects.get(id=request.data['id'])
            if problem.teacher.user == request.user:
                problem.delete()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

