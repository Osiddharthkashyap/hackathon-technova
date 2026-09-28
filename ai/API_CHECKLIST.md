# SevaConnect API Implementation Checklist

Use this checklist before marking an endpoint complete.

## Contract

- [ ] Endpoint added to `API_CONTRACT.md`
- [ ] Endpoint added to OpenAPI
- [ ] Request schema documented
- [ ] Response schema documented
- [ ] Error codes documented
- [ ] Authentication requirement documented
- [ ] Authorization requirement documented

## Backend

- [ ] Controller/route implemented
- [ ] Input validation implemented
- [ ] Authentication middleware/guard applied
- [ ] Authorization guard/policy applied
- [ ] Resource ownership checked
- [ ] Business rules implemented
- [ ] DTO/serializer prevents sensitive data leakage
- [ ] Database access uses parameterization/ORM
- [ ] Rate limiting considered
- [ ] Audit logging considered
- [ ] Tests added

## Frontend

- [ ] API client method implemented
- [ ] Shared types updated
- [ ] Loading state
- [ ] Empty state
- [ ] Error state
- [ ] Retry behavior
- [ ] Authentication state handled
- [ ] 401 refresh behavior handled
- [ ] 403 behavior handled
- [ ] Duplicate submission prevented
- [ ] Accessible UI

## Security

- [ ] No secrets in frontend
- [ ] No tokens in logs
- [ ] No sensitive fields unnecessarily returned
- [ ] BOLA/IDOR test added
- [ ] Rate-limit test added where applicable
- [ ] Input validation test
- [ ] Unauthorized request test
- [ ] Wrong-user access test
- [ ] AI injection/privacy review if AI endpoint

## Deployment

- [ ] Environment variables documented
- [ ] Database migration included
- [ ] Health check verified
- [ ] Logs contain request ID
- [ ] Monitoring/alerts considered
