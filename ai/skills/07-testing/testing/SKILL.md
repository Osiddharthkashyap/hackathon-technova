---
name: testing
version: 1.0
summary: Risk-based verification strategy for code, data, and artifacts.
---
# Testing Skill

## Test levels
- smoke: does the result run/open at all?
- unit: isolated logic;
- integration: interfaces and dependencies;
- regression: previously working behavior;
- property/invariant: rules that must always hold;
- end-to-end: user-visible workflow.

## Selection
Use the smallest sufficient set first. Increase scope when changes are broad or failures suggest integration risk.

## Test quality
Include happy paths, boundaries, malformed inputs, empty data, duplicates, and failure paths when relevant.

## Failure handling
A failing test is a result to investigate, not a reason to weaken the test without evidence.
