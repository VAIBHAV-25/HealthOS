# HealthOS – B2B Healthcare SaaS UI

HealthOS is a modern, responsive, and fully functional B2B Healthcare SaaS frontend application built as an assignment demonstration. It provides a comprehensive platform for patient management, clinical analytics, and hospital administration with a premium user interface and seamless user experience.

## ✨ Features

- **🔐 Secure Authentication**: Integrated with Firebase Authentication (Email/Password) supporting full user isolation.
- **☁️ Cloud Firestore Sync**: Patient registrations are dynamically saved and synchronized in real-time to Google Cloud Firestore, with an offline-first persistence layer powered by Zustand. 
- **📊 Dynamic Analytics Dashboard**: Interactive charts (Area, Bar, Donut) built with `recharts`. All dashboard KPIs and charts calculate *live* based on the patients currently active in the database.
- **🧑‍⚕️ Patient Management**:
  - Add patients via an intuitive slide-over modal.
  - Seamlessly toggle between **Grid** and **List** views.
  - Advanced client-side search filtering by condition, name, doctor, and ward.
- **🔔 Notifications System**: In-app notification bell with real-time alerts. Service Worker integrated for browser-level push notifications.
- **🎨 Premium UI/UX**: Built with custom Vanilla CSS leveraging dynamic CSS variables for standard design tokens. Features glassmorphism, smooth micro-animations, and full mobile responsiveness.

## 🛠 Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript (Strict Mode)
- **State Management**: Zustand (including `zustand/middleware` for local persistence)
- **Routing**: React Router v6
- **Database / Auth**: Firebase SDK v10 (Auth, Firestore)
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (No UI libraries used)

## 🚀 Getting Started

To run this project locally, follow these steps:

### 1. Clone & Install
```bash
git clone <repository-url>
cd healthos
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```
*(Note: Ensure your Cloud Firestore API is enabled in your Google Cloud Console before running).*

### 4. Deploying to Vercel
When deploying this project to Vercel (or any other hosting provider), ensure that **all 7 Firebase environment variables** listed above are added to your project's Environment Variables settings in the Vercel dashboard. Since `.env` is securely ignored by Git, the build will fail or the app will not work if these are not provided to the deployment server!

### 3. Run Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## 📁 Project Architecture

```
src/
├── components/        # Reusable UI components (Layouts, Modals, Cards)
├── pages/             # Route-level components (Dashboard, Analytics, Patients)
├── store/             # Zustand stores (authStore, patientStore, uiStore)
├── types/             # Global TypeScript interfaces
├── firebase/          # Firebase initialization & config
├── data/              # Mock data seeds (used exclusively for demo mode)
└── hooks/             # Custom React Hooks
```

## 🧪 Demo Mode

When reviewing the application, use the built-in demo credentials to immediately see the fully populated database without having to configure a Firebase backend:
- **Email**: `demo@healthos.com`
- **Password**: `password123`

---
*Built with ❤️ for the Frontend Developer Assignment.*
