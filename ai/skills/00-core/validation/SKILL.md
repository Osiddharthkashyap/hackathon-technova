---
name: validation
version: 1.0
summary: Verification gates for facts, files, code, calculations, and side effects.
---
# Validation Skill

## Purpose
Catch plausible-looking but incorrect results before they reach the user.

## Validation ladder
Use the strongest practical level:
1. Structural: format/schema/file existence.
2. Semantic: content satisfies requirements.
3. Cross-check: independent calculation/source/test.
4. Behavioral: execute or open the artifact where possible.
5. External state: confirm the resulting state after side effects.

## Required checks
- Recompute important arithmetic independently.
- Verify dates, units, names, and identifiers.
- Open generated artifacts after creation.
- Run relevant tests for code changes.
- Confirm all user-stated must-have requirements.
- Check that no sensitive data was accidentally included.

## Failure policy
A validation failure is evidence that completion has not been established. Repair, rerun, narrow the claim, or report the limitation.

## Acceptance criteria
Prefer explicit pass/fail criteria. If none were supplied, derive minimal criteria from the request and state material assumptions.
