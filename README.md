# CleanLink Backend v1.1

CleanLink Backend v1.1 is the first completed backend API scaffold for the CleanLink platform. It is built with Django, Django REST Framework, and Django CORS headers. The codebase implements a dummy-data API layer that returns stable JSON contracts for all major platform functions such as authentication, user profile, reports, notifications, rewards, admin operations, AI callbacks, and common health checks.

This repository represents a versioned API foundation rather than a production-ready business system. It is intentionally shaped as a dummy API scaffold that can be connected to real authentication, authorisation, storage, and business-rule layers later.

## Project status

Version: `v1.1`

Status: completed scaffold / dummy API implementation.

Scope:
- Django backend project shell
- Django REST Framework API views
- API route registration across all major app domains
- Dummy response payload factories
- CORS-enabled settings for browser-based frontend integration
- Command-line smoke testing against the API

## Codebase structure

The top-level Django project lives in the `cleanlink/` directory inside the workspace.

```text
cleanlink/
├── manage.py
├── package.json
├── smoke-test.js
├── admin_panel/
├── ai/
├── authen/
├── cleanlink/
├── common/
├── notifications/
├── reports/
├── rewards/
├── userprofile/
└── db.sqlite3
```

### Key files

- [cleanlink/manage.py](cleanlink/manage.py) launches the Django project.
- [cleanlink/cleanlink/settings.py](cleanlink/cleanlink/settings.py) contains Django settings, installed apps, middleware, database setup, and CORS configuration.
- [cleanlink/cleanlink/urls.py](cleanlink/cleanlink/urls.py) registers all API namespaces and maps them to the backend app routers.
- [cleanlink/smoke-test.js](cleanlink/smoke-test.js) performs endpoint smoke validation against the live API.
- [cleanlink/package.json](cleanlink/package.json) exposes the `test:api` runner.

## Django project settings

The Django project is configured as a REST API service with the following high-level responsibilities:

- `INSTALLED_APPS` contains the Django core apps and all backend domain apps.
- `rest_framework` is enabled for class-based API views and response formatting.
- `corsheaders` is enabled through middleware and `corsheaders.middleware.CorsMiddleware`.
- `CORS_ALLOW_ALL_ORIGINS = True` is configured to permit browser clients from different frontends during development.
- `DEBUG = True` is enabled for the scaffold.
- The SQLite database is configured through `DATABASES` using the local file `db.sqlite3`.

## Application architecture

The project is separated into domain apps that align with the major CleanLink feature groups.

### 1. Authentication app - `authen`

Location: [cleanlink/authen](cleanlink/authen)

The `authen` app exposes authentication-related dummy API endpoints:

- Signup
- Login
- Logout
- Refresh token flow
- Current authenticated user profile

Primary files:
- [cleanlink/authen/views.py](cleanlink/authen/views.py)
- [cleanlink/authen/urls.py](cleanlink/authen/urls.py)
- [cleanlink/authen/dummy.py](cleanlink/authen/dummy.py)

Contract summary:

- `POST /api/v2/auth/signup/`
- `POST /api/v2/auth/login/`
- `POST /api/v2/auth/logout/`
- `POST /api/v2/auth/refresh/`
- `GET /api/v2/auth/me/`

The shape returned by Django REST framework is a success envelope:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

For login/signup the `data` object includes user metadata and access/refresh token values.

### 2. User profile app - `userprofile`

Location: [cleanlink/userprofile](cleanlink/userprofile)

The `userprofile` app is responsible for user profile access and profile mutation endpoints.

Routes:

- `GET /api/v2/users/profile/`
- `PUT /api/v2/users/profile/update/`
- `GET /api/v2/users/profile/public/`
- `PUT /api/v2/users/region/`

The dummy payloads used by these views are stored in [cleanlink/userprofile/dummy.py](cleanlink/userprofile/dummy.py) and returned from [cleanlink/userprofile/views.py](cleanlink/userprofile/views.py).

### 3. Reports app - `reports`

Location: [cleanlink/reports](cleanlink/reports)

The `reports` domain represents the reporting workflow: listing, showing a report, creating a report, updating it, flagging it, voting, commenting, trending feed, searching, and handling appeals.

Routes:

- `GET /api/v2/reports/`
- `GET /api/v2/reports/<report_id>/`
- `POST /api/v2/reports/create/`
- `PUT /api/v2/reports/<report_id>/update/`
- `POST /api/v2/reports/<report_id>/flag/`
- `POST /api/v2/reports/<report_id>/vote/`
- `POST /api/v2/reports/<report_id>/comment/`
- `GET /api/v2/reports/<report_id>/comments/`
- `GET /api/v2/reports/trending/`
- `GET /api/v2/reports/search/?q=overflow`
- `POST /api/v2/reports/<report_id>/appeal/`

The dummy payload contract for these endpoints is declared in [cleanlink/reports/dummy.py](cleanlink/reports/dummy.py), and the view layer maps them through [cleanlink/reports/views.py](cleanlink/reports/views.py).

### 4. Notifications app - `notifications`

Location: [cleanlink/notifications](cleanlink/notifications)

The notification dummy payloads include a list of notifications and a subscription response.

Routes:

- `GET /api/v2/notifications/`
- `POST /api/v2/notifications/subscribe/`

### 5. Rewards app - `rewards`

Location: [cleanlink/rewards](cleanlink/rewards)

The rewards app models a user reward catalogue and reward redemption flow.

