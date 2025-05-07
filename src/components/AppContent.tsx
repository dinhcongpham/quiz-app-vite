import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConnection } from '../context/ConnectionContext';
import { useGameRoom, GameRoomProvider } from '../context/GameRoomContext';
import { LeaderboardProvider } from '../context/LeaderboardContext';
import { useTimer } from '../context/TimerContext';
import Header from './Header';
import Home from '../pages/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';
import CreateQuizForm from '../components/quiz/CreateQuizForm';
import QuestionForm from '../components/quiz/QuestionForm';
import MyQuizzes from '../pages/MyQuizzes';
import Profile from '../pages/Profile/Profile';
import QuizView from '../pages/quiz/QuizView/QuizView';
import Settings from '../pages/Profile/Settings';
import WaitingRoom from '../pages/quiz/WaitingRoom';
import GamePlay from '../pages/quiz/GamePlay';
import { toast } from 'react-hot-toast';
import { GameRoomDto, GameStateDto, LeaderboardSnapshotDto } from '../types/game.types';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const GameLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {children}
    </div>
  );
};

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [gamePin, setGamePin] = useState('');
  const navigate = useNavigate();
  const { connection } = useConnection();
  const { setRoom } = useGameRoom();
  const { setTimeLeft } = useTimer();

  const handleJoinGame = async (pin: string) => {
    if (!pin.trim()) {
      toast.error('Please enter a room code');
      return;
    }

    try {
      if (!connection) {
        toast.error('Not connected to game server');
        return;
      }

      // Set up event listeners before joining
      connection.on('UserJoined', (roomInfo: GameRoomDto) => {
        setRoom(roomInfo);
        sessionStorage.removeItem('joinedInProgress');
        navigate(`/waiting-room/${pin}`);
      });

      connection.on('UserJoinedWhenGameProgress', (room: GameRoomDto, gameState: GameStateDto, leaderboard: LeaderboardSnapshotDto) => {   
        // Tính toán thời gian còn lại cho câu hỏi hiện tại
        const questionDuration = 15; // 15 giây mỗi câu hỏi
        const elapsedTime = Math.floor((Date.now() - new Date(room.startedAt).getTime()) / 1000);
        const timeLeft = questionDuration - (elapsedTime % questionDuration);
        setTimeLeft(timeLeft);
        navigate(`/play/${pin}`, {
          state: {
            room: room,
            gameState: gameState,
            leaderboard: leaderboard,
            timeLeft: timeLeft,
          },
        });
      });

      // Join room - server will handle the status check and send appropriate event
      await connection.invoke('JoinRoom', pin, user?.id);
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error('Failed to join room');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        gamePin={gamePin} 
        setGamePin={setGamePin} 
        onJoinGame={handleJoinGame}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/my-quizzes"
          element={
            <ProtectedRoute>
              <MyQuizzes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-quiz"
          element={
            <ProtectedRoute>
              <CreateQuizForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:quizId/questions"
          element={
            <ProtectedRoute>
              <QuestionForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:quizId"
          element={
            <ProtectedRoute>
              <QuizView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<MainLayout />} />
        
        {/* Game routes without header */}
        <Route path="/waiting-room/:roomCode" element={
          <ProtectedRoute>
            <GameRoomProvider>
              <LeaderboardProvider>
                <GameLayout>
                  <WaitingRoom />
                </GameLayout>
              </LeaderboardProvider>
            </GameRoomProvider>
          </ProtectedRoute>
        } />
        <Route path="/play/:roomCode" element={
          <ProtectedRoute>
            <GameRoomProvider>
              <LeaderboardProvider>
                <GameLayout>
                  <GamePlay />
                </GameLayout>
              </LeaderboardProvider>
            </GameRoomProvider>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default AppContent;