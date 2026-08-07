from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .dummy import NOTIFICATIONS_RESPONSE, SUBSCRIBE_RESPONSE


def _success_response(message: str, data: dict, status_code: int = status.HTTP_200_OK) -> Response:
    return Response({"success": True, "message": message, "data": data}, status=status_code)


class GetNotificationsView(APIView):
    def get(self, request, *args, **kwargs) -> Response:
        return _success_response("Notifications retrieved", NOTIFICATIONS_RESPONSE, status.HTTP_200_OK)


class SubscribeView(APIView):
    def post(self, request, *args, **kwargs) -> Response:
        return _success_response("Subscription updated", SUBSCRIBE_RESPONSE, status.HTTP_200_OK)
