# SevaConnect AI Architecture

## 1. AI Product Goal

SevaConnect AI is an intelligent assistance layer for discovering and understanding government benefits.

It should:

- Understand natural-language citizen questions.
- Extract relevant profile information.
- Retrieve verified scheme information.
- Connect users to deterministic eligibility rules.
- Explain recommendations.
- Explain documents.
- Support multiple languages.
- Provide official sources.
- Clearly communicate uncertainty.

The AI should assist users, not act as the official authority.

---

# 2. Core AI Features

```text
1. AI Government Benefits Assistant
2. AI Scheme Finder
3. Personalized Scheme Recommendation
4. Eligibility Explanation
5. Scheme Explainer
6. Document Assistant
7. Multilingual/Hinglish Assistance
8. Source/Citation Display
9. AI Feedback
10. Conversation History
```

---

# 3. AI User Flow

```text
User
  ↓
AI Chat UI
  ↓
API Authentication
  ↓
Intent Detection
  ↓
Profile Context
  ↓
Verified Retrieval
  ↓
Eligibility Engine
  ↓
Context Builder
  ↓
LLM
  ↓
Output Schema Validation
  ↓
Safety/Grounding Checks
  ↓
Frontend
```

---

# 4. AI Architecture

```text
                         USER
                           │
                           ▼
                    React AI Interface
                           │
                           ▼
                      AI API Layer
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
           Intent       Profile       RAG
          Detection     Extraction   Retrieval
              │            │            │
              │            ▼            ▼
              │       Validation     Vector DB
              │            │            │
              └────────────┼────────────┘
                           ▼
                   Eligibility Engine
                           │
                           ▼
                    Context Builder
                           │
                           ▼
                         LLM
                           │
                           ▼
                 Output Validation
                           │
                           ▼
                    AI Guardrails
                           │
                           ▼
                 Structured Response
```

---

# 5. AI Frontend Pages

```text
/assistant
/assistant/:conversationId
/recommendations
/eligibility
/schemes/:id → AI explanation
/documents → AI document assistant
```

---

# 6. AI Assistant UI

```text
┌─────────────────────────────────────────────────────────────┐
│ 🤖 SevaConnect AI                                           │
│ Your Government Benefits Assistant                          │
│                                                             │
│ [🎯 Find Schemes] [📄 Documents] [❓ Eligibility]           │
│                                                             │
│ Suggested Questions                                         │
│                                                             │
│ "Which schemes may I qualify for?"                          │
│ "What documents do I need?"                                │
│ "Explain this scheme simply."                              │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Ask SevaConnect anything...                       🎤 ➤ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

# 7. AI Chat API

Endpoint:

```text
POST /api/v1/ai/chat
```

Request:

```json
{
  "conversationId": "uuid",
  "message": "Which housing schemes may be relevant to me?",
  "language": "en"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "conversationId": "uuid",
    "message": {
      "id": "uuid",
      "role": "assistant",
      "content": "Based on your profile..."
    },
    "intent": "SCHEME_DISCOVERY",
    "recommendations": [],
    "sources": [],
    "disclaimer": "Final eligibility is determined by the relevant authority."
  },
  "meta": {
    "requestId": "req_..."
  }
}
```

---

# 8. AI Intents

Recommended initial intent set:

```text
SCHEME_DISCOVERY
SCHEME_EXPLANATION
ELIGIBILITY
DOCUMENT_EXPLANATION
APPLICATION_GUIDANCE
PROFILE_EXTRACTION
GENERAL_HELP
TRANSLATION
UNSUPPORTED
```

The intent router decides which workflow is needed.

---

# 9. AI Scheme Finder

User:

```text
"I'm 25, a farmer from Uttar Pradesh,
my family income is around ₹2 lakh."
```

AI extracts proposed data:

```json
{
  "age": 25,
  "occupation": "FARMER",
  "state": "Uttar Pradesh",
  "annualFamilyIncome": 200000
}
```

Important:

The AI extraction must be treated as a proposal.

```text
AI extraction
      ↓
User confirmation
      ↓
Profile update
```

Do not silently overwrite profile data based only on an LLM response.

---

# 10. Recommendation Pipeline

```text
User Profile
     +
Scheme Rules
     ↓
Eligibility Engine
     ↓
Candidate Schemes
     ↓
Ranking
     ↓
AI Explanation
     ↓
Recommendations
```

The deterministic eligibility engine owns rule evaluation.

The LLM explains the result.

---

# 11. Eligibility Result

Example:

```json
{
  "status": "POTENTIALLY_RELEVANT",
  "matchedCriteria": [
    "income",
    "state",
    "occupation"
  ],
  "failedCriteria": [],
  "needsVerification": [
    "income_certificate"
  ]
}
```

UI:

```text
🟢 Potentially Relevant

✓ Income matches
✓ State matches
✓ Occupation matches
⚠ Income certificate requires verification
```

---

# 12. Why Did I Match?

This should be a major trust feature.

Example:

```text
Why did I match?

