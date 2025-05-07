# Quiz App - Vite

## Overview

The **Quiz App** is a web-based application built using **React** and **Vite**. It allows users to create, join, and play quizzes in real-time. The app supports multiplayer functionality, leaderboard tracking, and dynamic question timing, making it ideal for interactive learning or entertainment.

## Features

- **User Authentication**: Secure login and registration system.
- **Quiz Creation**: Users can create quizzes with custom questions and answers.
- **Real-Time Gameplay**: Players can join quizzes in progress and participate in real-time.
- **Leaderboard**: Tracks player scores and ranks them dynamically.
- **Timer for Questions**: Each question has a countdown timer to ensure fair play.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **Frontend**: React, Vite, TypeScript, TailwindCSS
- **Backend**: SignalR (for real-time communication)
- **State Management**: React Context API
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **Testing**: Jest (if applicable)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/quiz-app-vite.git
   cd quiz-app-vite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following environment variables:
   ```env
   VITE_API_URL=http://your-backend-api-url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the app in your browser:
   ```
   http://localhost:5173
   ```

6. To build the app for production:
   ```bash
   npm run build
   ```

7. To preview the production build:
   ```bash
   npm run preview
   ```