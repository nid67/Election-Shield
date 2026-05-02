# 🛡️ Election Shield — Family Election Co-Pilot

<div align="center">

![Election Shield Banner](https://img.shields.io/badge/Election%20Shield-AI%20Powered-blue?style=for-the-badge&logo=google&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-12-orange?style=for-the-badge&logo=firebase)
![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Flash%20Latest-purple?style=for-the-badge&logo=google)
![XState](https://img.shields.io/badge/XState-5-red?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

**A structured, decision-driven AI assistant to guide every family member through India's election process — from registration to casting their vote.**

[Live Demo](#) · [Report Bug](https://github.com/nid67/Election-Shield/issues) · [Feature Request](https://github.com/nid67/Election-Shield/issues)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [AI Co-Pilot Design](#-ai-co-pilot-design)
- [XState Decision Engine](#-xstate-decision-engine)
- [Firebase Integration](#-firebase-integration)
- [Security](#-security)
- [API Key Management](#-api-key-management)
- [Contributing](#-contributing)

---

## 🌟 Overview

**Election Shield** is a web application built for the Google AI Hackathon. It solves a real-world problem: millions of Indian voters — especially in multi-generational families — are confused about the election process, miss deadlines, or don't know where their polling booth is.

Election Shield acts as a **family-level co-pilot** — allowing one user to manage the entire election journey (registration → verification → booth finding → voting) for every member of their family, with an embedded **Gemini AI assistant** that provides hyper-personalized guidance at each step.

> ⚠️ This is NOT a simple chatbot. It is a structured, **state-machine-driven** decision assistant grounded in Election Commission of India (ECI) rules.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **Firebase Auth** | Secure Google Sign-In / Email-Password authentication |
| 👨‍👩‍👧 **Family Dashboard** | Add, manage, and track multiple family members in one place |
| 🤖 **AI Co-Pilot (Gemini)** | Context-aware AI assistant that knows each member's age, status & current journey phase |
| 🗺️ **Polling Booth Finder** | Assigns nearest booth and opens Google Maps for turn-by-turn navigation |
| 💾 **Local AI Response Cache** | Caches AI answers in `localStorage` to prevent duplicate API calls and save quota |
| 📋 **4-Step Checklist** | Registration → Verification → Booth Assignment → Voted |
| 🧠 **XState Decision Engine** | A formal state machine ensures users progress linearly through the election journey |
| 📱 **Responsive Design** | Mobile-first, PWA-ready layout |
| 🎨 **Rich Markdown Rendering** | AI answers rendered as beautiful formatted text (lists, bold, etc.) |
| ✅ **Firestore Persistence** | All family member data and journey progress saved to Cloud Firestore |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                        │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Dashboard   │    │Member Journey│    │  Auth Pages  │  │
│  │   Page       │───▶│    Page      │    │  (Login)     │  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘  │
│         │                   │                   │          │
│         ▼                   ▼                   ▼          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               React State + XState Machine          │   │
│  │  (onboarding → registration → verifyDetails →      │   │
│  │   booth → voting → completion | ineligible)        │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
  ┌──────────────┐ ┌────────────┐ ┌─────────────────┐
  │   Firebase   │ │  Next.js   │ │  Google Maps    │
  │  Auth +      │ │  Server    │ │  (Directions)   │
  │  Firestore   │ │  Actions   │ └─────────────────┘
  └──────────────┘ │  (AI API)  │
                   └─────┬──────┘
                         ▼
                  ┌────────────┐
                  │ Gemini AI  │
                  │ (gemini-   │
                  │flash-latest│
                  └────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2.4 | React framework with App Router & Server Actions |
| **React** | 19.2.4 | UI library |
| **TypeScript** | 5 | Type safety throughout the project |
| **Tailwind CSS** | 4 | Utility-first styling |
| **shadcn/ui** | latest | Pre-built accessible UI components |
| **react-markdown** | 10.1.0 | Renders AI responses as rich formatted text |
| **lucide-react** | latest | Icon library |

### Backend & AI
| Technology | Version | Purpose |
|---|---|---|
| **Firebase Auth** | 12 | User authentication (Email/Password, Google) |
| **Cloud Firestore** | 12 | NoSQL database for family member data |
| **@google/generative-ai** | 0.24.1 | Gemini AI SDK for the Co-Pilot |
| **Next.js Server Actions** | — | Secure server-side AI calls (key never exposed to client) |

### State Management
| Technology | Version | Purpose |
|---|---|---|
| **XState** | 5.31.0 | Formal state machine for election journey |
| **@xstate/react** | 6.1.0 | React bindings for XState |

---

## 📁 Project Structure

```
election-shield/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── actions/
│   │   │   └── ai.ts                # ⚡ Server Action: Secure Gemini AI calls
│   │   ├── dashboard/
│   │   │   ├── page.tsx             # Family Dashboard (CRUD for members)
│   │   │   ├── layout.tsx           # Dashboard layout with nav
│   │   │   └── member/
│   │   │       └── [id]/
│   │   │           └── page.tsx     # Individual Member Journey + AI Co-Pilot
│   │   ├── login/
│   │   │   └── page.tsx             # Authentication page
│   │   ├── globals.css              # Global styles + Tailwind Typography
│   │   ├── layout.tsx               # Root layout with providers
│   │   └── page.tsx                 # Landing / Home page
│   │
│   ├── components/
│   │   └── ui/                      # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── badge.tsx
│   │       ├── label.tsx
│   │       └── skeleton.tsx
│   │
│   ├── hooks/
│   │   └── useAuth.ts               # Firebase Auth context hook
│   │
│   ├── services/
│   │   ├── firebase.ts              # Firebase app initialization (SSR-safe)
│   │   └── db.ts                    # Firestore CRUD operations
│   │
│   ├── state/
│   │   └── electionMachine.ts       # XState machine: 6-state election workflow
│   │
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   │
│   └── lib/
│       └── utils.ts                 # Utility functions (cn, etc.)
│
├── firestore.rules                  # Firestore Security Rules
├── .env.local                       # Environment variables (gitignored)
├── next.config.ts                   # Next.js configuration
├── package.json                     # Dependencies
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **Firebase** project ([create one here](https://console.firebase.google.com))
- A **Gemini API Key** ([get one here](https://aistudio.google.com))
- A **Google Maps API Key** ([get one here](https://console.cloud.google.com))

### 1. Clone the Repository

```bash
git clone https://github.com/nid67/Election-Shield.git
cd Election-Shield
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then fill in your values (see [Environment Variables](#-environment-variables) section below).

### 4. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use an existing one)
3. Enable **Authentication** → Email/Password provider
4. Enable **Cloud Firestore** → Start in production mode
5. Deploy the security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

---

## 🔑 Environment Variables

Create a `.env.local` file with the following variables:

```env
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Firebase Configuration
# Get these from: Firebase Console → Project Settings → Your Apps
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Google Maps API Key
# Get from: Google Cloud Console → APIs & Services → Credentials
# Required APIs: Maps JavaScript API, Places API
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Gemini AI API Key (SERVER-SIDE ONLY — never exposed to browser)
# Get from: https://aistudio.google.com
# Note: Use gemini-flash-latest model for best quota availability
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GEMINI_API_KEY="your_gemini_api_key"
```

> **⚠️ Important**: The `GEMINI_API_KEY` does NOT have the `NEXT_PUBLIC_` prefix intentionally. This ensures it is only available on the server via Next.js Server Actions and is **never exposed** to the client browser bundle.

---

## 🤖 AI Co-Pilot Design

### How It Works

The AI Co-Pilot is powered by **Google Gemini** (`gemini-flash-latest`), implemented as a **Next.js Server Action** for maximum security.

#### File: `src/app/actions/ai.ts`

```typescript
"use server"; // ← Runs exclusively on the server

export const askElectionAI = async (context, question) => {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  // Context-aware prompt injection...
};
```

### Context Injection

Every AI call is enriched with full member context:

| Context Field | Purpose |
|---|---|
| `name` | Personalizes the response ("Hi Rahul, here's what you need...") |
| `age` | Determines eligibility (under-18 gets volunteer advice) |
| `registered` | Tailors advice to current registration status |
| `currentState` | Machine state ("booth", "voting", etc.) focuses the AI on the current step |

### Prompt Engineering

The AI is given a strict persona:
- **Indian context only** — All advice is grounded in ECI (Election Commission of India) rules
- **Concise bullet-point format** — Maximum 150 words per response
- **State-aware** — Advice is prioritized based on the current journey phase
- **Safe** — Never gives legal advice or predicts results

### Local Response Cache

To prevent duplicate API calls and save Gemini quota, responses are cached in `localStorage`:

```
Cache Key Format: ai_cache_{memberId}_{question_lowercase}
```

If the same question is asked again for the same family member, the cached response is shown **instantly** without any API call.

---

## 🧠 XState Decision Engine

The election journey is modeled as a **formal finite state machine** using XState 5.

### States

```
onboarding
    │
    ├─[age >= 18]──▶ registration ──▶ verifyDetails ──▶ booth ──▶ voting ──▶ completion (final)
    │
    └─[age < 18]───▶ ineligible
```

### Events

| Event | From State | To State | Action |
|---|---|---|---|
| `SET_AGE` | `onboarding` | `registration` or `ineligible` | Guards age, assigns context |
| `REGISTER` | `registration` | `verifyDetails` | Saves Voter ID |
| `VERIFY_DETAILS` | `verifyDetails` | `booth` | Marks verification done |
| `FIND_BOOTH` | `booth` | `voting` | Marks booth found |
| `VOTE` | `voting` | `completion` | Marks voted |
| `RESET` | `ineligible` | `onboarding` | Resets machine |

### Guards

- **`isEligible`**: Allows transition to `registration` only if `age >= 18`
- **`isNotEligible`**: Routes users under 18 to the `ineligible` state with volunteer guidance

---

## 🔥 Firebase Integration

### Authentication (`src/services/firebase.ts`)

- Initialized with SSR safety check (`typeof window !== 'undefined'`) to prevent server-side hydration errors
- Exports `auth`, `db`, and `app` as singleton instances

### Firestore Data Model

```
users/
  └── {userId}/                    ← Firebase Auth UID
        └── familyMembers/
              └── {memberId}/      ← Auto-generated document ID
                    ├── name: string
                    ├── age: number
                    ├── status: "NOT_REGISTERED" | "REGISTERED" | "BOOTH_ASSIGNED" | "VOTED"
                    ├── voterId: string | undefined
                    ├── createdAt: number (timestamp)
                    └── checklist/
                          ├── registered: boolean
                          ├── detailsVerified: boolean
                          ├── boothFound: boolean
                          └── voted: boolean
```

### CRUD Operations (`src/services/db.ts`)

| Function | Description |
|---|---|
| `getFamilyMembers(userId)` | Fetches all family members for a user |
| `addFamilyMember(userId, member)` | Creates a new family member document |
| `updateFamilyMember(userId, memberId, updates)` | Updates specific fields |
| `deleteFamilyMember(userId, memberId)` | Removes a family member |

---

## 🔒 Security

### Firestore Security Rules (`firestore.rules`)

Data is strictly isolated per user — a user can only read/write their own family members:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/familyMembers/{memberId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### API Key Security

| Key | Exposure | Reason |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | Client-side | Required for Firebase Auth SDK in browser |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Client-side | Required for Maps JS API rendering |
| `GEMINI_API_KEY` | **Server-side only** | Protected via Next.js Server Actions, never in client bundle |

---

## 🗝️ API Key Management

### Which Gemini Model to Use

After extensive testing, **`gemini-flash-latest`** was found to be the most reliable model for this project:

| Model | Status |
|---|---|
| `gemini-flash-latest` | ✅ Works — Best for this project |
| `gemini-2.0-flash` | ❌ May hit quota limits on free tier |
| `gemini-pro-latest` | ❌ May hit quota limits on free tier |

### Google Maps APIs Required

Enable the following in Google Cloud Console:
- **Maps JavaScript API** — For map rendering
- **Places API** — For location search
- **Directions API** — For routing (future enhancement)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit changes: `git commit -m 'Add: your feature description'`
4. Push to branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is built for the **Google AI Hackathon** and is open-source under the [MIT License](LICENSE).

---

<div align="center">

Built with ❤️ for India's Democracy · Powered by **Google Gemini AI** & **Firebase**

</div>
