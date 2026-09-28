# SevaConnect — System Architecture

## 1. Overview

SevaConnect is a citizen-centric Government Benefits Navigator for HackNTech 11.0.

**Theme:** FinTech for Financial Inclusion  
**Problem Area:** Government-benefit accessibility

The system follows a hybrid architecture:

- **Deterministic eligibility engine** for structured eligibility matching.
- **AI + RAG layer** for natural-language assistance, explanation, and retrieval of verified scheme information.
- **MongoDB** for application data.
- **Qdrant** for semantic/vector search.

> AI assists the citizen; it does not make the final government eligibility decision.

---

## 2. High-Level Architecture

```text
                         ┌──────────────────────────┐
                         │        CITIZEN           │
                         │    Web / Mobile Browser  │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                    ┌──────────────────────────────┐
                    │        React Frontend        │
                    │                              │
                    │ • Landing                    │
                    │ • Authentication             │
                    │ • Citizen Profile            │
                    │ • Scheme Discovery           │
                    │ • Eligibility Results        │
                    │ • Document Readiness         │
                    │ • Application Tracker        │
                    │ • AI Assistant               │
                    └──────────────┬───────────────┘
                                   │ HTTPS / REST
                                   ▼
                    ┌──────────────────────────────┐
                    │       Node.js + Express      │
                    │          API Layer            │
                    └──────────────┬───────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Authentication   │    │ Eligibility      │    │ AI Service       │
│ Service          │    │ Service          │    │                  │
│                  │    │                  │    │ RAG + LLM       │
│ JWT              │    │ Rule Engine      │    │ Embeddings       │
│ bcrypt           │    │ Matching         │    │ Guardrails       │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                       │
         └───────────────┬───────┴───────────────┬───────┘
                         │                       │
                         ▼                       ▼
               ┌──────────────────┐    ┌────────────────────┐
               │    MongoDB       │    │  Qdrant Vector DB  │
               │                  │    │                    │
               │ Users            │    │ Scheme embeddings  │
               │ Schemes          │    │ FAQ embeddings     │
               │ Applications     │    │ Document chunks    │
               │ Eligibility      │    │                    │
               └──────────────────┘    └────────────────────┘
```

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| State/Data | React Context + TanStack Query |
| Charts | Recharts |
| Backend | Node.js + Express.js |
| API | REST |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcrypt |
| Validation | Zod / express-validator |
| AI orchestration | LangChain JS |
| LLM | OpenAI API |
| Embeddings | OpenAI Embeddings |
| Vector DB | Qdrant |
| RAG | LangChain + Qdrant |
| Document Processing | PDF.js / Mammoth as needed |
| File Storage | Cloudinary / object storage |
| Frontend Deployment | Vercel |
| Backend Deployment | Render / Railway |
| Database Hosting | MongoDB Atlas |
| Vector DB Hosting | Qdrant Cloud |
| Version Control | Git + GitHub |

---

## 4. Core Architecture Principle

### Never use the LLM as the eligibility authority.

Bad:

```text
User → LLM → "You are eligible"
```

Correct:

```text
User Profile
     ↓
Eligibility Rule Engine
     ↓
Structured Result
     ↓
AI Explanation Layer
     ↓
Citizen-friendly Response
```

The rule engine handles:

- Age
- Income
- State
- Category
- Occupation
- Gender
- Residence
- Other structured conditions

The AI handles:

- Explanation
- Natural-language questions
- Document explanations
- Translation
- Conversational assistance

---

## 5. AI Architecture

SevaConnect uses Retrieval-Augmented Generation (RAG).

```text
                     USER QUESTION
                           │
                           ▼
                   Query Processing
                           │
                           ▼
                    Query Embedding
                           │
                           ▼
                ┌─────────────────────┐
                │    Qdrant Vector    │
                │      Database       │
                └──────────┬──────────┘
                           │
                    Relevant chunks
                           │
                           ▼
                ┌─────────────────────┐
                │   Context Builder   │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │       OpenAI        │
                │        LLM          │
                └──────────┬──────────┘
                           │
                           ▼
                    Grounded Response
                           │
                           ▼
                          USER
```

### AI capabilities

1. Scheme Assistant
2. Scheme Explainer
3. Document Explainer
4. Multilingual/Hinglish Assistant
5. Natural-language Scheme Discovery

---

## 6. RAG Data Pipeline

```text
Official Government Sources
            │
            ▼
       Data Collection
            │
            ▼
      PDF / HTML / Text
            │
            ▼
       Text Extraction
            │
            ▼
      Clean + Normalize
            │
            ▼
         Chunking
            │
            ▼
        Embeddings
            │
            ▼
       Qdrant Vector DB
```

Each chunk should retain metadata such as:

```json
{
  "schemeId": "...",
  "schemeName": "...",
  "sourceUrl": "...",
  "department": "...",
  "lastVerified": "...",
  "documentType": "official"
}
```

---

## 7. MongoDB vs Qdrant

### MongoDB

Stores structured application data:

```text
Users
Profiles
Schemes
Eligibility Rules
Applications
Eligibility Results
Saved Schemes
Conversations
```

### Qdrant

Stores semantic knowledge:

