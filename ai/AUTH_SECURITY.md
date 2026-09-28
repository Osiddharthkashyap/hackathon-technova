# SevaConnect Authentication, Authorization & Security

## 1. Security Goals

SevaConnect handles identity, profile information, documents, applications, and AI conversations. Security is therefore a core architecture requirement.

Goals:

- Strong authentication
- Server-side authorization
- Least privilege
- Secure session management
- Protection of personal information
- Secure document handling
- AI prompt-injection and data-leak protection
- Auditability
- Rate limiting and abuse prevention

## 2. Authentication Model

Recommended:

```text
Browser
  │
  ├── Access Token (short lived, memory)
  │
  └── Refresh Token (HttpOnly + Secure + SameSite cookie)
```

Do not store long-lived refresh tokens in localStorage.

Access token claims should contain only necessary authorization context:

```json
{
  "sub": "user-uuid",
  "role": "CITIZEN",
  "sessionId": "session-uuid",
  "exp": 0
}
```

Do not place profile data, documents, or secrets inside JWT claims.

## 3. Password Security

- Hash passwords with Argon2id or another modern password hashing algorithm.
- Never encrypt passwords.
- Never log passwords.
- Enforce a sensible password policy.
- Rate-limit login attempts.
- Add account recovery with short-lived one-time tokens.
- Invalidate relevant sessions after password reset.

## 4. Authorization

Use RBAC:

```text
CITIZEN
ADMIN
CONTENT_MANAGER
SUPPORT_AGENT
```

Permission examples:

```text
scheme:read
scheme:manage
user:read:self
user:manage:self
application:read:self
application:update:self
application:manage
audit:read
```

Authorization must happen on the backend.

### Example

```text
Authenticated?
    ↓
Role allowed?
    ↓
Permission allowed?
    ↓
Resource belongs to user?
    ↓
Action allowed?
```

## 5. Object-Level Authorization

Every resource lookup must enforce ownership.

Unsafe:

```text
GET /users/me/applications/{id}
```

with only:

```sql
SELECT * FROM applications WHERE id = :id
```

Safe:

```sql
SELECT *
FROM applications
WHERE id = :id
AND user_id = :authenticatedUserId
```

This prevents IDOR/BOLA vulnerabilities.

## 6. CSRF

If refresh/session cookies are used:

- Configure `SameSite` appropriately.
- Use CSRF protection for cookie-authenticated state-changing requests where required by deployment architecture.
- Validate `Origin`/`Referer` where appropriate.
- Never allow wildcard credentialed CORS.

## 7. CORS

Production:

```text
ALLOWED_ORIGINS=https://app.sevaconnect.example
```

Do not use:

```text
Access-Control-Allow-Origin: *
```

with credentials.

## 8. Security Headers

Use a well-maintained security-header middleware.

Expected protections include:

- Content Security Policy
- HSTS in HTTPS production
- X-Content-Type-Options
- Referrer-Policy
- Frame protection
- Permissions Policy

Tune CSP rather than blindly allowing `unsafe-eval` or broad wildcards.

## 9. Input Validation

Validate at the API boundary.

Use a shared schema library such as Zod/JSON Schema.

Validate:

- body
- query parameters
- path parameters
- headers where relevant
- file uploads

Reject unexpected fields where practical.

## 10. Output Safety

Never return:

- password hashes
- refresh tokens
- private encryption keys
- internal stack traces
- raw database errors
- secrets
- unnecessary personal information

Use explicit DTOs/serializers.

## 11. Rate Limiting

At minimum:

```text
Login                  strict
Register               strict
Password reset         strict
AI chat                moderate + usage quota
File upload            strict
Public scheme search   moderate
Admin APIs             strict
```

Return:

```http
429 Too Many Requests
```

with a safe retry indication where appropriate.

## 12. File Upload Security

Uploaded documents are untrusted.

Pipeline:

```text
Upload
  ↓
Size check
  ↓
Extension + MIME check
  ↓
Magic-byte validation
  ↓
Malware scan
  ↓
Private object storage
  ↓
Metadata record
  ↓
Signed temporary download URL
```

Never make citizen documents public.

## 13. AI Security

AI must not be trusted as an authorization layer.

### Never allow the LLM to decide:

- whether a user can access another user's data
- whether an admin action is permitted
- whether a citizen can edit an application
- whether a document is officially approved

The application backend makes these decisions.

### Prompt Injection Defense

Treat retrieved documents and user messages as untrusted content.

```text
User message
    ↓
Intent / policy checks
    ↓
Retrieve approved sources
    ↓
Context isolation
    ↓
LLM
    ↓
Output validation
```

Do not allow retrieved text to override system/application rules.

## 14. AI Data Minimization

Send only the fields required for the AI task.

For example, a scheme explanation may need:

```text
schemeId
scheme rules
user-relevant eligibility facts
```

It should not automatically receive:

```text
password
refresh token
full document contents
unrelated profile fields
```

## 15. RAG Security

Only index approved scheme content.

Recommended metadata:

```json
{
  "schemeId": "uuid",
  "sourceType": "OFFICIAL",
  "sourceUrl": "https://...",
  "department": "...",
  "version": "2026-09",
  "retrievedAt": "2026-09-28T00:00:00Z"
}
```

Filter retrieval by approved source and scheme metadata.

## 16. Secrets

Use environment/secret management.

Never commit:

```text
.env
API keys
database passwords
JWT secrets
private keys
cloud credentials
```

Commit only:

```text
.env.example
```

## 17. Database Security

- Use parameterized queries/ORM.
- Separate application DB user permissions.
- Encrypt backups.
- Enable TLS to managed databases where supported.
- Avoid storing unnecessary PII.
- Add indexes to ownership fields.
- Use migrations rather than manual schema changes.

## 18. Audit Logging

Audit security-sensitive events:

```text
LOGIN_SUCCESS
LOGIN_FAILURE
PASSWORD_RESET
EMAIL_VERIFIED
PROFILE_UPDATED
DOCUMENT_UPLOADED
DOCUMENT_DELETED
APPLICATION_CREATED
APPLICATION_STATUS_CHANGED
ADMIN_ACTION
PERMISSION_DENIED
```

Do not log:

- passwords
- access tokens
- refresh tokens
- document contents
- full sensitive profile payloads

## 19. Privacy

Collect the minimum information needed.

Provide:

- privacy notice
- data deletion process
- account/session controls
- document deletion
- AI conversation deletion where supported

## 20. Security Testing

Before release:

```text
Unit tests
Integration tests
API authorization tests
BOLA/IDOR tests
Rate-limit tests
File upload tests
AI prompt-injection tests
Dependency scanning
Secret scanning
SAST
DAST
```

## 21. Security Definition of Done

An endpoint is not complete until:

- authentication behavior is defined
- authorization rules are defined
- validation is implemented
- error behavior is documented
- rate limiting is considered
- audit requirements are defined
- tests cover unauthorized access
- sensitive data exposure has been reviewed
