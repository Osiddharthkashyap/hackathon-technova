# SevaConnect Frontend ↔ Backend Team Workflow

This document is designed so multiple programmers can work in parallel without depending on each other's unfinished code.

## 1. Team Boundaries

### Frontend team owns

```text
React UI
Routing
State management
API client
Loading/error states
Form validation UX
Accessibility
Responsive design
```

### Backend team owns

```text
REST API
Authentication
Authorization
Business rules
Database
Eligibility engine
AI orchestration
File storage
Notifications
Audit logging
```

### Shared

```text
API contract
DTOs
OpenAPI specification
Error codes
Enums
Authentication behavior
```

## 2. Source of Truth

Create:

```text
docs/api/openapi.yaml
```

The OpenAPI file is the contract.

Workflow:

```text
OpenAPI
   ↓
Frontend mock/client
   ↓
Frontend development

OpenAPI
   ↓
Backend controllers
   ↓
Backend development
```

## 3. Monorepo Structure

Recommended:

```text
seva-connect/
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   ├── api-contract/
│   ├── types/
│   ├── validation/
│   └── config/
│
├── docs/
│   ├── API_CONTRACT.md
│   ├── AUTH_SECURITY.md
│   └── api/
│       └── openapi.yaml
│
├── .env.example
├── package.json
└── README.md
```

## 4. Frontend API Client

Do not call fetch/axios directly from random components.

Use:

```text
src/
└── services/
    └── api/
        ├── client.ts
        ├── auth.ts
        ├── users.ts
        ├── schemes.ts
        ├── eligibility.ts
        ├── documents.ts
        ├── applications.ts
        ├── ai.ts
        └── notifications.ts
```

Example:

```ts
const scheme = await schemesApi.getById(schemeId);
```

not:

```ts
fetch("/api/v1/schemes/" + schemeId);
```

inside UI components.

## 5. Shared Types

Create shared DTOs:

```ts
type UserRole =
  | "CITIZEN"
  | "ADMIN"
  | "CONTENT_MANAGER"
  | "SUPPORT_AGENT";

type EligibilityStatus =
  | "POTENTIALLY_RELEVANT"
  | "NEEDS_VERIFICATION"
  | "MORE_INFORMATION_NEEDED"
  | "DOES_NOT_MATCH";
```

The frontend should consume the same contract types as the backend where the repository setup permits.

## 6. Environment Variables

### Frontend

```text
VITE_API_BASE_URL=https://api.example.com/api/v1
```

Only public configuration belongs in frontend environment variables.

Never put:

```text
DATABASE_URL
JWT_SECRET
OPENAI_API_KEY
PRIVATE_STORAGE_KEY
```

in frontend variables.

### Backend

```text
PORT=4000
DATABASE_URL=
REDIS_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
AI_PROVIDER_API_KEY=
VECTOR_DB_URL=
STORAGE_BUCKET=
ALLOWED_ORIGINS=
```

## 7. Authentication Flow

```text
Frontend
   │
   │ POST /auth/login
   ▼
Backend
   │
   ├── validates credentials
   ├── creates session
   └── returns access token + refresh cookie
   │
   ▼
Frontend
   │
   └── API requests with Authorization: Bearer <accessToken>
```

On `401`:

```text
API request
   ↓
401
   ↓
POST /auth/refresh
   ↓
New access token
   ↓
Retry original request once
```

If refresh fails:

```text
Clear auth state
→ redirect to login
```

Do not create infinite retry loops.

## 8. Authorization UI

Frontend may hide unavailable actions for UX, but backend remains authoritative.

Example:

```text
User role = CITIZEN

[View Scheme]        visible
[Edit Scheme]        hidden

Backend:
PATCH /admin/schemes/:id
→ 403 FORBIDDEN
```

## 9. Error Handling

Centralize API errors:

```ts
type ApiError = {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
};
```

UI maps codes to user-friendly messages.

Example:

```text
VALIDATION_ERROR
→ "Please check the highlighted fields."

UNAUTHORIZED
→ "Please sign in again."

FORBIDDEN
→ "You don't have permission to perform this action."

RATE_LIMITED
→ "Too many requests. Please try again shortly."
```

Never show raw backend error strings if they may expose internals.

## 10. Loading States

Every API-driven screen supports:

```text
Loading
Success
Empty
Error
Retry
```

For mutations:

```text
Idle
Submitting
Success
Error
```

Disable duplicate submissions.

## 11. API Mocking

Frontend can work before backend completion using MSW or equivalent.

Example mock:

```text
GET /api/v1/schemes
→ mock scheme list

GET /api/v1/schemes/:id
→ mock scheme detail

POST /api/v1/ai/chat
→ mock AI response
```

Once backend is ready, change only the environment/base URL and disable mocks.

## 12. Branch Strategy

Recommended:

```text
main
  │
  ├── develop
  │
  ├── feat/frontend-dashboard
  ├── feat/frontend-ai
  ├── feat/backend-auth
  ├── feat/backend-schemes
  ├── feat/backend-eligibility
  └── feat/backend-ai
```

Avoid multiple developers editing the same large file.

## 13. Pull Request Rules

Every PR should include:

```text
What changed?
Why?
API changes?
Database migration?
Security impact?
Tests?
Screenshots for UI?
```

If an API contract changes:

```text
1. Update OpenAPI
2. Update API contract docs
3. Update shared types
4. Update backend
5. Update frontend
6. Add/adjust tests
```

## 14. Commit Convention

Use:

```text
feat: add scheme recommendation endpoint
feat: add AI assistant UI
fix: prevent duplicate application submission
fix: enforce application ownership
docs: update authentication contract
test: add scheme authorization tests
refactor: extract API client
```

## 15. Definition of Done

### Frontend

- UI implemented
- responsive
- accessible
- API client used
- loading/empty/error states
- validation
- auth state handled
- tests where applicable

### Backend

- endpoint implemented
- schema validation
- authentication
- authorization
- ownership check
- error contract
- rate limiting
- audit requirements
- tests
- API documentation

### AI

- prompt defined
- retrieval source defined
- grounding implemented
- output schema defined
- source citations returned
- prompt-injection checks
- privacy/data-minimization review

## 16. Parallel Development Plan

### Developer 1 — Authentication

```text
/auth/*
/users/me
session handling
RBAC middleware
```

### Developer 2 — Schemes

```text
/schemes/*
scheme database
search/filter
scheme details
```

### Developer 3 — Eligibility

```text
/eligibility/*
rule engine
recommendations
match explanations
```

### Developer 4 — AI

```text
/ai/*
RAG
LLM integration
AI guardrails
citations
```

### Developer 5 — Frontend

```text
dashboard
scheme pages
auth UI
application UI
```

### Developer 6 — AI Frontend

```text
AI chat
recommendations
explanations
document assistant
```

All developers work against the same API contract.

## 17. Never Do This

Do not:

```text
frontend → database
frontend → AI provider directly
frontend → storage bucket with secret credentials
frontend → admin authorization
```

Correct:

```text
Frontend
   ↓
API
   ↓
Auth + Authorization
   ↓
Service
   ↓
Database / AI / Storage
```
