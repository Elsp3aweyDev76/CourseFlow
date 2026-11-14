# 🎓 CourseFlow — Interactive & Structured LMS Platform

**CourseFlow** is a modern, full-stack Learning Management System (LMS) designed to enforce structured, sequential learning. It connects instructors and students through an interactive video-based platform equipped with an automated anti-skipping mechanism, dynamic quiz assessments, real-time progress tracking, and verifiable completion certificates.

## 📌 Key Highlights

* **Sequential Learning Enforcement**: Prevents students from skipping video segments or unlocking subsequent modules without completing prerequisites.
* **Automated Resume Timestamping**: Video player automatically saves and resumes playback from the student's exact last-watched position.
* **Server-Side Quiz Correction**: Instant dynamic grading for end-of-module quizzes with minimum passing threshold validation.
* **Role-Based Access Control (RBAC)**: Distinct workflows and dashboards tailored for **Students**, **Instructors**, and **Admins**.
* **SEO & Performance Optimized**: Built with **Next.js (App Router & SSR)** to maximize page loading speed and public course visibility.

## 🚀 Features Breakdown

### 👨‍🎓 For Students

* **Interactive Video Player**: Resume videos from where you left off; seek bar forward-skipping is restricted based on verified watch time.
* **Progress Tracking**: Real-time visual progress bars displaying completion metrics per lesson, module, and overall course.
* **Instant Assessments**: Take digital quizzes at the end of modules with immediate feedback and detailed explanation.
* **Certificate Generation**: Automatically receive a verifiable PDF certificate upon reaching 100% course completion.

### 👨‍🏫 For Instructors

* **Course Builder**: Hierarchical course creation (Course ➔ Modules ➔ Lessons & Quizzes).
* **Video Management**: Upload and set requirements for video content (e.g., minimum watch threshold).
* **Question Bank & Quiz Creator**: Build multiple-choice assessments and specify passing scores required for module progression.

### 🛡️ For Admins

* **Platform Management**: Review, approve, or reject newly submitted courses prior to public launch.
* **User & Role Management**: Oversee student and instructor accounts, access privileges, and system activity.
* **Analytics Dashboard**: Monitor overall platform performance, completion rates, and active user metrics.

## 🛠️ Tech Stack & Architecture

### **Frontend**
* **Framework**: Next.js 14 (React, App Router, Server Components)
* **Styling**: Tailwind CSS, Shadcn UI / Radix Primitives
* **State & Data Fetching**: React Query / TanStack Query, Zustand
* **Media Player**: Video.js / ReactPlayer (Customized with event hooks for progress heartbeats)

### **Backend**
* **Runtime**: Node.js (Express.js or NestJS framework)
* **Authentication**: JSON Web Tokens (JWT) stored in secure `HttpOnly` Cookies
* **ORM**: Prisma ORM (Type-safe database client)
* **PDF Engine**: PDFKit / Puppeteer for automated certificate rendering

### **Database & Storage**
* **Database**: PostgreSQL (Relational schema for user profiles, course hierarchy, attempts, and progress)
* **Video Streaming**: Cloudflare Stream / AWS S3 + CloudFront (HLS streaming protocol)

## 📂 Project Structure (Monorepo Overview)

```
courseflow/
├── client/                     # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                # Next.js App Router Pages & Layouts
│   │   │   ├── (auth)/         # Login & Register Routes
│   │   │   ├── (dashboard)/    # Student / Instructor / Admin Panels
│   │   │   └── courses/        # Course Catalog & Player Pages
│   │   ├── components/         # Reusable UI & Video Player Components
│   │   ├── hooks/              # Custom React Hooks (Heartbeat, Progress)
│   │   └── lib/                # API Client & Utility Functions
│   └── package.json
│
├── server/                     # Node.js Backend API Service
│   ├── src/
│   │   ├── controllers/        # Route Handlers (Auth, Course, Progress)
│   │   ├── middlewares/        # Auth, RBAC & Sequential Lock Checks
│   │   ├── services/           # Business Logic & Quiz Auto-Grading
│   │   └── routes/             # RESTful API Endpoints
│   ├── prisma/
│   │   └── schema.prisma       # Database Schema & Relations
│   └── package.json
│
└── README.md
```

## 💾 Database ERD Highlights

```
[ User ] 1 ─── N [ Course ] 1 ─── N [ Module ] 1 ─── N [ Lesson ]
   │                                                         │
   ├────── N ─── [ LessonProgress ] ─────────────────────────┘
   │
   ├────── N ─── [ QuizAttempt ] ──── N ─── [ Quiz ]
   │
   └────── 1 ─── [ Certificate ]
```

## ⚡ Anti-Skipping Mechanism Logic

```
[ Student Plays Video ]
         │
         ├──► Sends Heartbeat API Request every 10 sec -> Server updates `maxWatchedSeconds`
         │
[ User Attempts to Seek Forward ]
         │
         ├──► Next.js Video Component compares target time with `maxWatchedSeconds`
         │
         ├──► IF Target Time > maxWatchedSeconds:
         │         └── Reset playback head to maxWatchedSeconds
         │
         └──► IF Watch Percentage >= 90%:
                   └── Mark lesson as `COMPLETED` -> Unlock next Lesson/Quiz
```

## 🔧 Getting Started & Installation

### Prerequisites

* Node.js `v18.x` or higher
* PostgreSQL installed locally or a hosted instance (Supabase / Neon)
* npm or pnpm package manager

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/courseflow.git
cd courseflow
```

### 2. Configure Environment Variables

Create a `.env` file in both `server/` and `client/` directories:

**`server/.env`**:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/courseflow_db?schema=public"
JWT_SECRET="your_super_secret_jwt_key"
FRONTEND_URL="http://localhost:3000"
```

**`client/.env.local`**:
```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000/api/v1"
```

### 3. Setup Backend & Database

```bash
cd server
npm install
npx prisma migrate dev --name init
npm run dev
```

### 4. Setup Frontend

```bash
cd ../client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout -b feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.