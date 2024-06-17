from rest_framework import serializers
from .models import *

class ProblemSerializer(serializers.ModelSerializer):
    is_checked = serializers.SerializerMethodField()
    is_answered = serializers.SerializerMethodField()
    class Meta:
        model = Problem
        fields = '__all__'

    def get_is_checked(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            student = Student.objects.get(user=request.user)
            return Answer.objects.filter(problem=obj, student=student, is_check=True).exists()
        return False
    
    def get_is_answered(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            student = Student.objects.get(user=request.user)
            return Answer.objects.filter(problem=obj, student=student).exists()
        return False

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class StudentRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    name = serializers.CharField(write_only=True)
    faculty = serializers.CharField(write_only=True)

    class Meta:
        model = Student
        fields = ['username', 'password', 'name', 'faculty']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        student = Student.objects.create(
            user=user,
            name=validated_data['name'],
            faculty=validated_data['faculty']
        )
        return student

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'problem', 'is_check', 'student', 'text', 'file', 'is_right']
        read_only_fields = ['id', 'is_check']

    def create(self, validated_data):
        return Answer.objects.create(**validated_data)

class StudentProblemSerializer(serializers.ModelSerializer):
    is_checked = serializers.SerializerMethodField()
    answer = serializers.SerializerMethodField()
    teacher = serializers.ReadOnlyField(source='teacher.name')

    class Meta:
        model = Problem
        fields = '__all__'

    def get_is_checked(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            student = Student.objects.get(user=request.user)
            return Answer.objects.filter(problem=obj, student=student, is_check=True).exists()
        return False
    def get_answer(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            student = Student.objects.get(user=request.user)
            anser = Answer.objects.filter(problem=obj, student=student).first()
            if anser:
                serializer = AnswerSerializer(anser)
                return serializer.data
        return None

class ProblemSerializer(serializers.ModelSerializer):
    teacher = serializers.ReadOnlyField(source='teacher.name')
    students = serializers.SerializerMethodField()
    class Meta:
        model = Problem
        fields = '__all__'
    
    def get_students(self, obj):
        students = obj.students.all()
        serializer = StudentSerializer(students, many=True, context={'request': self.context.get('request')})
        return serializer.data