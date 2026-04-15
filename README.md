# DocTalk – Doctor Appointment Booking System

🌐 Live Website: https://doctalk-compilecrew.vercel.app

## Overview
DocTalk is a doctor appointment booking platform where patients can browse doctors, view their profiles, and book appointments. Doctors can manage appointments from their dashboard.

## Features
- Patient login
- Doctor profile pages
- Book appointments
- Doctor dashboard
- Accept / Reject appointments
- Toast notifications
- Responsive design
- Docker support
- Deployed on Vercel

## Tech Stack
- React (Vite)
- Tailwind CSS
- React Router
- LocalStorage
- Docker
- Vercel Deployment

## How to Run Locally
```bash
git clone https://github.com/KAvinash47/841716.git
cd 841716
npm install
npm run dev
docker build -t doctalk .
docker run -dit -p 50009:80 doctalk
