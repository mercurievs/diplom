from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import DetailView
from django.contrib.auth import login
from django.db.models import Q
from .forms import EmployerSearchForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages

def register(reques):
    """Регистрация нового пользователя."""
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Регистрация прошла успешно. Заполните профиль!")
            return redirect('support:dashboard')
    else:
        form = UserRegistrationForm()
    return render(request, 'support/register.html', {'form': form})
        
@login_required
def dashboard(request):
    """Личный кабинет сотрудника."""
    profile, created = .objects.get_or_create(user=request.user)
    return render(request, 'support/dashboard.html', {"profile": profile})

@login
def edit_profile(request):
    """Редактирование профиля пользователя."""
    profile = get_object_or_404(Profile, user=request.user)
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(request, "Профиль успешно обновлен.")
            return redirect('support:dashboard')
    else:
        form = ProfileForm(instance=profile)
    return render(request, 'support/edit_profile.html', {'form': form})