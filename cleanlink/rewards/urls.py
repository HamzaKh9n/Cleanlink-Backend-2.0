from django.urls import path

from .views import GetRewardsView, RedeemRewardView

urlpatterns = [
    path("", GetRewardsView.as_view(), name="rewards"),
    path("redeem/", RedeemRewardView.as_view(), name="redeem-reward"),
]
