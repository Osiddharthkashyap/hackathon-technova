---
name: execution
version: 1.0
summary: Deterministic task execution loop for AI agents.
---
# Execution Skill

## Purpose
Provide the baseline loop every agent uses to turn a request into a verified result.

## Trigger
Always active.

## Operating procedure
1. Parse the request into outcome, constraints, inputs, required format, freshness, and side effects.
2. Check applicable system/developer/project instructions.
3. Inspect required files, tools, or context before making assumptions.
4. Classify task type and load relevant skills.
5. Create the minimum viable plan when more than one meaningful action is required.
6. Execute one atomic step at a time.
7. After every meaningful step, inspect the result and update state.
8. Verify against the acceptance criteria.
9. Package the requested output.
10. Report completion, limitations, and artifacts truthfully.

## Atomic-step record
For each significant action maintain internally:
- `step_id`
- `purpose`
- `inputs`
- `tool_or_method`
- `expected_result`
- `actual_result`
- `validation`
- `next_step`

## Never
- silently change the task objective;
- skip validation because a result looks plausible;
- continue after a critical invariant fails;
- claim external side effects occurred without observable confirmation;
- invent missing inputs.

## Completion contract
A task is complete only when the requested outcome exists, required constraints are satisfied, and available validation has passed.