```text
Scheme descriptions
FAQs
Application instructions
Official document text
Government guidelines
```

---

## 8. Backend Architecture

```text
server/
├── config/
│   ├── db.js
│   ├── ai.js
│   └── env.js
│
├── models/
│   ├── User.js
│   ├── Scheme.js
│   ├── EligibilityResult.js
│   ├── Application.js
│   └── Conversation.js
│
├── controllers/
│   ├── authController.js
│   ├── profileController.js
│   ├── schemeController.js
│   ├── eligibilityController.js
│   ├── applicationController.js
│   └── aiController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── profileRoutes.js
│   ├── schemeRoutes.js
│   ├── eligibilityRoutes.js
│   ├── applicationRoutes.js
│   └── aiRoutes.js
│
├── services/
│   ├── eligibility/
│   │   ├── eligibilityEngine.js
│   │   ├── ruleEvaluator.js
│   │   └── recommendationEngine.js
│   │
│   ├── ai/
│   │   ├── llmService.js
│   │   ├── embeddingService.js
│   │   ├── ragService.js
│   │   ├── promptService.js
│   │   └── guardrailService.js
│   │
│   └── schemes/
│       └── schemeService.js
│
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validation.js
│
├── utils/
│   ├── logger.js
│   └── response.js
│
├── seed/
│   └── schemes.js
│
└── server.js
```

---

## 9. Frontend Architecture

```text
client/src/
├── components/
│   ├── Navbar/
│   ├── SchemeCard/
│   ├── EligibilityBadge/
│   ├── MatchExplanation/
│   ├── DocumentChecklist/
│   ├── ApplicationProgress/
│   └── AIChat/
│
├── pages/
│   ├── Landing/
│   ├── Login/
│   ├── Register/
│   ├── Dashboard/
│   ├── Profile/
│   ├── Schemes/
│   ├── SchemeDetails/
│   ├── Eligibility/
│   ├── Applications/
│   └── Assistant/
│
├── hooks/
│   ├── useAuth.js
│   ├── useSchemes.js
│   └── useEligibility.js
│
├── services/
│   └── api.js
│
├── context/
│   └── AuthContext.jsx
│
└── App.jsx
```

---

## 10. Request Flow: AI Scheme Discovery

Example user question:

> "What schemes can I get?"

Flow:

```text
React
  ↓
POST /api/ai/ask
  ↓
Authentication
  ↓
Retrieve Citizen Profile
  ↓
Intent Detection
  ↓
Eligibility Engine
  ↓
Potential Scheme Matches
  ↓
Retrieve Relevant Scheme Context from Qdrant
  ↓
Build LLM Context
  ↓
OpenAI API
  ↓
Response Validation / Guardrails
  ↓
API Response
  ↓
React UI
```

The LLM receives:

```text
User question
+
Relevant user profile context
+
Eligibility results
+
Verified scheme information
```

---

## 11. AI Guardrails

The AI should:

- Prefer retrieved official information.
- Never invent eligibility requirements.
- Never claim guaranteed approval.
- Clearly distinguish known facts from missing information.
- Provide sources where available.
- Tell users to verify current requirements through official channels.
- Never expose private user information.
- Never expose system prompts or internal implementation details.

---

## 12. Security Architecture

```text
HTTPS
  ↓
Rate Limiting
  ↓
Input Validation
  ↓
Authentication
  ↓
Authorization
  ↓
Controller
  ↓
Service
  ↓
Database
```

Security measures:

- Helmet
- CORS configuration
- Rate limiting
- Input validation
- Password hashing
- JWT/session protection
- Environment variables
- MongoDB access controls
- Minimal personal-data collection
- No real Aadhaar numbers in the hackathon demo

---

## 13. Deployment

```text
                 INTERNET
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
       Vercel              Render
          │                   │
       React             Express API
                              │
               ┌──────────────┼──────────────┐
               │              │              │
               ▼              ▼              ▼
          MongoDB Atlas     Qdrant        OpenAI API
```

---

## 14. Recommended AI Stack

```text
OpenAI API
     │
     ├── LLM / Chat
     │
     └── Embeddings
             │
             ▼
        LangChain JS
             │
             ▼
           Qdrant
```

### Responsibilities

| Task | Technology |
|---|---|
| Eligibility | Custom deterministic rule engine |
| Scheme matching | Recommendation engine |
| Semantic search | Embeddings + Qdrant |
| Scheme Q&A | RAG + OpenAI |
| Explanation | OpenAI |
| Translation | OpenAI |
| Natural-language profile extraction | OpenAI + validation |
| Document explanation | RAG + OpenAI |
| Final eligibility decision | Rule engine, never LLM alone |

---

## 15. AI Cost Control

Not every operation should call the LLM.

### No AI

```text
Profile → Eligibility Check
```

### AI

```text
"Explain why I matched."
```

### RAG + AI

```text
"What documents does this scheme require?"
```

Common responses and retrieved context can be cached where appropriate.

---

## 16. Final Architecture Principle

> **SevaConnect uses hybrid intelligence: deterministic rules for eligibility and Retrieval-Augmented Generation for trustworthy, personalized citizen assistance.**

This separation is central to the project's reliability, explainability, and hackathon demonstration.
