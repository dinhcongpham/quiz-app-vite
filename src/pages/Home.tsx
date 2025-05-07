import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { QuizResponseDto } from '../types';
import { quizService } from '../services';
import useDebounce from '../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { GameRoomDto } from '../types/game.types';
import { useGameRoom } from '../context/GameRoomContext';
import { useConnection } from '../context/ConnectionContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizResponseDto[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<QuizResponseDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { connection, isConnected } = useConnection();
  const { setRoom } = useGameRoom();

  // Apply debounce to search term with 300ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (connection) {
      // Listen for room created event
      connection.on('RoomCreated', (room: GameRoomDto) => {
        toast.success('Room created successfully!');
        setRoom(room);
        navigate(`/waiting-room/${room.roomCode}`);
      });

      // Listen for error events
      connection.on('Error', (error: string) => {
        toast.error(error);
      });
    }
  }, [connection, navigate, setRoom]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        if (user?.id) {
          const response = await quizService.getQuizzes(user.id);
          setQuizzes(response);
          setFilteredQuizzes(response);
        }
        setError(null);
      } catch {
        setQuizzes([]);
        setFilteredQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [user?.id]);

  // Use debounced search term for filtering
  useEffect(() => {
    const filtered = quizzes.filter(quiz => 
      quiz.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    setFilteredQuizzes(filtered);
  }, [debouncedSearchTerm, quizzes]);

  const handlePlayNow = async (quizId: number) => {
    try {
      if (!user?.id) {
        toast.error('Please log in to create a room');
        return;
      }

      if (!isConnected || !connection) {
        toast.error('Not connected to game server');
        return;
      }
      await connection.invoke('CreateRoom', quizId, user.id);
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room. Please try again.');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      setSearchTerm('');
      setFilteredQuizzes(quizzes);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-red-500 mb-4">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-8 flex justify-end">
          <div className="relative">
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            
            {/* Search Input - Appears when search is active */}
            <div className={`absolute right-0 top-0 transition-all duration-200 ${
              isSearching 
                ? 'opacity-100 w-64 pointer-events-auto' 
                : 'opacity-0 w-0 pointer-events-none'
            }`}>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search quizzes..."
                className="w-full pl-4 pr-10 py-2 border-2 border-gray-200 rounded-full focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.quizId}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                <p className="text-gray-600 line-clamp-2">{quiz.description}</p>
                
                {/* Play Now button - visible on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handlePlayNow(quiz.quizId)}
                    className="px-6 py-3 bg-[#FDB347] text-white font-semibold rounded-full hover:bg-[#FDA347] transform hover:scale-105 transition-all duration-200"
                  >
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredQuizzes.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No quizzes found matching your search.' : 'No quizzes available.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home; 