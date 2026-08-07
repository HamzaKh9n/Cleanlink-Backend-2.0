FEED_RESPONSE = {
    "reports": [
        {
            "id": "rep_001",
            "title": "Overflowing bin near Market Street",
            "category": "waste",
            "status": "open",
            "region": "Downtown",
            "votes": 12,
        }
    ],
    "count": 1,
}

REPORT_DETAIL_RESPONSE = {
    "id": "rep_001",
    "title": "Overflowing bin near Market Street",
    "description": "The waste bins are full and spilling onto the sidewalk.",
    "category": "waste",
    "status": "open",
    "region": "Downtown",
    "votes": 12,
}

CREATED_REPORT_RESPONSE = {
    "id": "rep_002",
    "message": "Report created successfully",
}

UPDATED_REPORT_RESPONSE = {
    "id": "rep_001",
    "message": "Report updated successfully",
}

FLAG_RESPONSE = {
    "id": "rep_001",
    "flagged": True,
}

VOTE_RESPONSE = {
    "id": "rep_001",
    "vote": "up",
    "votes": 13,
}

COMMENT_RESPONSE = {
    "id": "cmt_001",
    "report_id": "rep_001",
    "message": "Thanks for reporting this.",
}

COMMENTS_RESPONSE = {
    "comments": [COMMENT_RESPONSE],
    "count": 1,
}

TRENDING_RESPONSE = {
    "trending": [
        {"id": "rep_001", "title": "Overflowing bin near Market Street", "score": 98}
    ],
}

SEARCH_RESPONSE = {
    "results": [REPORT_DETAIL_RESPONSE],
    "query": "overflow",
}

APPEAL_RESPONSE = {
    "id": "rep_001",
    "appeal": "Appeal submitted successfully",
}
