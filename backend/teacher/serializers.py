
from rest_framework import serializers
from student.models import *
from student.serializers import AnswerSerializer, ProblemSerializer, StudentSerializer
class TeacherRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )
        teacher = Teacher.objects.create(
            user=user,
            name=validated_data['name'],
        )
        return teacher

class TeacherAnswerSerializer(serializers.ModelSerializer):
    # student = serializers.ReadOnlyField(source='student.name,student.faculty')
    student = serializers.SerializerMethodField(source='student', read_only=True)
    class Meta:
        model = Answer
        fields = ['id', 'problem', 'is_check', 'student', 'text', 'file', 'is_right']
        read_only_fields = ['id', 'is_check']

    def create(self, validated_data):
        return Answer.objects.create(**validated_data)
    
    def get_student(self, obj):
        return StudentSerializer(obj.student).data

class CreateProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = '__all__'

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'