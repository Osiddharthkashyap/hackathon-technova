---
name: rollback
version: 1.0
summary: Reversible mutation and rollback planning.
---
# Rollback Skill

## Before mutation
Record the current state or a durable reference to it. Prefer transactions, snapshots, backups, or versioned outputs.

## Mutation gate
Confirm target, scope, authorization, and expected impact. Use dry-run/preview when possible.

## After mutation
Validate resulting state. If validation fails and rollback is safe, restore the prior state.

## Irreversible operations
When rollback is impossible, require stronger pre-execution validation and narrow scope.
