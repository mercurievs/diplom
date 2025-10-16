
from django.contrib import admin
from .models import Profile, Ticket, Feedback, ContactInfo

admin.site.site_header = "Административная панель IT Support"
admin.site.site_title = "IT Support Admin"
admin.site.index_title = "Управление заявками и пользователями"

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'department', 'position')


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'status', 'priority', 'assigned_to', 'created_at')
    list_filter = ('status', 'priority')
    search_fields = ('title', 'description', 'user__email', 'user__username')

admin.site.register(Feedback)
admin.site.register(ContactInfo)
