from django.urls import path

from .views import AICallbackView

urlpatterns = [
    path("callback/", AICallbackView.as_view(), name="ai-callback"),
]
