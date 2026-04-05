# Petrol Subsidy Demo App (AI-Powered) – Project Summary

## 📌 Overview
This project is a **demo web application** that simulates Pakistan’s upcoming petrol subsidy system. It is designed to attract users, demonstrate modern AI-powered workflows, and showcase a real-world government-style solution.

⚠️ Note: This is a **concept/demo app**, not an official government product.

---

## 🎯 Objectives
- Simulate petrol subsidy eligibility and usage
- Demonstrate AI-powered features (chatbot, prediction, voice)
- Build a modern, scalable full-stack web app
- Create a viral-ready product for YouTube & portfolio

---

## 🧩 Core Features

### 1. User Onboarding
- Landing page with introduction
- “Check Eligibility” CTA

### 2. CNIC-Based Eligibility Check (Simulated)
- User enters CNIC
- AI + mock logic determines eligibility

### 3. AI Eligibility Prediction
- Input: salary, vehicle type, usage
- Output: eligibility result with explanation

### 4. AI Chatbot Assistant
- Answers questions like:
  - “Am I eligible?”
  - “How to use subsidy?”
- Provides conversational guidance

### 5. Voice Explanation (AI)
- Converts responses into voice
- Helps low-literacy users

### 6. Dashboard
- Monthly petrol quota (e.g., 20L)
- Remaining balance
- Usage analytics

### 7. QR Code Voucher System
- Generate QR code for petrol usage
- Simulated scan flow

### 8. Transaction History
- Logs petrol usage
- Shows date, liters, remaining quota

### 9. Charts & Analytics
- Visualize usage trends
- Predict future consumption

---

## 🏗️ Tech Stack

### Frontend
- Next.js (App Router)
- Tailwind CSS
- shadcn/ui

### Backend
- Next.js API Routes / Server Actions
- NeonDB (PostgreSQL)
- fastapi 

### AI Layer
- Grok API (LLM integration)
- Use Cases:
  - Eligibility prediction
  - Chatbot
  - Voice explanation (via TTS integration)

### Charts
- Recharts

### QR Code
- npm QR libraries (e.g., qrcode, react-qr-code)

### Deployment
- Vercel (Frontend )
-Huggingface (Backend)

---

## 🧠 System Architecture

User → Frontend (Next.js)
      → API Routes (Backend logic)
      → NeonDB (User data, logs)
      → AI Layer (Grok API)

---

## 🔄 App Flow

1. User visits landing page
2. Enters CNIC or basic details
3. Eligibility check (AI + mock rules)
4. If eligible:
   - Dashboard unlocked
   - Monthly quota assigned
5. User generates QR code
6. Simulated petrol usage transaction
7. Data stored & visualized in dashboard

---

## 📊 Database Design (NeonDB)

### Users Table
- id
- cnic
- name
- phone
- vehicle_type
- eligibility_status

### Transactions Table
- id
- user_id
- liters_used
- date

### Quota Table
- user_id
- total_quota
- remaining_quota

---

## 🤖 AI Features Breakdown

### 1. Eligibility Prediction
- Rule-based + AI explanation
- Input: salary, vehicle, usage
- Output: eligibility + reasoning

### 2. Chatbot
- Prompt-based responses
- Handles FAQs

### 3. Voice Assistant
- Text-to-Speech (TTS)
- Converts chatbot output to audio

---

## 🎨 UI/UX Design
- Clean dashboard layout
- Mobile-first design
- Accessible for low-tech users
- Urdu + simple English support (optional)

---

## 🚀 Deployment Plan

1. Build app locally
2. Connect NeonDB
3. Integrate Grok API
4. Deploy on Vercel
5. Test production build

---

## 📹 Content Strategy (YouTube)

### Video Structure
1. Problem: High petrol prices
2. Govt idea: subsidy app
3. Your solution: AI-powered demo
4. Live demo
5. Call to action

---

## 🔐 Disclaimer
- This app is for **educational/demo purposes only**
- Not affiliated with any government organization

---

## 🏁 Conclusion
This project combines:
- Real-world problem
- AI integration
- Modern web technologies

It is ideal for:
- Portfolio
- Hackathons
- YouTube growth

🔥 Strong potential to go viral if presented properly.

