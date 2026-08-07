from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .dummy import PROFILE_RESPONSE, PUBLIC_PROFILE_RESPONSE, REGION_RESPONSE


def _success_response(message: str, data: dict, status_code: int = status.HTTP_200_OK) -> Response:
    return Response({"success": True, "message": message, "data": data}, status=status_code)


class UserProfileView(APIView):
    def get(self, request, *args, **kwargs) -> Response:
        return _success_response("User profile retrieved", PROFILE_RESPONSE, status.HTTP_200_OK)


class UpdateProfileView(APIView):
    def put(self, request, *args, **kwargs) -> Response:
        return _success_response("Profile updated", PROFILE_RESPONSE, status.HTTP_200_OK)


class PublicProfileView(APIView):
    def get(self, request, *args, **kwargs) -> Response:
        return _success_response("Public profile retrieved", PUBLIC_PROFILE_RESPONSE, status.HTTP_200_OK)


class UpdateRegionView(APIView):
    def put(self, request, *args, **kwargs) -> Response:
        return _success_response("Region updated", REGION_RESPONSE, status.HTTP_200_OK)
