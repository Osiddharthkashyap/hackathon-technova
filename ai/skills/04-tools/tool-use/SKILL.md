---
name: tool-use
version: 1.0
summary: Safe tool selection and execution protocol.
---
# Tool Use Skill

## Selection
Choose the narrowest tool that can satisfy the task. Prefer native/authoritative connectors when available over manual copying.

## Before call
Check required arguments, authorization, target, units, and whether the action is read-only or mutating. Never invent IDs or hidden fields.

## After call
Inspect result content, warnings, status, and partial failures. Treat structured results as authoritative only within their stated scope.

## Tool minimization
Avoid redundant calls. Batch independent safe lookups when supported. Do not batch actions with materially different authorization or rollback requirements.

## Side effects
For writes/sends/deletes/deployments: preview if available, verify scope, execute, then confirm resulting state.
