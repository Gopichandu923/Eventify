Eventify – MERN Event Ticketing Platform
Eventify is a full‑stack MERN web application that allows organizers to create events and manage registrations, while users can register for events and receive tickets through auto or manual approval workflows.
This project is built as a personal project to demonstrate real‑world full‑stack development using MongoDB, Express, React, and Node.js.
________________________________________
🚀 Features
👤 Organizer (Authenticated)
•	Sign up & log in using JWT authentication
•	Create events with:
o	Title
o	Description
o	Date & time
o	Venue
o	Ticket limit
o	Approval mode (Auto / Manual)
•	View all events created by the organizer
•	View registrations for each event
•	Approve or reject registrations (manual approval mode)
🌍 Public User
•	Access public event registration link
•	Register for an event without login
•	Auto‑approval events → ticket approved instantly
•	Manual‑approval events → registration marked as pending
🎫 Ticket System
•	Ticket generated only after approval
•	Ticket page displays:
o	Event details
o	User details
o	Unique Ticket ID
________________________________________
🛠 Tech Stack
Frontend
•	React (Vite)
•	React Router
•	Tailwind CSS
•	Axios
Backend
•	Node.js
•	Express.js
•	MongoDB + Mongoose
•	JWT Authentication
•	bcrypt (password hashing)
________________________________________
📂 Project Structure
eventify-mern/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
|   |   |-- assests/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js
│   │   └── App.jsx
│   └── package.json
└── README.md
________________________________________
⚙️ Installation & Setup
Prerequisites
•	Node.js (v18+ recommended)
•	MongoDB (local or Atlas)
•	npm or yarn
________________________________________
🔧 Backend Setup
cd backend
npm install
Create a .env file in the backend folder:
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventify
JWT_SECRET=your_secret_key
Start the backend server:
npm run dev
Backend runs at:
http://localhost:5000
________________________________________
🎨 Frontend Setup
cd frontend
npm install
npm run dev
Frontend runs at:
http://localhost:5173
________________________________________
🔑 API Overview
Authentication
•	POST /api/auth/signup – Organizer signup
•	POST /api/auth/login – Organizer login
Events
•	POST /api/events – Create event (auth required)
•	GET /api/events/my – Get organizer events
•	GET /api/events/:id – Public event details
Registrations
•	POST /api/registrations/event/:eventId – Register for event (public)
•	GET /api/registrations/event/:eventId – View registrations (organizer)
•	PUT /api/registrations/:regId – Approve / Reject registration
•	GET /api/registrations/:regId – View ticket details
________________________________________
🧠 Key Concepts Demonstrated
•	RESTful API design
•	JWT‑based authentication
•	Role‑based flow (Organizer vs Public User)
•	MongoDB schema relationships
•	Auto vs manual approval logic
•	Clean folder structure
•	Reusable frontend components
________________________________________
🌱 Future Enhancements
•	Email notifications on approval
•	QR code or PDF ticket generation
•	Organizer authorization checks
•	Pagination & search for events
•	Improved UI/UX
•	Deployment (Render / Vercel)
________________________________________
👨‍💻 Author
Gopi Chandu
Full‑Stack Developer (MERN)
________________________________________
⭐ If you like this project
Give it a ⭐ on GitHub and feel free to fork or contribute!
________________________________________
📌 Project Tagline
Eventify – Build events. Manage registrations. Issue tickets.
