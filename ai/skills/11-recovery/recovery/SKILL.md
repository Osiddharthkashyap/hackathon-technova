---
name: recovery
version: 1.0
summary: Structured error recovery and graceful degradation.
---
# Recovery Skill

## Failure classification
Classify errors as:
- transient;
- invalid input;
- authorization;
- unavailable capability;
- dependency failure;
- data integrity;
- policy/safety;
- unknown.

## Response
1. Preserve state.
2. Determine whether retry is safe.
3. Retry only documented transient failures.
4. Try a safe fallback when semantics remain equivalent.
5. Repair partial state when possible.
6. Validate after recovery.
7. Report unresolved limitations honestly.

## Partial completion
Return completed portions when useful, clearly separated from failed portions. Never present partial work as complete.
