from rest_framework.permissions import BasePermission
from .models import Student

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        student = Student.objects.filter(user=request.user)
        return student.exists()
