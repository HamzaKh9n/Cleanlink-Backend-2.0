from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .dummy import REDEEM_RESPONSE, REWARDS_RESPONSE


def _success_response(message: str, data: dict, status_code: int = status.HTTP_200_OK) -> Response:
    return Response({"success": True, "message": message, "data": data}, status=status_code)


class GetRewardsView(APIView):
    def get(self, request, *args, **kwargs) -> Response:
        return _success_response("Rewards retrieved", REWARDS_RESPONSE, status.HTTP_200_OK)


class RedeemRewardView(APIView):
    def post(self, request, *args, **kwargs) -> Response:
        return _success_response("Reward redeemed", REDEEM_RESPONSE, status.HTTP_200_OK)
