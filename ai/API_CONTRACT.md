# SevaConnect API Contract

Version: `v1`

This document is the shared contract between frontend, backend, AI, and integration developers.

## 1. API Rules

- Base URL: `/api/v1`
- JSON request/response format unless an endpoint explicitly handles file upload.
- Authentication: short-lived access token + rotating refresh token.
- Authorization: role-based access control (RBAC) plus resource ownership checks.
- IDs: UUIDs.
- Dates: ISO-8601 UTC.
- Pagination: cursor-based where collections can grow.
- Never expose database IDs that are not intended for clients.
- All successful responses use a predictable envelope.
- All errors use the same error envelope.

## 2. Standard Response

### Success

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_01J..."
  }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": [
      {
        "field": "email",
        "reason": "Invalid email address"
      }
    ]
  },
  "meta": {
    "requestId": "req_01J..."
  }
}
```

Never return stack traces, SQL errors, tokens, secrets, or internal service details.

## 3. HTTP Conventions

| Method | Meaning |
|---|---|
| GET | Read |
| POST | Create/action |
| PUT | Full update |
| PATCH | Partial update |
| DELETE | Delete |

Common status codes:

| Status | Use |
|---|---|
| 200 | Successful read/update |
| 201 | Created |
| 202 | Accepted async job |
| 204 | Successful delete/no body |
| 400 | Malformed request |
| 401 | Missing/invalid authentication |
| 403 | Authenticated but not authorized |
| 404 | Resource not found |
| 409 | Conflict |
| 422 | Validation/business-rule failure |
| 429 | Rate limited |
| 500 | Unexpected server error |
| 503 | Dependency unavailable |

## 4. Authentication APIs

### POST `/auth/register`

Request:

```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "password": "StrongPassword123!"
}
```

Response `201`:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Aarav Sharma",
      "email": "aarav@example.com",
      "role": "CITIZEN",
      "emailVerified": false
    }
  },
  "meta": {
    "requestId": "req_..."
  }
}
```

### POST `/auth/login`

Request:

```json
{
  "email": "aarav@example.com",
  "password": "StrongPassword123!"
}
```

Recommended browser behavior:
- Access token: short-lived and kept in memory.
- Refresh token: `HttpOnly`, `Secure`, `SameSite` cookie.
- Do not put refresh tokens in localStorage.

### POST `/auth/refresh`

Rotates the refresh token and returns a new access token.

### POST `/auth/logout`

Revokes the current refresh-token session.

### POST `/auth/verify-email`

Verifies a one-time email verification token.

### POST `/auth/forgot-password`

Request:

```json
{
  "email": "aarav@example.com"
}
```

Always return a generic success response to prevent account enumeration.

### POST `/auth/reset-password`

Request:

```json
{
  "token": "one-time-token",
  "newPassword": "NewStrongPassword123!"
}
```

### GET `/auth/me`

Returns the authenticated user and authorization context.

## 5. User/Profile APIs

### GET `/users/me`

### PATCH `/users/me`

### GET `/users/me/profile`

### PUT `/users/me/profile`

Profile example:

```json
{
  "dateOfBirth": "2001-05-12",
  "gender": "MALE",
  "state": "Uttar Pradesh",
  "district": "Bareilly",
  "residenceType": "RURAL",
  "annualFamilyIncome": 200000,
  "occupation": "FARMER",
  "householdSize": 4
}
```

Sensitive profile data must be returned only to the authenticated owner or an explicitly authorized service.

## 6. Scheme APIs

### GET `/schemes`

Query parameters:

```text
q
category
state
pageSize
cursor
sort
```

### GET `/schemes/{schemeId}`

### GET `/schemes/{schemeId}/eligibility`

Returns deterministic eligibility evaluation for the current user.

### GET `/schemes/{schemeId}/documents`

Returns required documents.

### POST `/schemes/{schemeId}/save`

### DELETE `/schemes/{schemeId}/save`

### GET `/users/me/saved-schemes`

## 7. Recommendation APIs

### POST `/recommendations/run`

Request:

