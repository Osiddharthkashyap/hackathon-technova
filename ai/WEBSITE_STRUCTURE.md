# SevaConnect Website Structure

## 1. Product Overview

SevaConnect is an AI-powered Government Benefits Navigator.

The website helps citizens:

- Discover relevant government schemes.
- Understand eligibility.
- Understand required documents.
- Get personalized recommendations.
- Ask questions in natural language.
- Track applications and saved schemes.
- Use the platform in multiple languages.
- Reach official application sources.

## 2. Primary User Roles

### Citizen

Main user of the platform.

Can:

- Register/login.
- Create and edit profile.
- Search schemes.
- Get AI recommendations.
- Check eligibility.
- Manage documents.
- Track applications.
- Save schemes.
- Chat with SevaConnect AI.

### Admin

Manages the platform.

Can:

- Manage schemes.
- Manage scheme sources.
- Review application/system data.
- Manage users where authorized.
- Review audit logs.
- Monitor platform health.

### Content Manager

Manages scheme information and verified sources.

### Support Agent

Handles authorized user-support workflows.

---

# 3. Site Map

```text
SevaConnect
│
├── Public
│   ├── /
│   ├── /schemes
│   ├── /schemes/:id
│   ├── /about
│   ├── /how-it-works
│   ├── /privacy
│   └── /terms
│
├── Authentication
│   ├── /login
│   ├── /register
│   ├── /verify-email
│   ├── /forgot-password
│   └── /reset-password
│
├── Citizen App
│   ├── /dashboard
│   ├── /profile
│   ├── /schemes
│   ├── /recommendations
│   ├── /eligibility
│   ├── /saved-schemes
│   ├── /documents
│   ├── /applications
│   ├── /applications/:id
│   ├── /assistant
│   ├── /assistant/:conversationId
│   ├── /notifications
│   └── /settings
│
└── Admin
    ├── /admin
    ├── /admin/users
    ├── /admin/schemes
    ├── /admin/schemes/new
    ├── /admin/schemes/:id/edit
    ├── /admin/applications
    ├── /admin/sources
    └── /admin/audit-logs
```

---

# 4. Global Application Layout

Authenticated citizen pages use:

```text
┌──────────────────────────────────────────────────────────────┐
│ Logo   Search                    Language   Notifications 👤 │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│ Dashboard     │                                              │
│ Find Schemes  │             Page Content                     │
│ AI Assistant  │                                              │
│ My Documents  │                                              │
│ Applications  │                                              │
│ Saved Schemes │                                              │
│ Profile       │                                              │
│ Settings      │                                              │
│               │                                              │
├───────────────┴──────────────────────────────────────────────┤
│ Footer / Help / Privacy / Terms                              │
└──────────────────────────────────────────────────────────────┘
```

On mobile, the sidebar becomes a bottom navigation or drawer.

---

# 5. Landing Page

Route:

```text
/
```

Sections:

1. Hero
2. What SevaConnect does
3. AI assistant introduction
4. Scheme discovery
5. Personalized recommendations
6. How it works
7. Trust / verified-source explanation
8. Multilingual support
9. Call to action
10. Footer

Hero:

```text
Find Government Benefits
That Matter to You

Discover schemes, understand eligibility,
prepare documents, and get guided assistance.

[Find My Benefits] [Ask SevaConnect AI]
```

---

# 6. Authentication Pages

## Login

```text
Email
Password

[Login]

Forgot password?
Create account
```

## Registration

```text
Name
Email
Password
Confirm Password

[Create Account]
```

## Email Verification

Shows verification status and resend option.

## Password Reset

Two-step flow:

```text
Email
   ↓
One-time reset link/token
   ↓
New password
```

---

# 7. Citizen Dashboard

Route:

```text
/dashboard
```

Dashboard content:

```text
Welcome back, User

┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ 🎯 5 Matches  │ │ 📄 3 Documents│ │ 📋 2 Active   │
│               │ │               │ │ Applications  │
└───────────────┘ └───────────────┘ └───────────────┘

Recommended for You

[Scheme Card]
[Scheme Card]
[Scheme Card]

Continue where you left off

[Application]
[Document task]

🤖 Ask SevaConnect AI
```

---

# 8. Profile Page

Route:

```text
/profile
```

Sections:

- Personal information
- Date of birth
- Gender
- Location
- Income
- Occupation
- Household information
- Other eligibility-related information

Use progressive forms rather than one extremely long form.

Important:

Profile updates must be authenticated and authorized server-side.

---

# 9. Scheme Discovery

Route:

```text
/schemes
```

Features:

- Search
- Category filters
- State filters
- Sort
- Pagination/infinite loading
- Scheme cards

Scheme card:

```text
┌─────────────────────────────────────┐
│ Scheme Name                         │
│ Department                          │
│                                     │
│ Short description                   │
│                                     │
│ 🟢 Potentially relevant             │
│                                     │
│ [View Details] [Save]               │
└─────────────────────────────────────┘
```

---

# 10. Scheme Details

Route:

```text
/schemes/:id
```

Sections:

1. Scheme title
2. Department
3. Overview
4. Benefits
5. Eligibility
6. Required documents
7. Application process
8. Official source
9. AI explanation
10. Save scheme
11. Check eligibility

Primary actions:

```text
[Check My Eligibility]
[Ask AI About This Scheme]
[Save Scheme]
[Apply on Official Portal]
```

The application CTA must point to the verified official application source where available.

---

# 11. Personalized Recommendations

Route:

```text
/recommendations
```

