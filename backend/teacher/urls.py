from .views import *
from rest_framework.routers import DefaultRouter
from django.urls import path

router = DefaultRouter()
router.register(r'teacher', TeacherProblemViewSet, basename='teacherproblem')
router.register(r'answers', TeacherAnswersViewSet, basename='answer')


urlpatterns = [
    path('register/teacher/', TeacherRegistrationView.as_view(), name='register_teacher'),
    path('answer/<int:pk>/', TeacherAnswerView.as_view(), name='answer-detail'),
    path('students/', AllStudentsView.as_view(), name='all-students'),
    path('problem/create/', ProblemCreateView.as_view(), name='create_problem'),
    path('delete/', DeleteProblem.as_view(), name='delete_problem'),
    path('answer/check/', AnswerCheck.as_view(), name='answer_check'),
]

urlpatterns += router.urls