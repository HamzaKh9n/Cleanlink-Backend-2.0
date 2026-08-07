from django.urls import path

from .views import GetNotificationsView, SubscribeView

urlpatterns = [
    path("", GetNotificationsView.as_view(), name="notifications"),
    path("subscribe/", SubscribeView.as_view(), name="subscribe"),
]
