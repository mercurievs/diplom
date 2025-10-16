from django import forms
from .models import Profile


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['department', 'faculty', 'position', 'room']
        labels = {
            'department': 'Отдел',
            'faculty': 'Факультет',
            'position': 'Должность',
            'room': 'Аудитория / кабинет',
        }
        widgets = {
            'department': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Например, IT-отдел'}),
            'faculty': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Факультет информационных технологий'}),
            'position': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Инженер / преподаватель'}),
            'room': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Каб. 204'}),
        }
