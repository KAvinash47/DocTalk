# DocTalk – AI-Powered Health & Doctor Appointment Platform

🌐 **Live Website:** [doctalk-compilecrew.vercel.app](https://doctalk-compilecrew.vercel.app)

## 🚀 Overview
**DocTalk** is a comprehensive health management platform that combines traditional doctor appointment booking with advanced AI-driven medical assistance. Built with a modern glassmorphism UI, it provides patients with a seamless experience for managing their health, consulting with AI, and booking professional medical services.

## ✨ Key Features
- **🤖 PulseTalk AI Assistant:** Interactive AI doctor powered by Gemini 2.0 & Mistral for instant medical advice and symptom analysis.
- **📅 Doctor Appointment Booking:** Browse specialized doctors, view profiles, and book appointments with real-time status tracking.
- **🛠️ Health Tools Suite:** 
  - BMI Calculator
  - Calorie Estimator
  - Health Score Generator
  - Heart Rate Checker
  - Water Intake Calculator
- **📊 Doctor Dashboard:** Dedicated interface for doctors to manage, accept, or reject patient appointments.
- **📁 Disease Encyclopedia:** Comprehensive database of diseases with detailed information and symptoms.
- **📱 Responsive & Interactive UI:** Built with Tailwind CSS and Framer Motion for a fluid, mobile-first experience.
- **🔔 Real-time Notifications:** Instant feedback via React-Toastify.

## 🛠️ Tech Stack
### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS + DaisyUI
- **Animations:** Framer Motion
- **Icons:** Lucide React & React Icons
- **Charts:** Recharts (for health metrics)
- **Routing:** React Router 7

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **AI Integration:** OpenRouter API (Gemini 2.0 Flash, Mistral 7B)
- **Environment:** Dotenv for secure configuration

### DevOps & Deployment
- **Containerization:** Docker
- **Hosting:** Vercel (Frontend), Node.js server (Backend)

## 🏗️ Project Structure
```text
DocTalk/
├── backend/            # Express server & AI integration
├── src/                # React frontend source
│   ├── Components/     # UI, Layout, and Feature components
│   ├── Pages/          # Application views/routes
│   ├── context/        # Auth and Theme management
│   └── hooks/          # Custom React hooks
├── public/             # Static assets and JSON data
└── Dockerfile          # Container configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- OpenRouter API Key (for AI features)

### Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KAvinash47/841716.git
   cd DocTalk-master
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   # Create a .env file and add:
   # OPENROUTER_API_KEY=your_api_key_here
   node server.js
   ```

3. **Setup Frontend:**
   ```bash
   # In a new terminal from the root directory
   npm install
   npm run dev
   ```

4. **Docker Support:**
   ```bash
   docker build -t doctalk .
   docker run -p 5173:5173 doctalk
   ```

## 📄 License
This project is licensed under the ISC License.

---
Developed by **Compile Crew** 🚀
