---
name: agent-handoff
version: 1.0
summary: Lossless transfer of task state between agents.
---
# Agent Handoff Skill

## Handoff packet
Include:
- objective;
- user constraints;
- relevant facts;
- assumptions;
- completed work;
- remaining work;
- files/IDs/references;
- known failures;
- required validations;
- prohibited actions;
- expected final output.

## Secret handling
Do not include credentials or sensitive values when a reference, redaction, or secure handle is sufficient.

## Receiver obligations
The receiving agent verifies critical state instead of assuming the handoff is correct.
