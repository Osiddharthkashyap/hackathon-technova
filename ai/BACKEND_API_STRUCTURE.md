# SevaConnect Backend API Structure

## 1. Recommended Backend Stack

```text
Node.js
TypeScript
NestJS or Fastify/Express
PostgreSQL
Redis
Object Storage
Vector Database
OpenAPI
```

Use one backend framework consistently across the project.

## 2. Folder Structure

```text
apps/api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── common/
│   │   ├── errors/
│   │   ├── guards/
│   │   ├── middleware/
│   │   ├── pipes/
│   │   ├── decorators/
│   │   ├── logging/
│   │   └── security/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── profiles/
│   │   ├── schemes/
│   │   ├── eligibility/
│   │   ├── recommendations/
│   │   ├── documents/
│   │   ├── applications/
│   │   ├── ai/
│   │   ├── notifications/
│   │   └── admin/
│   │
│   ├── database/
│   │   ├── migrations/
│   │   └── seed/
│   │
│   └── config/
│
├── test/
└── package.json
```

## 3. Module Pattern

Each module should have clear boundaries:

```text
schemes/
├── schemes.controller.ts
├── schemes.service.ts
├── schemes.repository.ts
├── schemes.schema.ts
├── schemes.dto.ts
└── schemes.spec.ts
```

Controller:
- HTTP concerns only.

Service:
- business logic.

Repository:
- persistence/data access.

DTO/schema:
- API validation and response contract.

## 4. Middleware Pipeline

```text
Request
  ↓
Request ID
  ↓
Security headers
  ↓
CORS
  ↓
Rate limiter
  ↓
Authentication
  ↓
Authorization
  ↓
Validation
  ↓
Controller
  ↓
Service
  ↓
Repository / external service
  ↓
Response serializer
```

## 5. Service Boundaries

```text
AuthService
UserService
ProfileService
SchemeService
EligibilityService
RecommendationService
DocumentService
ApplicationService
AIService
NotificationService
AuditService
```

Avoid a single `utils` service that contains business logic from every domain.

## 6. Eligibility Engine

Eligibility should be deterministic.

```text
Profile
  +
Scheme Rules
  ↓
Eligibility Engine
  ↓
Structured Result
```

Example:

```json
{
  "status": "POTENTIALLY_RELEVANT",
  "matchedCriteria": [
    "age",
    "state"
  ],
  "failedCriteria": [],
  "needsVerification": [
    "income_certificate"
  ]
}
```

The LLM can explain this result but should not silently replace the rules engine.

## 7. AI Service Boundary

```text
AIController
   ↓
AIService
   ├── IntentService
   ├── RetrievalService
   ├── EligibilityService
   ├── PromptService
   ├── LLMProvider
   └── OutputValidator
```

This keeps the provider replaceable.

## 8. Database Ownership

Each domain owns its repository/data-access layer.

Example:

```text
ApplicationService
   ↓
ApplicationRepository
   ↓
PostgreSQL
```

Do not allow unrelated modules to directly manipulate another module's tables without a defined interface.

## 9. Transaction Rules

Use transactions for operations that must be atomic.

Example:

```text
Create Application
+
Create Initial Application Event
```

Both succeed or both roll back.

## 10. External Service Isolation

Wrap third-party services:

```text
providers/
├── llm/
├── email/
├── storage/
├── vector-db/
└── government-integrations/
```

Application services should depend on interfaces, not provider-specific SDK calls everywhere.

## 11. Webhooks

For external callbacks:

```text
POST /webhooks/{provider}
```

Requirements:

- verify signature
- validate payload
- deduplicate event
- store event ID
- process asynchronously where possible
- return quickly
- audit result

## 12. Async Jobs

Use a queue for:

```text
document scanning
AI ingestion
embedding generation
email
notifications
large recommendation jobs
```

Do not make the user wait for long-running tasks when they can be asynchronous.

## 13. Observability

Every request should have:

```text
requestId
route
method
status
duration
userId (where appropriate and safe)
```

Metrics:

```text
API latency
error rate
AI latency
AI token usage
queue depth
database latency
authentication failures
rate-limit events
```
