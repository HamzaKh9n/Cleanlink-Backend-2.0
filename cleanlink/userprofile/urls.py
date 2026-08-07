from django.urls import path

from .views import PublicProfileView, UpdateProfileView, UpdateRegionView, UserProfileView

urlpatterns = [
    path("profile/", UserProfileView.as_view(), name="profile"),
    path("profile/update/", UpdateProfileView.as_view(), name="profile-update"),
    path("profile/public/", PublicProfileView.as_view(), name="public-profile"),
    path("region/", UpdateRegionView.as_view(), name="region"),
]
