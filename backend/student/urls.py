from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'student', StudentProblemViewSet, basename='studentproblem')

urlpatterns = [
    path('register/student/', StudentRegistrationView.as_view(), name='register_student'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('answer/create/', AnswerCreateView.as_view(), name='answer-create'),
    path('problem/<int:pk>/', ProblemDetailView.as_view(), name='problem-detail'),
    path('user/', CheckRole.as_view(), name='check_role'),
]



urlpatterns += router.urls
