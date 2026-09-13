# ⌨️ TypingPro Benchmark

[![Live Demo](https://img.shields.io/badge/Live%20Demo-typingpro--seven.vercel.app-06b6d4?style=for-the-badge&logo=vercel&logoColor=white)](https://typingpro-seven.vercel.app/)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma%20ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

A modern, responsive, portfolio-grade typing speed benchmark engineered for touch typists and developers. Features zero-asset mechanical audio acoustics, real-time keyboard visualizer, interactive SVG pace charts, code mode, and secure account history persistence.

🌐 **Live Demo:** [https://typingpro-seven.vercel.app/](https://typingpro-seven.vercel.app/)

---

## ✨ Features

### 🔊 Web Audio API Mechanical Sound Engine

- **Tactile Switch Synthesis**: Zero external MP3 files or network latency. Generates authentic acoustics in real time using native oscillators and biquad filters:
  - **Mechanical Click** _(Cherry MX Blue style)_
  - **Thock** _(Holy Panda / Topre tactile bump)_
  - **Typewriter** _(Vintage snappy mechanical strike)_
  - **Mute** _(Silent practice)_
- **Error Acoustic Cue**: Subtle low-frequency feedback on mistyped characters.
- **Top-Bar Cycle Switcher**: One-click audio profile cycling with persistent local preference.

### ⌨️ Live Keyboard Visualizer & Home-Row Guidance

- **Interactive On-Screen Keyboard**: Illuminates pressed keys in real time and highlights the target next key.
- **Tactile Anchor Bumps**: Visual markers on `F` and `J` home-row anchor keys to cultivate proper touch typing technique.
- **Hide / Show Toggle**: Collapsible interface keeps the viewport clean when not needed.

### 📊 Real-Time SVG Pace & Consistency Analytics

- **Second-by-Second Velocity Chart**: Vector graph plotting Net WPM against Raw WPM across the duration of the test.
- **Error Scatter Plot**: Pinpoints the exact seconds mistakes occurred along the timeline.
- **Standard Scoring Formula**: Standardized 5-character word math:
  $$\text{Net WPM} = \frac{\text{Correct Characters} / 5}{\text{Duration in Minutes}}$$
- **Skill Tier Badges**: Automated rank classification from _Novice Typist 🌱_ to _Godspeed Maestro 👑_.
- **One-Click Share Result**: Copies formatted benchmark summary cards directly to your clipboard for Discord, Twitter, or portfolios.

### 💻 Developer Code Practice Mode

- Dedicated coding snippets for JavaScript `async/await`, React custom hooks, and syntax-heavy structures.
- Drills essential programming symbols (`{}`, `[]`, `=>`, `()`, `;`) that are typical bottlenecks for programmers.

### ⏱️ Flexible Modes & Ergonomics

- **Timed Mode**: Quick presets for 15s, 30s, 60s, and 120s benchmarks.
- **Passage Mode**: Full-text typing tests across Easy, Medium, and Hard difficulty tiers.
- **Power Hotkeys**: Instant restart anytime by tapping <kbd>Esc</kbd> or <kbd>Tab</kbd>.
- **Visual Controls**: Toggle between **JetBrains Mono** and System typography, plus Comfort, Large, and Extra Large passage sizing.
- **Dark / Light Contrast**: Modern obsidian slate dark mode and crisp alpine white light mode with high-contrast accessibility.

---

## 🛠️ Tech Stack & Architecture

| Layer                  | Technology                         | Description                                                               |
| :--------------------- | :--------------------------------- | :------------------------------------------------------------------------ |
| **Frontend Framework** | React 19, TypeScript               | Modern concurrent components, strict typing, and hooks                    |
| **Styling**            | Tailwind CSS v4                    | CSS variable design tokens, modern custom variants, glassmorphism         |
| **Audio Engine**       | Web Audio API                      | In-browser synthesized audio without external audio dependencies          |
| **Data Visualization** | Custom SVG Engine                  | Responsive vector performance charts with gradient fills and error points |
| **Typography**         | Plus Jakarta Sans & JetBrains Mono | Google Fonts optimized for legibility and monospaced code typing          |
| **Backend API**        | Node.js, Express 5                 | RESTful API architecture with structured error handling and validation    |
| **ORM & Database**     | Prisma ORM, PostgreSQL             | Type-safe migrations, relational schema, indexes on queries               |
| **Authentication**     | JWT & HTTP-Only Cookies            | Secure short-lived access tokens + rotating refresh token cookies         |
| **Build Tooling**      | Vite, ESLint, Prettier, Husky      | Lightning-fast HMR and pre-commit hooks                                   |

---

## 📁 Repository Structure

```text
typing_speed_test/
├── frontend/                     # React 19 + TypeScript + Vite Client
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── api/                  # Axios clients (auth, texts, results)
│   │   ├── components/           # UI components (Navbar, KeyboardVisualizer, ResultChart, TipsModal)
│   │   ├── hooks/                # Custom React hooks (useAuth, useTheme, tokenStore)
│   │   ├── pages/                # Route pages (HomePage, TypingPage, ResultPage, HistoryPage, etc.)
│   │   ├── theme/                # Theme provider & resolution logic
│   │   ├── types/                # Shared TypeScript definitions
│   │   ├── utils/                # Web Audio synthesizer & helpers
│   │   ├── index.css             # Tailwind v4 tokens, caret animations, glassmorphism
│   │   └── main.tsx              # React entry point
│   ├── index.html                # Preloaded Google fonts, SVG favicon, SEO tags
│   └── vite.config.ts            # Vite configuration
│
├── backend/                      # Express 5 + Prisma + PostgreSQL Server
│   ├── src/
│   │   ├── config/               # Environment variable validation & database clients
│   │   ├── controllers/          # Request handlers (auth, texts, results)
│   │   ├── middlewares/          # JWT verification, error handling, rate limiting
│   │   ├── prisma/               # Prisma schema & migrations
│   │   ├── routes/               # API endpoint routers
│   │   ├── services/             # Business logic & database operations
│   │   └── server.ts             # Express HTTP entry point
│   └── prisma.config.ts          # Prisma CLI configuration
│
├── .husky/                       # Git hooks (pre-commit, commit-msg)
├── commitlint.config.js          # Conventional Commits rules
└── eslint.config.js              # ESLint 9 configuration
```

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env`)

```env
# URL pointing to your backend API
VITE_API_BASE_URL=https://your-backend-api.onrender.com/api
```

### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=5001

# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/typing_speed_test?schema=public"

# JWT Secrets (generate strong random strings in production)
ACCESS_TOKEN_SECRET="your_access_token_secret_key"
REFRESH_TOKEN_SECRET="your_refresh_token_secret_key"

# Allowed frontend origins (comma-separated for multiple)
CORS_ORIGIN="http://localhost:5173,https://typingpro-seven.vercel.app"

# Optional: Set domain if cookies are shared across subdomains
# COOKIE_DOMAIN=".yourdomain.com"
```

---

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js** `>= 18.x`
- **npm** `>= 9.x`
- **PostgreSQL** instance (local or hosted on [Neon](https://neon.tech), [Supabase](https://supabase.com), etc.)

### 1. Clone the Repository

```bash
git clone https://github.com/mikimek23/Typing_speed_test.git
cd Typing_speed_test
```

### 2. Set Up the Backend

```bash
cd backend
npm install

# Configure your environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT secrets

# Run database migrations
npm run prisma:generate
npm run prisma:migrate

# Start backend development server (Port 5001)
npm run dev
```

### 3. Set Up the Frontend

```bash
# In a new terminal window:
cd frontend
npm install

# Start Vite dev server (Port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## ⌨️ Hotkeys & Shortcuts

| Key                                | Action                                                               |
| :--------------------------------- | :------------------------------------------------------------------- |
| <kbd>Esc</kbd> or <kbd>Tab</kbd>   | Instantly restart test session                                       |
| <kbd>Audio Button</kbd> _(Navbar)_ | Cycle through Mechanical, Thock, Typewriter, and Mute sound profiles |
| <kbd>Guide</kbd> _(Navbar)_        | View touch typing fundamentals, posture tips, and hotkeys            |
| <kbd>Mono Button</kbd> _(Test)_    | Toggle between JetBrains Mono and Proportional font                  |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