✓ Your state matches the scheme.
✓ Your occupation matches the configured criteria.
✓ Your reported income matches the configured range.
⚠ An income certificate may be required for verification.
```

The explanation should be generated from structured eligibility results, not invented by the LLM.

---

# 13. AI Scheme Explainer

Endpoint:

```text
POST /api/v1/ai/explain-scheme
```

The AI should explain:

```text
What is this scheme?
Who may qualify?
What benefits are offered?
What documents are required?
How can I apply?
What should I do next?
```

The response should include official source references.

---

# 14. AI Document Assistant

Endpoint:

```text
POST /api/v1/ai/explain-document
```

Examples:

```text
"What is an income certificate?"

"Why is this document required?"

"How can I prepare this document?"

"Which document am I missing?"
```

Document advice must be grounded in verified scheme/document information.

---

# 15. Document Readiness

```text
Scheme Requirements
        +
User Documents
        ↓
Document Readiness Engine
        ↓
Missing / Available / Needs Verification
```

Example:

```text
Document readiness: 72%

✓ Identity Proof
✓ Address Proof
⚠ Income Certificate
⚠ Category Certificate
```

---

# 16. RAG Architecture

Use Retrieval-Augmented Generation for scheme information.

```text
Official/verified scheme sources
          ↓
Cleaning + normalization
          ↓
Chunking
          ↓
Embeddings
          ↓
Vector database
          ↓
Metadata filtering
          ↓
Relevant context
          ↓
LLM
```

Every indexed document should carry metadata:

```json
{
  "schemeId": "uuid",
  "sourceType": "OFFICIAL",
  "sourceUrl": "https://...",
  "department": "...",
  "version": "2026-09",
  "retrievedAt": "2026-09-28T00:00:00Z"
}
```

---

# 17. Retrieval Rules

Prefer:

```text
Official government source
        ↓
Verified institutional source
        ↓
Other trusted source
```

Do not let arbitrary user-provided text become trusted scheme policy.

Filter retrieval by:

- scheme
- department
- state
- language
- source status
- document version

---

# 18. AI Prompt Architecture

Do not place the entire application logic in one prompt.

Use layers:

```text
System Policy
     +
Application Rules
     +
Intent Instructions
     +
Retrieved Scheme Context
     +
Structured User Context
     +
User Message
```

Example conceptual prompt:

```text
SYSTEM:
You are SevaConnect AI.
Help users understand government benefits.
Do not claim official eligibility.
Use only supplied verified scheme context for scheme-specific facts.

APPLICATION CONTEXT:
Eligibility results are authoritative for this response.

RETRIEVED CONTEXT:
...

USER PROFILE CONTEXT:
...

USER:
...
```

---

# 19. AI Output Schema

Do not rely on free-form text alone.

Recommended structure:

```json
{
  "answer": "string",
  "intent": "SCHEME_DISCOVERY",
  "recommendations": [
    {
      "schemeId": "uuid",
      "status": "POTENTIALLY_RELEVANT",
      "reasonCodes": [
        "INCOME_MATCH",
        "STATE_MATCH"
      ]
    }
  ],
  "actions": [
    {
      "type": "VIEW_SCHEME",
      "schemeId": "uuid"
    }
  ],
  "sources": [
    {
      "title": "Official source",
      "schemeId": "uuid",
      "sourceType": "OFFICIAL"
    }
  ],
  "disclaimer": "Final eligibility is determined by the relevant authority."
}
```

Validate this response before sending it to the frontend.

---

# 20. AI Guardrails

## Never allow AI to decide

```text
Authorization
Resource ownership
Admin permissions
Final government eligibility
Official application approval
Document authenticity
```

Those decisions belong to application/backend services or the relevant authority.

---

# 21. Prompt Injection Protection

Treat:

```text
User messages
Retrieved documents
Uploaded documents
External text
```

as untrusted input.

Pipeline:

```text
Input
 ↓
Validation
 ↓
Policy checks
 ↓
Verified retrieval
 ↓
Context isolation
 ↓
LLM
 ↓
Output validation
```

Never allow retrieved text to override application/system instructions.

---

# 22. AI Privacy

Only send required data to the AI model.

For scheme matching, do not automatically send:

```text
password
access token
refresh token
unrelated documents
unrelated profile information
```

Use data minimization.

---

# 23. Multilingual AI

Initial language options:

```text
English
Hindi
Hinglish
```

The language should be an explicit request/context field.

Example:

```json
{
  "message": "Mujhe housing ke liye kaunsi scheme mil sakti hai?",
  "language": "hi"
}
```

AI should preserve important government scheme names and official terminology where appropriate.

---

# 24. AI Source Citations

Every factual scheme response should provide source information.

UI:

```text
📚 Sources

