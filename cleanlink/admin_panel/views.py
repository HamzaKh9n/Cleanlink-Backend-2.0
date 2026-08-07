from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .dummy import ADMIN_REPORTS_RESPONSE, ASSIGN_REPORT_RESPONSE, RESOLVE_REPORT_RESPONSE


def _success_response(message: str, data: dict, status_code: int = status.HTTP_200_OK) -> Response:
    return Response({"success": True, "message": message, "data": data}, status=status_code)


class ListReportsView(APIView):
    def get(self, request, *args, **kwargs) -> Response:
        return _success_response("Admin reports retrieved", ADMIN_REPORTS_RESPONSE, status.HTTP_200_OK)


class AssignReportView(APIView):
    def post(self, request, report_id: str, *args, **kwargs) -> Response:
        return _success_response("Report assigned", {"report_id": report_id, **ASSIGN_REPORT_RESPONSE}, status.HTTP_200_OK)


class ResolveReportView(APIView):
    def post(self, request, report_id: str, *args, **kwargs) -> Response:
        return _success_response("Report resolved", {"report_id": report_id, **RESOLVE_REPORT_RESPONSE}, status.HTTP_200_OK)
