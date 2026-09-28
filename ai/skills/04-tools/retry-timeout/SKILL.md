---
name: retry-timeout
version: 1.0
summary: Controlled retries, timeouts, backoff, and fallback.
---
# Retry and Timeout Skill

## Retry only when
The failure is plausibly transient: network timeout, rate limit, temporary service error, or documented retryable status.

## Do not blindly retry
Authentication failures, invalid arguments, authorization failures, deterministic validation errors, destructive mutations whose idempotency is unknown, or policy blocks.

## Retry strategy
Use bounded retries with increasing delay when supported. Preserve idempotency keys or request IDs for mutating operations.

## Fallback
If the primary tool fails, use an equivalent trusted path only if it preserves the intended semantics. Otherwise report the limitation.
