# 🎟️ Eventify – Event Registration & Digital Ticketing System

Eventify is a full-stack **MERN** application designed to streamline event creation, attendee registration, and digital ticket management. It offers a secure organizer dashboard for event and registration approvals, along with a simple public flow for attendees to register and retrieve their tickets.

---

## 🚀 Project Overview

Eventify allows:
- **Organizers** to create events, review registrations, and approve or reject attendees.
- **Attendees** to register for events and retrieve their unique digital tickets using their email and event ID.

The system ensures a smooth and transparent event registration workflow with secure authentication and easy ticket access.

---

## ✨ Key Features

### 👨‍💼 For Organizers (Protected Routes)
- **Event Management**
  - Create, view, and manage events (title, venue, date).
- **Registration Review**
  - View pending registrations.
  - Manually approve or reject attendee registrations.
- **Authentication**
  - Secure JWT-based login system for organizers.

### 👥 For Attendees (Public Access)
- **Public Event Registration**
  - Simple registration form.
  - Tickets are created with a default **Pending** status.
- **Ticket Lookup**
  - Retrieve ticket details using **email + event ID**.
- **Digital Ticket Page**
  - View ticket and event details.
  - Print or download **PDF tickets** for approved registrations.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **React** – UI development
- **TypeScript** – Type safety and maintainability
- **React Router** – Page navigation
- **Axios** – API communication
- **Tailwind CSS** – Utility-first styling

### Backend (API)
- **Node.js / Express** – Server framework
- **MongoDB / Mongoose** – Database and ODM
- **JWT (JSON Web Tokens)** – Authentication & authorization
- **Bcrypt** – Secure password hashing

---

## 💻 Installation & Setup

### Prerequisites
- **Node.js** v18+
- **MongoDB** (Local or MongoDB Atlas)

---

### 1️⃣ Backend Setup

```bash
# Clone the repository
git clone [YOUR_REPO_URL]
cd Eventify/backend

# Install dependencies
npm install
