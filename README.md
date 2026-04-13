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
- **Session Security**: JWT-based authentication with token refresh strategy.

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
- **HTTP Client**: Axios with interceptors

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
REFRESH_TOKEN_SECRET=your_refresh_secret_min_32_chars
SALT_ROUNDS=10

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# API (optional - for production)
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

### 3️⃣ Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/google` | Login/Register with Google |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/refresh` | Refresh access token |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get organizer's events |
| GET | `/api/events/all` | Get all public events |
| GET | `/api/events/[id]` | Get single event |
| POST | `/api/events` | Create new event |
| PUT | `/api/events/[id]` | Update event |
| DELETE | `/api/events/[id]` | Delete event |
| GET | `/api/events/[id]/registrations` | Get event registrations |

### Registrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/registrations` | Get registrations (organizer) |
| POST | `/api/registrations` | Register for event |
| PUT | `/api/registrations/[id]/status` | Update registration status |
| GET | `/api/registrations/tickets/[id]` | Get ticket details |
| GET | `/api/registrations/tickets/lookup` | Lookup ticket by email |

---

## 🛡️ Security Architecture
Eventify uses a **Silent Token Refresh** architecture:
1. **Access Token**: Short-lived (7d), stored in localStorage for API calls.
2. **Axios Interceptors**: Automatically detect `401 Unauthorized` errors, call the `/refresh` endpoint, and retry the original request.

---

## 🎫 QR Verification Workflow
Organizers can verify tickets at the gate:
1. Points a smartphone camera at the attendee's QR code.
2. Clicks the scanned URL.
3. The app instantly checks the database and displays a **VERIFIED** badge with the attendee's name and event details.

---

## 📁 Project Structure

```
eventify/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/             # API routes
│   │   ├── events/          # Public event pages
│   │   ├── organizer/       # Organizer dashboard
│   │   └── tickets/         # Ticket pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities (db, api)
│   └── models/              # Mongoose models
├── public/                  # Static assets
├── .env.local               # Environment variables
└── package.json
```

---

Built with Next.js 16, Tailwind CSS, and MongoDB. 🚀