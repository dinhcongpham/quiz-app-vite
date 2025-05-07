import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

interface HeaderProps {
  user: unknown;
  gamePin: string;
  setGamePin: (pin: string) => void;
  onJoinGame: (pin: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, gamePin, setGamePin, onJoinGame }) => {
  const { logout } = useAuth();
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinClick = () => {
    if (!gamePin.trim()) {
      toast.error('Please enter a room code');
      return;
    }
    setIsJoining(true);
      onJoinGame(gamePin);
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600">
                QUIZ.com
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Game PIN Input */}
            <div className="relative">
                <input
                  type="text"
                  value={gamePin}
                  onChange={(e) => setGamePin(e.target.value)}
                placeholder="Enter game PIN"
                className="pl-4 pr-10 py-2 border-2 border-gray-200 rounded-full focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                maxLength={6}
              />
              <button
                onClick={handleJoinClick}
                disabled={isJoining}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
              >
                {isJoining ? (
                  <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
                )}
          </button>
            </div>
          
          {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/my-quizzes"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Quizzes
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
            <button
                  onClick={logout}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
                  Logout
            </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
            <Link
              to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
                  Register
            </Link>
              </div>
          )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;