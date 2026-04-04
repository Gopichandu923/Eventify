# 🎟️ Eventify – Premium Event Registration & Digital Ticketing

**Eventify** is a professional-grade **MERN** stack application designed to automate event lifecycle management—from secure organizer creation to attendee registration and instant QR-based entry verification.

---

## 🚀 Vision
Eventify bridges the gap between digital registration and physical event entry. It provides organizers with a powerful dashboard to manage attendee flow and participants with a premium, print-ready ticketing experience.

---

## ✨ Advanced Features

### 👨‍💼 For Organizers (Command Center)
- **Unified Authentication**: Login via traditional email/password or **Google OAuth** for a seamless experience.
- **Smart Dashboard**: Manage multiple events with real-time "Tickets Left" tracking and automated sorting (upcoming events first).
- **Dual Approval Flow**:
  - **Auto**: Instant ticket generation upon registration.
  - **Manual**: Review attendee details before granting access.
- **Entry Verification Scanner**: Built-in QR code validator. Organizers can scan attendee tickets with any mobile device to get an instant **VERIFIED** or **INVALID** status.
- **Session Security**: Advanced `httpOnly` refresh token strategy ensures long-lasting but extremely secure sessions.

### 👥 For Attendees
- **Premium Digital Tickets**: High-fidelity "Admit One" tickets featuring:
  - **Environment-Aware QR Codes**: Scannable codes for event entry.
  - **Perforated Stub Design**: A professional look optimized for both mobile and high-quality printing.
- **Live Event Status**: Instant feedback on **Completed** (past) events and **Sold Out** status.
- **Ticket Lookup**: Lost your link? Retrieve your unique ticket anytime using your email and event ID.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite.
- **Backend**: Node.js, Express, Mongoose.
- **Security**: JWT (Access + Refresh Tokens), Bcrypt, Google Auth Library, Cookie-Parser.
- **Tools**: QR Code SVG Generation (`qrcode.react`), Axios Interceptors (Zero-touch token rotation).

---

## 💻 Installation & Setup

### 1️⃣ Backend Setup
```bash
cd backend
npm install

# Create .env file with the following:
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
GOOGLE_CLIENT_ID=your_google_id
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
SALT_ROUNDS=10
```
`npm start` to run the server.

### 2️⃣ Frontend Setup
```bash
cd frontend
npm install

# Configure API
# Ensure src/api.ts points to http://localhost:5000/api for local development.

npm run dev
```

---

## 🛡️ Security Architecture
Eventify uses a **Silent Token Refresh** architecture:
1. **Access Token**: Short-lived (15m), stored in memory/localStorage for API calls.
2. **Refresh Token**: Long-lived (7d), stored in a **Secure, HttpOnly Cookie**.
3. **Axios Interceptors**: Automatically detect `401 Unauthorized` errors, call the `/refresh` endpoint, and retry the original request without the user ever seeing a login screen.

---

## 🎫 QR Verification Workflow
Organizers can verify tickets at the gate:
1. Points a smartphone camera at the attendee's QR code.
2. Clicks the scanned URL.
3. The app instantly checks the database and displays a **VERIFIED** badge with the attendee's name and event details.

---

Proudly built with a focus on performance, security, and premium user experience. 🚀
