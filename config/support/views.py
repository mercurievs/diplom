
from pyexpat.errors import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from .forms import ProfileForm

@login_required
def edit_profile_view(request):
    profile = request.user.profile
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Профиль успешно обновлён!')
            return redirect('support_app:dashboard')  # замените на нужную страницу
    else:
        form = ProfileForm(instance=profile)
    return render(request, 'support_app/edit_profile.html', {'form': form})
