from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .dummy import (
    APPEAL_RESPONSE,
    COMMENTS_RESPONSE,
    COMMENT_RESPONSE,
    CREATED_REPORT_RESPONSE,
    FEED_RESPONSE,
    FLAG_RESPONSE,
    REPORT_DETAIL_RESPONSE,
    SEARCH_RESPONSE,
    TRENDING_RESPONSE,
    UPDATED_REPORT_RESPONSE,
    VOTE_RESPONSE,
)


def _success_response(message: str, data: dict, status_code: int = status.HTTP_200_OK) -> Response:
    return Response({"success": True, "message": message, "data": data}, status=status_code)


class FeedView(APIView):
    def get(self, request, *args, **kwargs) -> Response:
        return _success_response("Reports feed retrieved", FEED_RESPONSE, status.HTTP_200_OK)


class GetReportView(APIView):
    def get(self, request, report_id: str, *args, **kwargs) -> Response:
        return _success_response("Report retrieved", {"report_id": report_id, **REPORT_DETAIL_RESPONSE}, status.HTTP_200_OK)


class CreateReportView(APIView):
    def post(self, request, *args, **kwargs) -> Response:
        return _success_response("Report created", CREATED_REPORT_RESPONSE, status.HTTP_201_CREATED)


class UpdateReportView(APIView):
    def put(self, request, report_id: str, *args, **kwargs) -> Response:
        return _success_response("Report updated", {"report_id": report_id, **UPDATED_REPORT_RESPONSE}, status.HTTP_200_OK)


class FlagReportView(APIView):
    def post(self, request, report_id: str, *args, **kwargs) -> Response:
        return _success_response("Report flagged", {"report_id": report_id, **FLAG_RESPONSE}, status.HTTP_200_OK)


class VoteView(APIView):
    def post(self, request, report_id: str, *args, **kwargs) -> Response:
        return _success_response("Vote recorded", {"report_id": report_id, **VOTE_RESPONSE}, status.HTTP_200_OK)


class CommentView(APIView):
    def post(self, request, report_id: str, *args, **kwargs) -> Response:
        return _success_response("Comment added", {"report_id": report_id, **COMMENT_RESPONSE}, status.HTTP_201_CREATED)


class CommentsView(APIView):
    def get(self, request, report_id: str, *args, **kwargs) -> Response:
        return _success_response("Comments retrieved", {"report_id": report_id, **COMMENTS_RESPONSE}, status.HTTP_200_OK)


class TrendingView(APIView):
    def get(self, request, *args, **kwargs) -> Response:
        return _success_response("Trending reports retrieved", TRENDING_RESPONSE, status.HTTP_200_OK)


class SearchView(APIView):
    def get(self, request, *args, **kwargs) -> Response:
        return _success_response("Search results retrieved", SEARCH_RESPONSE, status.HTTP_200_OK)


class AppealView(APIView):
    def post(self, request, report_id: str, *args, **kwargs) -> Response:
        return _success_response("Appeal submitted", {"report_id": report_id, **APPEAL_RESPONSE}, status.HTTP_200_OK)
