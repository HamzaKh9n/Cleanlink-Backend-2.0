from django.urls import path

from .views import AssignReportView, ListReportsView, ResolveReportView

urlpatterns = [
    path("reports/", ListReportsView.as_view(), name="admin-reports"),
    path("reports/<str:report_id>/assign/", AssignReportView.as_view(), name="assign-report"),
    path("reports/<str:report_id>/resolve/", ResolveReportView.as_view(), name="resolve-report"),
]
