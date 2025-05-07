import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppContent from './components/AppContent';
import { GameRoomProvider } from './context/GameRoomContext';
import { ConnectionProvider } from './context/ConnectionContext';
import { LeaderboardProvider } from './context/LeaderboardContext';
import { TimerProvider } from './context/TimerContext';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pr-[calc(100vw-100%)]">
      <AuthProvider>
        <ConnectionProvider>
          <GameRoomProvider>
            <LeaderboardProvider>
              <TimerProvider>
                <AppContent />
                <Toaster position="top-right" />
              </TimerProvider>
            </LeaderboardProvider>
          </GameRoomProvider>
        </ConnectionProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
