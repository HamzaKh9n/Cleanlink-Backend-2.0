from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .dummy import AuthResponse


def _success_response(message: str, data: dict, status_code: int = status.HTTP_200_OK) -> Response:
    return Response({"success": True, "message": message, "data": data}, status=status_code)


class SignupView(APIView):
    def post(self, request, *args, **kwargs) -> Response:
        payload = AuthResponse.getSignupResponse()
        return _success_response(payload["message"], payload["data"], status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request, *args, **kwargs) -> Response:
        payload = AuthResponse.getLoginResponse()
        return _success_response(payload["message"], payload["data"], status.HTTP_200_OK)


class LogoutView(APIView):
    def post(self, request, *args, **kwargs) -> Response:
        return _success_response("Logout request received", {"message": "Logged out successfully"}, status.HTTP_200_OK)


class RefreshView(APIView):
    def post(self, request, *args, **kwargs) -> Response:
        return _success_response("Refresh request received", {"access_token": "dummy_access_token", "refresh_token": "dummy_refresh_token"}, status.HTTP_200_OK)


class MeView(APIView):
    def get(self, request, *args, **kwargs) -> Response:
        payload = AuthResponse.getMeResponse()
        return _success_response("Authenticated user profile", payload["data"], status.HTTP_200_OK)