Sections:

- Recommendation summary
- Potential matches
- Needs verification
- More information required
- Does not currently match

Each result should explain why it was recommended.

Example:

```text
Why this scheme?

✓ Your state matches
✓ Your occupation matches
✓ Your income is within the configured range
⚠ Income certificate needs verification
```

---

# 12. Eligibility Page

Route:

```text
/eligibility
```

Flow:

```text
User Profile
     ↓
Eligibility Engine
     ↓
Scheme Rules
     ↓
Structured Result
     ↓
Explanation
```

Status labels:

```text
🟢 Potentially Relevant
🟡 Needs Verification
⚪ More Information Needed
🔴 Does Not Currently Match
```

Avoid presenting AI-generated eligibility as an official determination.

---

# 13. Documents Page

Route:

```text
/documents
```

Features:

- Upload
- View metadata
- Delete
- Document readiness
- Required document checklist
- Scheme-specific document requirements

Example:

```text
Document Readiness

██████████████░░░░ 72%

✓ Identity Proof
✓ Address Proof
⚠ Income Certificate
⚠ Category Certificate
```

Documents should remain private and should never be publicly accessible.

---

# 14. Applications Page

Route:

```text
/applications
```

Show:

- Application
- Scheme
- Current status
- Last update
- Next action

Application detail:

```text
DISCOVERED
   ↓
ELIGIBILITY CHECKED
   ↓
DOCUMENTS READY
   ↓
APPLICATION SUBMITTED
   ↓
UNDER REVIEW
   ↓
APPROVED / REJECTED / ACTION REQUIRED
```

Only trusted backend/admin/integration processes may create official status events.

---

# 15. Saved Schemes

Route:

```text
/saved-schemes
```

Users can:

- Save schemes.
- Remove schemes.
- Open scheme details.
- Check eligibility.

---

# 16. AI Assistant

Route:

```text
/assistant
```

This is a first-class product area, not merely a chatbot popup.

Main UI:

```text
┌─────────────────────────────────────────────────────────────┐
│ SevaConnect AI                                              │
│ Your Government Benefits Assistant                          │
│                                                             │
│ [🎯 Find schemes] [📄 Documents] [❓ Eligibility]           │
│                                                             │
│ AI conversation                                             │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Ask SevaConnect anything...                       ➤    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

# 17. Notifications

Route:

```text
/notifications
```

Examples:

- Document reminder
- Application update
- New recommendation
- Profile completion reminder
- System notification

---

# 18. Settings

Route:

```text
/settings
```

Sections:

- Language
- Account
- Security
- Notification preferences
- AI preferences
- Privacy
- Delete account

---

# 19. Admin Dashboard

Route:

```text
/admin
```

Dashboard:

- Total users
- Active users
- Scheme count
- Applications
- AI usage
- Errors
- Pending content/source reviews

Admin navigation:

```text
Dashboard
Users
Schemes
Sources
Applications
Audit Logs
Settings
```

All admin authorization is enforced by the backend.

---

# 20. Shared UI Components

```text
components/
├── layout/
│   ├── Navbar
│   ├── Sidebar
│   ├── Footer
│   ├── MobileNavigation
│   └── PageContainer
│
├── ui/
│   ├── Button
│   ├── Input
│   ├── Select
│   ├── Modal
│   ├── Drawer
│   ├── Card
│   ├── Badge
│   ├── Alert
│   ├── Tabs
│   ├── Progress
│   └── Skeleton
│
├── schemes/
│   ├── SchemeCard
│   ├── SchemeFilters
│   ├── EligibilityBadge
│   ├── DocumentList
│   └── SchemeSource
│
├── applications/
│   ├── ApplicationCard
│   ├── ApplicationTimeline
│   └── ApplicationStatus
│
├── documents/
│   ├── DocumentCard
│   ├── DocumentUploader
│   └── DocumentReadiness
│
└── ai/
    ├── AIChat
    ├── ChatMessage
    ├── ChatInput
    ├── SuggestedQuestions
    ├── SchemeRecommendationCard
    ├── EligibilityExplanation
    ├── DocumentExplanation
    ├── SourceCitation
    ├── AIThinking
    └── AIFeedback
```

---

# 21. Frontend Architecture

```text
src/
├── app/
├── pages/
├── components/
├── layouts/
├── services/
│   └── api/
├── hooks/
├── store/
├── types/
├── schemas/
├── utils/
└── routes/
```

Use feature/domain boundaries so teams can work independently.

---

# 22. Route Protection

```text
PublicRoute
    ↓
AuthenticationRoute
    ↓
CitizenRoute
    ↓
AdminRoute
```

Frontend route protection is for UX.

Backend authorization is the real security boundary.

---

# 23. Responsive Design

Desktop:

```text
Sidebar + Main Content
```

Tablet:

```text
Compact Sidebar + Main Content
```

Mobile:

```text
Top Bar
Main Content
Bottom Navigation
```

Critical actions should remain accessible on mobile.

---

# 24. Accessibility

Target:

- Keyboard navigation
- Visible focus states
- Semantic HTML
- Accessible forms
- Screen-reader labels
- Sufficient contrast
- Error messages associated with inputs
- No color-only status communication
- Responsive text sizing

---

# 25. Website Development Principle

Every page should have:

```text
Loading
Empty
Success
Error
Retry
```

Every authenticated page should have:

```text
Authentication
Authorization
Ownership
```

Every AI page should have:

```text
Grounding
Source citation
Uncertainty
Feedback
```
