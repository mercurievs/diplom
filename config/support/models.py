# models.py (начальная версия)
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save


class Profile(models.Model):
    """Дополнительные поля пользователя (OneToOne с django.contrib.auth.User)."""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField("ФИО", max_length=255)  
    department = models.CharField("Отдел", max_length=200, blank=True, null=True)
    faculty = models.CharField("Факультет", max_length=200, blank=True, null=True)
    position = models.CharField("Должность", max_length=200, blank=True,null=True)
    room = models.CharField("Аудитория/Кабинет", max_length=100, blank=True, null=True)
    phone = models.CharField("Телефон", max_length=30, blank=True)
    # можно добавить дополнительные поля: employee_id, avatar и т.д.

    class Meta:
        verbose_name = "Профиль пользователя"
        verbose_name_plural = "Профили пользователей"
        
    def __str__(self):
        return f"{self.full_name} ({self.user.email})"


class Ticket(models.Model):
    """Модель заявки в IT Support."""
    STATUS_CHOICES = [
        ('new', 'Новая'),
        ('open', 'В работе'),
        ('resolved', 'Решена'),
        ('closed', 'Закрыта'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Низкий'),
        ('medium', 'Средний'),
        ('high', 'Высокий'),
        ('critical', 'Критический'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tickets')
    title = models.CharField("Краткое описание", max_length=200)
    description = models.TextField("Описание проблемы")
    reported_at = models.DateTimeField("Дата и время сообщения", default=timezone.now)
    incident_date = models.DateTimeField("Когда произошло", null=True, blank=True)
    location = models.CharField("Место (аудитория/кабинет)", max_length=200, blank=True)
    status = models.CharField("Статус", max_length=20, choices=STATUS_CHOICES, default='new')
    priority = models.CharField("Приоритет", max_length=20, choices=PRIORITY_CHOICES, default='medium')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='assigned_tickets')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    notified = models.BooleanField(default=False)  # флаг: уведомление отправлено

    class Meta:
        verbose_name= "Заявка"
        verbose_name_plural = "Заявки"
        
    def __str__(self):
        return f"#{self.pk} — {self.title} ({self.get_status_display()})"



class Feedback(models.Model):
    """Обратная связь от пользователя (не обязательно связана с тикетом)."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Обратная связь"
        verbose_name_plural = "Обратная связь"
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Feedback #{self.pk} от {self.email}"
    


class ContactInfo(models.Model):
    """Контактная информация организации/службы поддержки (настраиваемая через админку)."""
    phone = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    address = models.CharField(max_length=255, blank=True)
    working_hours = models.CharField(max_length=200, blank=True)
    
    class Meta:
        verbose_name = "Контактная информация"
        verbose_name_plural = "Контактная информация"

    def __str__(self):
        return f"Контакты ({self.email or 'без email'})"
