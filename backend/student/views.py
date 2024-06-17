from django.contrib.admin import action
from django.shortcuts import render
from django.views.generic import detail
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from .models import *
from .permissions import IsStudent
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from rest_framework import generics, permissions
from rest_framework.decorators import action
from rest_framework import status
from django.db.models import Q


class AnswerCreateView(APIView):
    permissions_classes = [permissions.IsAuthenticated, IsStudent]
    def post(self, request, format=None):
        try:
            data = request.data.copy()
            student = Student.objects.get(user=request.user)
            data.update({'student': student.id})
            serializer = AnswerSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print(serializer.errors)
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

class StudentProblemViewSet(ModelViewSet):
    queryset = Problem.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    @action(detail=False, methods=['get'], url_path='problems')
    def problems(self, request):
        student = Student.objects.get(user=request.user)
        problems = Problem.objects.filter(Q(students__user=request.user) | Q(faculty=student.faculty))
        serializer = StudentProblemSerializer(problems, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], url_path='problem/<int:pk>')
    def problem(self, request, pk=None):
        problem = self.get_object()
        student = Student.objects.get(user=request.user)
        if problem.students.filter(id=student.id).exists():
            serializer = StudentProblemSerializer(problem, context={'request': request})
            return Response(serializer.data)
        else:
            return Response({'status': 'problem not found'}, status=status.HTTP_404_NOT_FOUND)

class StudentRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = StudentRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            token = RefreshToken.for_user(user)
            response_data = serializer.data
            response_data['refresh'] = str(token)
            response_data['access'] = str(token.access_token)
            return Response(response_data)
        except Exception as e:
            print(e)

class ProblemDetailView(APIView):
    permissions_classes = [permissions.IsAuthenticated, IsStudent]
    def get(self, request, pk):
        try:
            problem = Problem.objects.get(pk=pk)
            student = Student.objects.get(user=request.user)
            if problem.students.filter(id=student.id).exists() or student.faculty == problem.faculty:
                serializer = StudentProblemSerializer(problem, context={'request': request})
                return Response(serializer.data)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_404_NOT_FOUND)


    
class CheckRole(APIView):
    permissions_classes = [permissions.IsAuthenticated]
    def get(self, request):
        teacher = Teacher.objects.filter(user=request.user)
        student = Student.objects.filter(user=request.user)
        if teacher.exists():
            return Response({'role': 'teacher', 'name': teacher[0].name})
        elif student.exists():
            return Response({'role': 'student', 'name': student[0].name, 'faculty': student[0].faculty})
        else:
            return Response({'role': 'none'})