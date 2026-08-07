from django.urls import path

from .views import (
    AppealView,
    CommentView,
    CommentsView,
    CreateReportView,
    FeedView,
    FlagReportView,
    GetReportView,
    SearchView,
    TrendingView,
    UpdateReportView,
    VoteView,
)

urlpatterns = [
    path("", FeedView.as_view(), name="feed"),
    path("create/", CreateReportView.as_view(), name="create-report"),
    path("<str:report_id>/", GetReportView.as_view(), name="get-report"),
    path("<str:report_id>/update/", UpdateReportView.as_view(), name="update-report"),
    path("<str:report_id>/flag/", FlagReportView.as_view(), name="flag-report"),
    path("<str:report_id>/vote/", VoteView.as_view(), name="vote"),
    path("<str:report_id>/comment/", CommentView.as_view(), name="comment"),
    path("<str:report_id>/comments/", CommentsView.as_view(), name="comments"),
    path("trending/", TrendingView.as_view(), name="trending"),
    path("search/", SearchView.as_view(), name="search"),
    path("<str:report_id>/appeal/", AppealView.as_view(), name="appeal"),
]