```json
{
  "mode": "PROFILE_BASED"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "schemeId": "uuid",
        "status": "POTENTIALLY_RELEVANT",
        "score": 0.91,
        "matchedCriteria": [
          "income",
          "state",
          "occupation"
        ],
        "needsVerification": [
          "income_certificate"
        ]
      }
    ]
  }
}
```

The score is for ranking/explanation. It must not replace authoritative eligibility rules.

## 8. Documents APIs

### GET `/users/me/documents`

### POST `/users/me/documents/upload`

Use `multipart/form-data`.

Allowed file types should be explicitly configured. Validate:
- MIME type
- extension
- file signature/magic bytes
- maximum size
- malware scan status

Do not execute or render uploaded files on the API server.

### DELETE `/users/me/documents/{documentId}`

### GET `/users/me/documents/readiness`

## 9. Application APIs

### GET `/users/me/applications`

### POST `/users/me/applications`

Request:

```json
{
  "schemeId": "uuid"
}
```

### GET `/users/me/applications/{applicationId}`

### PATCH `/users/me/applications/{applicationId}`

Only allowed status transitions may be accepted.

Example state machine:

```text
DISCOVERED
    ↓
ELIGIBILITY_CHECKED
    ↓
DOCUMENTS_READY
    ↓
APPLICATION_SUBMITTED
    ↓
UNDER_REVIEW
    ↓
APPROVED / REJECTED / ACTION_REQUIRED
```

### POST `/users/me/applications/{applicationId}/events`

Internal/admin integrations may create verified events. Citizens must not be able to forge official status events.

## 10. AI APIs

### POST `/ai/chat`

Request:

```json
{
  "conversationId": "uuid",
  "message": "Which housing schemes may be relevant to me?",
  "language": "en"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "conversationId": "uuid",
    "message": {
      "id": "uuid",
      "role": "assistant",
      "content": "Based on your profile..."
    },
    "intent": "SCHEME_DISCOVERY",
    "recommendations": [],
    "sources": [
      {
        "title": "Official Scheme Information",
        "schemeId": "uuid",
        "sourceType": "OFFICIAL"
      }
    ],
    "disclaimer": "Final eligibility is determined by the relevant authority."
  }
}
```

### POST `/ai/extract-profile`

Converts natural-language input into a proposed structured profile.

The result must be presented for user confirmation before overwriting profile data.

### POST `/ai/explain-scheme`

### POST `/ai/explain-eligibility`

### POST `/ai/explain-document`

### POST `/ai/translate`

AI output must be grounded in retrieved scheme data for factual scheme claims.

## 11. AI Conversation APIs

### GET `/ai/conversations`

### GET `/ai/conversations/{conversationId}`

### DELETE `/ai/conversations/{conversationId}`

Never expose another user's conversation by ID.

## 12. Notifications

### GET `/users/me/notifications`

### PATCH `/users/me/notifications/{notificationId}/read`

### PATCH `/users/me/notification-preferences`

## 13. Admin APIs

Admin endpoints must be separated from citizen APIs.

```text
/api/v1/admin/users
/api/v1/admin/schemes
/api/v1/admin/scheme-sources
/api/v1/admin/applications
/api/v1/admin/audit-logs
```

Use explicit admin roles and permissions. Do not rely on frontend route hiding for authorization.

## 14. Idempotency

For important POST operations such as application creation, payment-like actions, external submissions, or webhook processing:

```http
Idempotency-Key: <unique-client-generated-key>
```

The backend stores the result for a bounded period and returns the original result for retries.

## 15. Request Correlation

Frontend sends:

```http
X-Request-ID: <uuid>
```

Backend generates one if absent and returns it in:

```http
X-Request-ID: <uuid>
```

Use this ID in logs and support/debugging.

## 16. Versioning

Do not silently break existing clients.

```text
/api/v1/...
/api/v2/...
```

Deprecations must be documented before removal.

## 17. Ownership Rule

For every user resource, backend derives the user from authentication:

```text
request.user.id
```

Never trust:

```text
body.userId
query.userId
path.userId
```

for citizen-owned resources.

## 18. API Development Rule

Frontend programmers build against this contract using mock data/MSW or an OpenAPI-generated client. Backend programmers implement the same contract. Neither team should depend on undocumented response fields.
