# 🚀 CodeArena – Hackathon Management Platform

CodeArena is a **full-stack hackathon management platform** designed for organizers, participants, and judges. It provides a **modern frontend built with Next.js & React** and a **robust backend powered by Node.js, Express, and a hybrid database (Azure SQL + MongoDB)**.

Whether you’re running a small coding contest or a large-scale hackathon, CodeArena offers everything from **event creation, team management, submissions, certificates, and real-time updates** – all in one platform.

---

## ✨ Features

### 🎯 Core Functionality

* **Multi-Role Authentication** – Organizers, Judges, Participants
* **Event Management** – Create, edit, and manage hackathon events
* **Team Collaboration** – Form and manage teams
* **Submissions System** – Submit GitHub repos, videos, and docs
* **Certificate Generation** – Auto-generate and download digital certificates
* **Enrollment Tracking** – Monitor participant statistics in real-time
* **Announcements & Chat** – Broadcast announcements + Q\&A system
* **Analytics Dashboard** – Charts, event progress, and participant insights

### 🎨 UI/UX Features

* Modern responsive design with **Tailwind CSS + Radix UI**
* **Dark/Light theme** with system preference detection
* **Accessible (WCAG-compliant)** components with keyboard navigation
* **Interactive dashboards** (Recharts-powered charts & event calendar)
* **Confetti animations 🎉** for celebrations

### 🔐 Security

* JWT Authentication with role-based access control
* Password hashing with bcrypt
* Input validation using Zod
* Helmet.js for HTTP headers & security best practices
* CORS protection + centralized error handling

---

## 🛠️ Tech Stack

### Frontend

* **Next.js 15.4.6** (App Router)
* **React 19.1.0**
* **TypeScript 5**
* **Tailwind CSS 4**
* **Radix UI + Lucide Icons**
* **Recharts, React Hook Form, Zod, next-themes**

### Backend

* **Node.js 18+**
* **Express.js 5.1.0**
* **Azure SQL Database** (Relational: Users, Events, Teams, Enrollments)
* **MongoDB + Mongoose** (Flexible: Submissions, Certificates, Announcements, Chat)
* **JWT, bcrypt, Helmet, CORS, Zod** for security
* **Nodemon, Morgan, dotenv** for development

---

## 📂 Project Structure

```
codearena/
├── frontend/                  # Next.js frontend
│   ├── app/                   # App Router pages
│   ├── components/            # UI components (Radix + Tailwind)
│   ├── contexts/              # React Context providers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities & configs
│   └── middleware.ts          # Auth middleware
│
├── backend/                   # Node.js + Express backend
│   ├── config/                # Database & environment configs
│   ├── controllers/           # Business logic
│   ├── middlewares/           # Auth, validation, error handling
│   ├── models/                # SQL + MongoDB models
│   ├── routes/                # API route definitions
│   ├── utils/                 # Utilities
│   └── validators/            # Zod schemas
│
├── .env.example               # Environment variables template
└── README.md                  # Documentation
```

---

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd codearena
```

### 2. Setup Frontend

```bash
cd frontend
npm install
```

Create **.env.local**:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_JWT_SECRET=your-secret-key
```

Run frontend:

```bash
npm run dev
```

### 3. Setup Backend

```bash
cd backend
npm install
```

Create **.env**:

```env
PORT=5000
NODE_ENV=development

# Azure SQL
SQL_SERVER=your-server.database.windows.net
SQL_DATABASE=codearena
SQL_USER=your-username
SQL_PASSWORD=your-password

# MongoDB
MONGODB_URI=mongodb://localhost:27017/codearena

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

Run backend:

```bash
npm run dev
```

---

## 🔌 API Endpoints

### Authentication

* `POST /api/auth/register` – Register user
* `POST /api/auth/login` – Login
* `POST /api/auth/logout` – Logout
* `GET /api/auth/profile` – Get profile

### Events

* `GET /api/events` – List events
* `POST /api/events` – Create event (Organizer)
* `PUT /api/events/:id` – Update event
* `POST /api/events/:id/enroll` – Enroll in event

### Teams

* `POST /api/teams` – Create team
* `POST /api/teams/:id/join` – Join team

### Submissions

* `POST /api/submissions` – Create submission
* `GET /api/submissions/:id` – Get submission details

### Certificates

* `POST /api/certificates` – Issue certificate (Organizer)
* `GET /api/certificates` – Get user certificates

### Announcements & Chat

* `POST /api/announcements` – Create announcement
* `GET /api/chatqnas` – Fetch chat messages

---

## 🧪 Testing

* **Frontend**

```bash
npm run lint
npm run type-check
npm run build
```

* **Backend**

```bash
curl -X GET http://localhost:5000/api/health
```

---

## 🚀 Deployment

* **Vercel** for frontend (recommended)
* **Azure + MongoDB Atlas** for backend databases
* **PM2** for backend process management

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

* Frontend: **MIT License**
* Backend: **ISC License**

---

## 🙏 Acknowledgments

* **Next.js & React** for the frontend framework
* **Express.js & Node.js** for backend
* **Azure SQL + MongoDB** for hybrid database architecture
* **Tailwind CSS + Radix UI** for modern design
* **Zod, JWT, Helmet** for validation & security

---

🔥 **Built with ❤️ by the CodeArena Team**
