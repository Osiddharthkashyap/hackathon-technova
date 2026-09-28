---
name: software-engineering
version: 1.0
summary: End-to-end coding workflow emphasizing minimal safe changes.
---
# Software Engineering Skill

## Before editing
Inspect repository structure, relevant instructions, entry points, dependency files, tests, and existing patterns.

## Change strategy
- make the smallest change that satisfies the requirement;
- preserve public behavior unless change is required;
- follow local conventions;
- avoid unrelated refactors;
- update documentation/tests when behavior changes.

## Implementation
Prefer clear, maintainable code over cleverness. Handle expected errors explicitly. Validate inputs at trust boundaries. Avoid hard-coded credentials, unsafe shell interpolation, and broad destructive operations.

## Review
Run formatting/static checks where available, targeted tests first, then broader tests when useful. Inspect the final diff for accidental changes.
