from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .dummy import HEALTH_RESPONSE


def _success_response(message: str, data: dict, status_code: int = status.HTTP_200_OK) -> Response:
    return Response({"success": True, "message": message, "data": data}, status=status_code)


class HealthView(APIView):
    def get(self, request, *args, **kwargs) -> Response:
        return _success_response("Service healthy", HEALTH_RESPONSE, status.HTTP_200_OK)
