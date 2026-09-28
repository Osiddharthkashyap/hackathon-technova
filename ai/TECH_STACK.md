# SevaConnect — Technology Stack

## 1. Final Stack

| Area | Technology | Purpose |
|---|---|---|
| Frontend | React | Web application |
| Build Tool | Vite | Fast frontend development |
| Styling | Tailwind CSS | Responsive UI |
| UI Components | shadcn/ui | Consistent components |
| State | React Context | Authentication/global state |
| Server State | TanStack Query | API caching/fetching |
| Charts | Recharts | Dashboard analytics |
| Backend | Node.js | Runtime |
| API | Express.js | REST backend |
| Database | MongoDB Atlas | Application data |
| ODM | Mongoose | MongoDB models |
| Authentication | JWT + bcrypt | Authentication |
| Validation | Zod | Input/schema validation |
| AI LLM | OpenAI API | Natural-language generation |
| AI Orchestration | LangChain JS | RAG pipeline |
| Embeddings | OpenAI Embeddings | Semantic search |
| Vector DB | Qdrant | RAG knowledge retrieval |
| File Storage | Cloudinary / Object Storage | Optional documents |
| Deployment | Vercel + Render/Railway | Hosting |
| Source Control | Git + GitHub | Collaboration |

---

# 2. Frontend

## React + Vite

Used for:

- Landing page
- Authentication
- Citizen profile
- Dashboard
- Scheme discovery
- Eligibility results
- Scheme details
- Application tracker
- AI assistant

### Tailwind CSS

Used for responsive styling.

### shadcn/ui

Used for reusable UI components:

- Cards
- Buttons
- Dialogs
- Tabs
- Forms
- Progress indicators
- Alerts

---

# 3. Backend

## Node.js + Express

The backend exposes REST APIs for:

- Authentication
- Profile management
- Scheme discovery
- Eligibility checking
- Applications
- AI assistant

The backend also coordinates:

```text
React
 ↓
Express
 ↓
Business Services
 ↓
MongoDB / Eligibility / AI
```

---

# 4. Database

## MongoDB Atlas

MongoDB stores structured application data.

### Collections

```text
users
schemes
eligibilityResults
applications
conversations
```

### Why MongoDB?

- Fits naturally with JavaScript/Node.
- Flexible scheme structures.
- Fast development for a hackathon.
- Easy document-oriented representation.
- MongoDB Atlas provides managed cloud hosting.

---

# 5. Eligibility Engine

This is custom application logic, not an external AI service.

### Inputs

```text
Age
Income
State
District
Category
Occupation
Gender
Residence
Student status
Farmer status
Other scheme-specific conditions
```

### Outputs

```text
potentially_eligible
needs_verification
not_currently_matched
```

### Example

```text
User
 ↓
Scheme rules
 ↓
Age check
 ↓
Income check
 ↓
State check
 ↓
Category check
 ↓
Other conditions
 ↓
Structured result
```

---

# 6. AI Stack

## OpenAI API

Used for:

- Scheme explanations
- Natural-language questions
- Document explanations
- Translation
- Natural-language profile extraction
- Conversational assistance

## LangChain JS

Used for:

- Document ingestion
- Text splitting
- Embeddings
- Retriever integration
- Prompt pipelines

## Qdrant

Used for:

- Semantic search
- Scheme knowledge retrieval
- FAQ retrieval
- Government document retrieval

---

# 7. RAG Stack

```text
Government Source
      ↓
Text Extraction
      ↓
Chunking
      ↓
OpenAI Embeddings
      ↓
Qdrant
      ↓
Semantic Search
      ↓
Relevant Context
      ↓
OpenAI LLM
      ↓
Grounded Answer
```

---

# 8. Why not train our own AI model?

For a hackathon, model training is unnecessary.

Our innovation is in:

```text
Government Data
+
Eligibility Engine
+
RAG
+
Personalization
+
AI Assistant
```

not in training a foundation model.

This also reduces:

- Development time
- Infrastructure requirements
- Dataset requirements
- Model maintenance
- Deployment complexity

---

# 9. Why use both MongoDB and Qdrant?

They solve different problems.

### MongoDB

Structured data:

```text
Who is the user?
What is the scheme?
What are the eligibility rules?
What is the application status?
```

### Qdrant

Semantic knowledge:

```text
Which government document explains this question?
Which paragraph is relevant to the user's query?
```

---

# 10. Authentication

```text
Register
   ↓
Validate input
   ↓
Hash password with bcrypt
   ↓
Save user
```

Login:

```text
Login
 ↓
Verify password
 ↓
Issue JWT
 ↓
Authenticated API requests
```

Use secure HTTP-only cookies where practical.

---

# 11. Validation

Use Zod for:

- Registration
- Login
- Profile updates
- Scheme data
- Eligibility requests
- AI requests

Example:

```text
Request
 ↓
Zod validation
 ↓
Controller
 ↓
Service
```

Never trust frontend validation alone.

---

# 12. Security

Recommended middleware/tools:

- Helmet
- CORS
- Rate limiting
- Zod validation
- bcrypt
- JWT/session protection
- Environment variables

Never commit:

```text
OPENAI_API_KEY
MONGODB_URI
JWT_SECRET
```

to GitHub.

---

# 13. Environment Variables

Example:

```env
NODE_ENV=development

PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

OPENAI_API_KEY=your_openai_api_key

QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key

CLIENT_URL=http://localhost:5173
```

---

# 14. Deployment

## Frontend

Vercel

```text
React/Vite
   ↓
Vercel
```

## Backend

Render or Railway

```text
Node/Express
   ↓
Render/Railway
```

## Database

MongoDB Atlas

## Vector Database

Qdrant Cloud

## AI

OpenAI API

---

# 15. Development Environment

Recommended:

- Node.js LTS
- npm
- VS Code
- Git
- GitHub
- MongoDB Atlas account
- OpenAI API key
- Qdrant account

Optional:

- Postman / Insomnia
- MongoDB Compass

---

# 16. Why This Stack Fits the Hackathon

The stack is intentionally practical.

```text
React
+
Node
+
MongoDB
+
Custom Rule Engine
+
OpenAI
+
RAG
+
Qdrant
```

This gives us:

- Fast development
- Strong demo capability
- Real AI functionality
- Explainable eligibility logic
- Scalable architecture
- Familiar JavaScript ecosystem
- Clear separation between AI and business rules

---

# 17. Technology Priority

If development time becomes limited:

### Priority 1

```text
React
Node
Express
MongoDB
Eligibility Engine
```

### Priority 2

```text
OpenAI
RAG
Qdrant
```

### Priority 3

```text
Multilingual AI
Document readiness
Application tracker
```

### Priority 4

```text
Voice
OCR
Notifications
Advanced analytics
```

The core citizen journey should work before optional AI features are added.
