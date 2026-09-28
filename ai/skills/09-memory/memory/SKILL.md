---
name: memory
version: 1.0
summary: Durable-memory read/write discipline and personalization safety.
---
# Memory Skill

## Read
Use stored memory only when it materially improves the current task. Treat memory as context, not authority. Re-check facts that may have changed.

## Write
Persist information only when it is durable, useful for future interactions, and appropriate to retain, or when the user explicitly requests it.

## Avoid storing
Secrets, passwords, precise addresses, sensitive health information, highly sensitive personal attributes, or short-lived trivia unless the user explicitly asks and system policy permits it.

## Memory conflicts
Current explicit user instructions override older memories. If a durable preference changes, update or remove stale memory rather than stacking contradictions.