Routes:

- `GET /api/v2/rewards/`
- `POST /api/v2/rewards/redeem/`

### 6. Admin panel app - `admin_panel`

Location: [cleanlink/admin_panel](cleanlink/admin_panel)

The admin panel currently exposes a report-management workflow for listing reports and resolving/assigning a report.

Routes:

- `GET /api/v2/admin/reports/`
- `POST /api/v2/admin/reports/<report_id>/assign/`
- `POST /api/v2/admin/reports/<report_id>/resolve/`

### 7. AI app - `ai`

Location: [cleanlink/ai](cleanlink/ai)

The AI callback endpoint is a placeholder integration point for an external AI workflow.

Route:

- `POST /api/v2/ai/callback/`

### 8. Common app - `common`

Location: [cleanlink/common](cleanlink/common)

This domain currently hosts the health endpoint used for runtime readiness/availability checks.

Route:

- `GET /api/v2/common/health/`

## Standard response contract

Every endpoint is implemented as an APIView with a framework-level DRF `Response` wrapper.

The common success pattern is:

```python
return Response({
    "success": True,
    "message": "...",
    "data": {...}
}, status=200)
```

The common contract is therefore:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {
    "...": "..."
  }
}
```

The API shape is intentionally consistent so frontends can handle payloads through a single normalization layer.

## API router map

All API routes are mounted in [cleanlink/cleanlink/urls.py](cleanlink/cleanlink/urls.py):

```text
/api/v2/auth/ -> authen.urls
/api/v2/users/ -> userprofile.urls
/api/v2/reports/ -> reports.urls
/api/v2/notifications/ -> notifications.urls
/api/v2/rewards/ -> rewards.urls
/api/v2/admin/ -> admin_panel.urls
/api/v2/ai/ -> ai.urls
/api/v2/common/ -> common.urls
```

## CORS configuration

CORS support is enabled in the Django settings using `django-cors-headers`.

Relevant setup details:

- `corsheaders` is registered in `INSTALLED_APPS`
- `corsheaders.middleware.CorsMiddleware` is listed in `MIDDLEWARE`
- `CORS_ALLOW_ALL_ORIGINS = True` is active in the settings file

This enables browser-based requests to the API from developer frontends and local origins. The smoke test adds explicit origin and request-header checks so the runtime contract is validated instead of assuming the middleware is working.

## Smoke test

The smoke harness is implemented in [cleanlink/smoke-test.js](cleanlink/smoke-test.js).

It is used through the script:

```json
"test:api": "node smoke-test.js"
```

It performs the following verification steps:

1. Reads the route list from the endpoint definition map.
2. Sends HTTP requests to every endpoint using the configured API prefix.
3. Parses JSON bodies.
4. Validates the expected HTTP status codes.
5. Checks that the top-level response envelope is correct.
6. Checks that the nested payload has a data object and field types.
7. Verifies content types are JSON.
8. Checks CORS response headers.
9. Sends an `OPTIONS` preflight request for each route and confirms CORS allow headers are present.

The smoke test is intentionally detailed for the v1.1 completed scaffold because dummy backend responses need to be verified at the API boundary, not only as internal Python classes.

## Dummy payload model strategy

The dummy payloads are not database-driven. They are static dictionaries located under each app's `dummy.py` module.

Examples:

- [cleanlink/authen/dummy.py](cleanlink/authen/dummy.py)
- [cleanlink/reports/dummy.py](cleanlink/reports/dummy.py)
- [cleanlink/userprofile/dummy.py](cleanlink/userprofile/dummy.py)
- [cleanlink/notifications/dummy.py](cleanlink/notifications/dummy.py)
- [cleanlink/rewards/dummy.py](cleanlink/rewards/dummy.py)
- [cleanlink/admin_panel/dummy.py](cleanlink/admin_panel/dummy.py)
- [cleanlink/ai/dummy.py](cleanlink/ai/dummy.py)
- [cleanlink/common/dummy.py](cleanlink/common/dummy.py)

Each app's view calls a dummy payload builder and sends it through `_success_response()`.

## Security and future development notes

This is a scaffold, so the following are still intentionally basic or placeholder-level:

- Authentication is not connected to a user store or real token provider.
- Authorization is not implemented.
- Data persistence is configured only through SQLite and is not tied to business workflows.
- Error handlers return only the generic dummy success envelope pattern.
- Production secrets, domain validation, and deployment configuration are not yet hardened.

The long-term path is to replace the dummy payloads with real service/repository logic and to add proper validation, database migrations, permissions, and authentication tokens.

## Developer quick start

From the project root created as the workspace folder, start the Django development server:

```bash
python manage.py runserver
```

Then run the API smoke test:

```bash
cd cleanlink
npm run test:api
```

The test assumes that the API server is reachable at the default local Django address:

```text
http://127.0.0.1:8000
```

A different base URL can be passed by setting:

```bash
CLEANLINK_API_BASE_URL=http://your-host:port
```

## What is included in v1.1

The completed v1.1 backend includes:

- Django REST-style API endpoint scaffolding across all main product domains
- Stable API envelope: `success`, `message`, `data`
- Dummy JSON payloads for each endpoint
- URL registration points for all domain APIs
- CORS middleware and settings for browser origin compatibility
- Detailed command-line smoke verification that checks status, JSON formatting, payload fields, and CORS headers

This is a foundational API baseline for frontend integration, contract validation, and future business-domain implementation.
