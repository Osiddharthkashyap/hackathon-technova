# AI Agent Skills Pack

A portable, framework-neutral skill system for reliable AI agents.

## Design goals

- Make agent behavior predictable, tool-safe, and recoverable.
- Separate global operating rules from task-specific capabilities.
- Load only the skills needed for the current task while preserving mandatory safeguards.
- Make every skill explicit about triggers, inputs, procedures, tool contracts, failure modes, validation, and outputs.
- Support single-agent and multi-agent workflows.

## Directory

- `AGENTS.md` — root operating contract and execution order.
- `SKILL_MANIFEST.yaml` — machine-readable skill registry.
- `skills/00-core/` — mandatory execution foundations.
- `skills/01-orchestration/` — routing, planning, decomposition, delegation, handoffs.
- `skills/02-reasoning/` — reasoning, uncertainty, decision handling.
- `skills/03-research/` — web research, source quality, synthesis.
- `skills/04-tools/` — tool selection, execution, retries, rate limits.
- `skills/05-files/` — file inspection, transformations, artifacts.
- `skills/06-code/` — software engineering workflow.
- `skills/07-testing/` — verification and test strategy.
- `skills/08-security/` — security, privacy, secrets, prompt injection defense.
- `skills/09-memory/` — memory read/write discipline.
- `skills/10-communication/` — user interaction, updates, clarification policy.
- `skills/11-recovery/` — error handling, rollback, degraded mode.
- `skills/12-output/` — output contracts, citations, artifact links, quality gates.
- `skills/13-specialized/` — reusable domain-neutral specialist patterns.

## Recommended runtime

1. Read `AGENTS.md` first.
2. Parse `SKILL_MANIFEST.yaml`.
3. Determine task type and activate the smallest sufficient skill set.
4. Always keep core safety, validation, recovery, and output rules active.
5. Before external side effects, run the relevant authorization and safety checks.
6. Verify results before claiming completion.

## Compatibility

The files are Markdown/YAML and can be adapted to systems that use `SKILL.md`, `skills/*`, `AGENTS.md`, system prompts, agent routers, or tool-policy registries.
