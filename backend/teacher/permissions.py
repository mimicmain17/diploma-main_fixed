from rest_framework.permissions import BasePermission
from student.models import Teacher

class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        teacher = Teacher.objects.filter(user=request.user)
        return teacher.exists()
