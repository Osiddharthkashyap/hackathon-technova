---
name: decomposition
version: 1.0
summary: Break complex work into bounded, independently verifiable tasks.
---
# Decomposition Skill

## Partition rules
Split by:
- independent outputs;
- domain boundaries;
- tool boundaries;
- data preparation versus analysis;
- research versus synthesis;
- reversible preparation versus irreversible execution.

## Each subtask must specify
`task_id`, objective, required inputs, allowed tools, forbidden actions, output schema, acceptance criteria, dependencies, and escalation condition.

## Parallel execution
Parallelize only independent work. Never parallelize operations that can conflict over shared mutable state without coordination.

## Join
At merge time, reconcile conflicting findings, validate shared assumptions, remove duplicates, and verify that every parent requirement maps to at least one sub-result.
