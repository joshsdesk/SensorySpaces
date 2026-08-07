# SensorySpaces 🧩

SensorySpaces is a mobile-first application designed to help parents and guardians of children with Autism Spectrum Disorder (ASD) discover sensory-friendly events and locations. Our mission is to make the world more accessible by providing tools to find quiet, low-stimulus environments where children can thrive and regulate.

## 🚀 Vision & Key Features

- **Sensory-Centric Discovery**: Search for events based on specific ASD needs: Sensory Hours, Quiet Zones, Low Crowds, and more.
- **Micro-Environment Data**: Real-time weather and environmental forecasting integrated into event details to help plan for sensory needs (lighting, temperature, precipitation).
- **Premium UI/UX**: A modern, glassmorphic interface designed for ease of use and low cognitive load.
- **Automated Data Ingestion**: A robust backend pipeline that aggregates and normalizes data from multiple open sources (Data.gov, OpenWeb Ninja) to find hidden gem locations.

## 🛠 Tech Stack

### Frontend (Client)
- **Framework**: [Expo](https://expo.dev/) / [React Native](https://reactnative.dev/)
- **Navigation**: React Navigation (Stack & Tabs)
- **UI Components**: Custom standardized UI library (AppButton, AppCard, AppText)
- **State Management**: Redux Toolkit
- **Styling**: Native StyleSheet with glassmorphic effects (expo-blur)

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Services**: Automated Ingestion Service for data normalization
- **Security**: Helmet, CORS, and standard JSON Web Token (JWT) architecture (planned)

## 📦 Project Structure

```text
SensorySpaces/
├── client/          # Expo/React Native Mobile App
│   ├── src/
│   │   ├── components/ # Reusable UI components & Modals
│   │   ├── pages/      # Main application screens
│   │   ├── services/   # Frontend API services (Weather, Events)
│   │   └── navigation/ # Navigation configuration
├── server/          # Node.js/Express Backend
│   ├── src/
│   │   ├── models/     # Mongoose data schemas
│   │   ├── services/   # Ingestion and business logic
│   │   ├── routes/     # API endpoints
│   │   └── utils/      # Normalization and helper functions
└── README.md
```

## 🚥 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [MongoDB](https://www.mongodb.com/) (Running locally or on Atlas)

### Installation

1. Clone the repository and navigate to the root directory.
2. Install all dependencies for both client and server:
   ```bash
   npm run install:all
   ```
3. Set up your environment variables:
   - Create a `.env` file in the `server/` directory:
     ```env
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     ```

### Running Locally

To start both the client and server concurrently, run:
```bash
npm run dev
```

- **Backend**: http://localhost:5000
- **Frontend (Metro)**: http://localhost:8081

## 🗺 Roadmap

- [x] Phase 1: Directory Restructuring and UI Flow
- [/] Phase 2: Backend Data Ingestion & Normalization Layer
- [ ] Phase 3: Monetization & Ad Integration
- [ ] Phase 4: Community Features & Social Sharing

## 📄 License
This project is proprietary. Please contact the owner for use or contribution.
