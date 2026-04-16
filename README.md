# 🎟️ Eventify – Premium Event Registration & Digital Ticketing

**Eventify** is a professional-grade **Next.js** full-stack application for event lifecycle management—from secure organizer creation to attendee registration and instant QR-based entry verification.

---

## 🚀 Vision

Eventify bridges the gap between digital registration and physical event entry. It provides organizers with a powerful dashboard to manage attendee flow and participants with a premium, print-ready ticketing experience.

---

## ✨ Features

### 👨‍💼 For Organizers (Command Center)
- **Unified Authentication**: Login via traditional email/password or **Google OAuth**.
- **Smart Dashboard**: Manage multiple events with real-time "Tickets Left" tracking and automated sorting (upcoming events first).
- **Dual Approval Flow**:
  - **Auto**: Instant ticket generation upon registration.
  - **Manual**: Review attendee details before granting access.
- **Entry Verification Scanner**: Built-in QR code validator. Verify attendee tickets instantly with **VERIFIED** or **INVALID** status.
- **Session Security**: JWT-based authentication with secure httpOnly cookies.

### 👥 For Attendees
- **Premium Digital Tickets**: High-fidelity "Admit One" tickets featuring:
  - **Environment-Aware QR Codes**: Scannable codes for event entry.
  - **Professional Design**: Optimized for both mobile and printing.
- **Live Event Status**: Instant feedback on **Completed** (past) events and **Sold Out** status.
- **Ticket Lookup**: Retrieve your unique ticket anytime using your email and event ID.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB + Mongoose
- **Security**: JWT, Bcrypt, Google Auth Library
- **QR Codes**: qrcode.react
- **Data Fetching**: Server Actions

---

## 💻 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)

### 1️⃣ Clone & Install
```bash
git clone <repo-url>
cd eventify
npm install
```

### 2️⃣ Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_min_32_chars
SALT_ROUNDS=10

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3️⃣ Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Authentication

Eventify uses **JWT stored in httpOnly cookies** for secure authentication:

- **Login/Signup**: Server Actions validate credentials, issue JWT
- **Token Storage**: JWT stored in httpOnly, secure cookies
- **Token Verification**: Each server action verifies token via `jwt.verify()`

### Auth Actions (`src/actions/auth.ts`)
| Action | Description |
|--------|-------------|
| `logIn(email, password)` | Login with email/password |
| `signUp(name, email, password)` | Register new user |
| `googleAuth(credential)` | Login/Register with Google |
| `logout()` | Clear auth cookie |
| `getCurrentUser()` | Get current logged in user |

---

## 📁 Project Structure

```
eventify/
├── src/
│   ├── actions/              # Server Actions
│   │   ├── auth.ts           # Authentication actions
│   │   └── events.ts         # Event management actions
│   ├── app/                  # Next.js App Router pages
│   │   ├── events/           # Public event pages
│   │   ├── organizer/        # Organizer dashboard
│   │   └── tickets/          # Ticket pages
│   ├── components/           # React components
│   ├── lib/                  # Utilities (db, api)
│   └── models/               # Mongoose models
├── public/                   # Static assets
├── .env.local                # Environment variables
└── package.json
```

---

## 🎫 QR Verification Workflow

Organizers can verify tickets at the gate:
1. Points a smartphone camera at the attendee's QR code.
2. Clicks the scanned URL.
3. The app instantly checks the database and displays a **VERIFIED** badge with the attendee's name and event details.

---

Built with Next.js 16, Tailwind CSS, and MongoDB. 🚀