Official Scheme Information
[View Source ↗]
```

The source metadata comes from backend retrieval, not from an arbitrary URL generated by the LLM.

---

# 25. AI Confidence / Uncertainty

Use understandable statuses:

```text
🟢 Potentially Relevant
🟡 Needs Verification
⚪ More Information Needed
🔴 Does Not Currently Match
```

Avoid misleading statements such as:

```text
"You are definitely eligible."
```

Prefer:

```text
"Based on the information provided, this scheme appears potentially relevant.
Final eligibility is determined by the relevant authority."
```

---

# 26. AI Loading States

Instead of a generic spinner:

```text
🤖 Understanding your question...
🔍 Searching verified scheme information...
📋 Checking your profile...
✨ Preparing your answer...
```

For a simple question:

```text
🤖 Preparing your answer...
```

---

# 27. AI Feedback

Every completed AI answer can include:

```text
Was this helpful?

👍 Yes    👎 No
```

Negative feedback:

```text
What went wrong?

○ Information wasn't useful
○ Information seems incorrect
○ I need more detail
○ Other
```

Store feedback without unnecessarily storing sensitive conversation content.

---

# 28. AI Backend Structure

```text
apps/api/src/modules/ai/
│
├── ai.controller.ts
├── ai.service.ts
├── ai.schema.ts
├── ai.dto.ts
│
├── intent/
│   └── intent.service.ts
│
├── profile/
│   └── profile-extraction.service.ts
│
├── retrieval/
│   ├── retrieval.service.ts
│   ├── embedding.service.ts
│   └── source-filter.service.ts
│
├── eligibility/
│   └── eligibility-explanation.service.ts
│
├── prompts/
│   ├── assistant.prompt.ts
│   ├── scheme-explainer.prompt.ts
│   ├── profile-extraction.prompt.ts
│   └── document-explainer.prompt.ts
│
├── providers/
│   └── llm.provider.ts
│
├── guardrails/
│   ├── input-safety.ts
│   ├── grounding.ts
│   ├── privacy.ts
│   └── output-validation.ts
│
└── ai.spec.ts
```

---

# 29. AI API Endpoints

```text
POST /api/v1/ai/chat
POST /api/v1/ai/extract-profile
POST /api/v1/ai/explain-scheme
POST /api/v1/ai/explain-eligibility
POST /api/v1/ai/explain-document
POST /api/v1/ai/translate

GET  /api/v1/ai/conversations
GET  /api/v1/ai/conversations/:conversationId
DELETE /api/v1/ai/conversations/:conversationId
```

All citizen AI endpoints require authentication unless explicitly designed as public.

---

# 30. AI Services

```text
AIService
├── IntentService
├── RetrievalService
├── ProfileExtractionService
├── RecommendationService
├── ExplanationService
├── DocumentAssistantService
├── TranslationService
├── PromptService
├── OutputValidationService
└── SafetyService
```

---

# 31. AI Provider Abstraction

Do not couple the entire application directly to one model provider.

Use:

```text
LLMProvider
├── generate()
├── generateStructured()
└── embed()
```

Then the application can replace the underlying provider without rewriting every AI feature.

---

# 32. AI Observability

Track:

```text
AI request count
AI latency
LLM failures
retrieval latency
retrieval quality signals
token usage
rate-limit events
invalid structured outputs
grounding failures
user feedback
```

Never log:

```text
passwords
access tokens
refresh tokens
raw sensitive documents
unnecessary PII
```

---

# 33. AI Rate Limits

Different limits can apply to:

```text
Anonymous/public AI
Authenticated AI
Premium/heavy operations
Document AI
Admin AI
```

AI usage should be protected against abuse and accidental runaway loops.

---

# 34. AI Testing

Test:

### Functional

```text
Correct intent
Correct scheme retrieval
Correct eligibility explanation
Correct document explanation
Correct language
```

### Security

```text
Prompt injection
Data exfiltration attempts
Cross-user conversation access
Unauthorized AI actions
Malicious uploaded content
```

### Reliability

```text
LLM timeout
LLM unavailable
Vector DB unavailable
Invalid model output
Empty retrieval
Conflicting sources
```

---

# 35. AI Definition of Done

An AI feature is complete only when:

- [ ] API contract exists.
- [ ] Input schema exists.
- [ ] Output schema exists.
- [ ] Authentication requirement is defined.
- [ ] Authorization is implemented.
- [ ] Data minimization reviewed.
- [ ] Retrieval/grounding strategy defined.
- [ ] Source metadata returned.
- [ ] Uncertainty is communicated.
- [ ] LLM output is validated.
- [ ] Prompt-injection handling is considered.
- [ ] Rate limiting exists.
- [ ] Error states exist.
- [ ] Tests exist.
- [ ] Frontend loading/error/empty states exist.

---

# 36. Recommended Hackathon Demo Flow

The strongest end-to-end AI demonstration is:

```text
Citizen opens SevaConnect
        ↓
Creates profile
        ↓
Asks:
"Which government schemes can I get?"
        ↓
AI understands the request
        ↓
Verified scheme retrieval
        ↓
Eligibility engine checks profile
        ↓
AI explains top recommendations
        ↓
Citizen opens a scheme
        ↓
AI explains scheme in simple Hindi/Hinglish
        ↓
Document readiness is shown
        ↓
Citizen sees missing documents
        ↓
Citizen follows official application link
```

This demonstrates that SevaConnect is more than a chatbot: it combines **AI + verified retrieval + deterministic eligibility + document guidance + citizen workflow**.
