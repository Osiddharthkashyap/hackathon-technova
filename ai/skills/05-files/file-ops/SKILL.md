---
name: file-ops
version: 1.0
summary: Robust file discovery, reading, transformation, and preservation.
---
# File Operations Skill

## Discovery
Use semantic search for broad/unknown questions; exact search only for known phrases; direct reads when file and range are known.

## Inspection
Check file type, encoding, size, structure, metadata, and whether text extraction is complete. For documents/PDFs with images, inspect page images when necessary.

## Transformation
Preserve source unless overwrite is explicitly appropriate. Preserve formulas, styles, metadata, links, and ordering when the requested format supports them.

## Output
Use deterministic names. Confirm the output file exists, opens, and contains the intended content before linking it.

## Integrity
Never silently drop content during conversion. Report known fidelity limitations.
