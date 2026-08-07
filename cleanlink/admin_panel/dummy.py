ADMIN_REPORTS_RESPONSE = {
    "reports": [
        {
            "id": "rep_001",
            "title": "Overflowing bin near Market Street",
            "status": "open",
            "assigned_to": None,
        }
    ],
    "count": 1,
}

ASSIGN_REPORT_RESPONSE = {
    "id": "rep_001",
    "assigned_to": "admin_001",
    "status": "assigned",
}

RESOLVE_REPORT_RESPONSE = {
    "id": "rep_001",
    "status": "resolved",
}
