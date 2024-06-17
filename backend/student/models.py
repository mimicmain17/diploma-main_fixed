from django.db import models
from django.contrib.auth.models import User

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    faculty = models.CharField(max_length=100,  choices=(
        ("AIandML", "ИИ и машинное обучение"),
        ("cybersecurity", "Кибербезопасность"),
        ("networks", "Сетевые технологии и коммуникации"),
        ("bioInformatics", "Биоинформатика и медицинские IT"),
        ("VRandAR", "Виртуальная и дополненная реальность"),
        ("quantInformatics", "Квантовая информатика"),
        ("digitalArt", "Цифровое искусство"),
    ))

class Problem(models.Model):
    subject = models.CharField(max_length=100)
    theme = models.CharField(max_length=100)
    created_at = models.DateField(auto_now_add=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    file = models.FileField(null=True, blank=True, upload_to="static/")
    faculty = models.CharField(max_length=100,  choices=(
        ("AIandML", "ИИ и машинное обучение"),
        ("cybersecurity", "Кибербезопасность"),
        ("networks", "Сетевые технологии и коммуникации"),
        ("bioInformatics", "Биоинформатика и медицинские IT"),
        ("VRandAR", "Виртуальная и дополненная реальность"),
        ("quantInformatics", "Квантовая информатика"),
        ("digitalArt", "Цифровое искусство"),
    ), blank=True, null=True)
    comment = models.TextField(null=True, blank=True)
    students = models.ManyToManyField(Student, blank=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)

class Answer(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    create_at = models.DateField(auto_now_add=True, blank=True)
    is_right = models.BooleanField(default=False, blank=True)
    is_check = models.BooleanField(default=False, blank=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    text = models.TextField()
    file = models.FileField(null=True, blank=True, upload_to="static/")
