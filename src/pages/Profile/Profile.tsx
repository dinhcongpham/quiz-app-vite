import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboard.service';
import { UserStatsDto, QuizStatsDto, DetailQuizStatsDto } from '../../types/dashboard.types';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStatsDto | null>(null);
  const [quizResults, setQuizResults] = useState<QuizStatsDto | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<DetailQuizStatsDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.id) {
        try {
          const [userStats, quizStats] = await Promise.all([
            dashboardService.getUserStats(user.id),
            dashboardService.getQuizStats(user.id)
          ]);
          // Chuyển đổi nếu API trả về quizzes thay vì quiz
          const normalizedQuizStats = ((quizStats as unknown) as { quizzes?: DetailQuizStatsDto[] })?.quizzes ? { quiz: ((quizStats as unknown) as { quizzes: DetailQuizStatsDto[] }).quizzes } : quizStats;
          console.log(normalizedQuizStats);
          setStats(userStats);
          setQuizResults(normalizedQuizStats);
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      }
    };
    fetchStats();
  }, [user?.id]);

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const handleQuizClick = (quiz: DetailQuizStatsDto) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
  };

  // Hàm định dạng ngày giờ
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            {/* Profile Header */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-4xl text-indigo-600">
                  {user?.fullName?.charAt(0) || user?.email?.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.fullName}</h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/my-quizzes')}
                className="flex items-center justify-center space-x-2 p-4 rounded-xl bg-white border-2 border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
              >
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium text-gray-900">My Quizzes</span>
              </button>

              <button
                onClick={() => navigate('/settings')}
                className="flex items-center justify-center space-x-2 p-4 rounded-xl bg-white border-2 border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
              >
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-gray-900">Settings</span>
              </button>

              <button
                onClick={handleSignOut}
                className="flex items-center justify-center space-x-2 p-4 rounded-xl bg-white border-2 border-gray-100 hover:border-red-500 hover:bg-red-50 transition-all duration-200"
              >
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium text-gray-900">Sign out</span>
              </button>
            </nav>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-sm font-medium text-gray-500">Total Quizzes Created</div>
              <div className="mt-2 text-3xl font-semibold text-indigo-600">{stats?.totalQuizzesCreated || 0}</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-sm font-medium text-gray-500">Quizzes Participated</div>
              <div className="mt-2 text-3xl font-semibold text-indigo-600">{stats?.totalQuizzesParticipated || 0}</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-sm font-medium text-gray-500">Accuracy Rate</div>
              <div className="mt-2 text-3xl font-semibold text-indigo-600">{stats?.accuracyRate || 0}%</div>
            </div>
          </div>

          {/* Quiz Results Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizResults?.quiz.map((quiz, index) => (
                <div
                  key={index}
                  onClick={() => handleQuizClick(quiz)}
                  className="p-6 rounded-2xl border border-gray-200 shadow-md bg-gradient-to-br from-indigo-50 to-white hover:shadow-lg hover:border-indigo-400 cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center mb-2">
                    <span className="inline-block bg-indigo-100 text-indigo-600 rounded-full p-2 mr-3">
                      <FaCalendarAlt className="w-5 h-5" />
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      {formatDate(quiz.startedAt)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-indigo-700 group-hover:text-indigo-900 mb-1">{quiz.title}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{quiz.description}</p>
                  <span className="inline-block text-xs text-gray-400">Room ID: {quiz.roomId}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Details Modal */}
      {isModalOpen && selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-indigo-100 animate-fadeIn custom-scrollbar">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-3xl font-extrabold text-indigo-800 mb-1">{selectedQuiz.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FaCalendarAlt className="mr-2" />
                    {formatDate(selectedQuiz.startedAt)}
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-indigo-600 bg-indigo-50 rounded-full p-2 transition-all"
                  title="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-700 mb-6 italic">{selectedQuiz.description}</p>
              <div className="space-y-6">
                {selectedQuiz.userAnswers.map((answer, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 mb-2">
                    <p className="font-semibold text-gray-900 mb-2">Câu hỏi: {answer.content}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Câu trả lời của bạn:</p>
                        <span className={`inline-flex items-center font-medium px-2 py-1 rounded-lg ${answer.selectedOption === answer.correctOption ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {answer.selectedOption === answer.correctOption ? <FaCheckCircle className="mr-1" /> : <FaTimesCircle className="mr-1" />}
                          {answer.selectedOption}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Đáp án đúng:</p>
                        <span className="inline-flex items-center font-medium px-2 py-1 rounded-lg bg-green-50 text-green-700">
                          <FaCheckCircle className="mr-1" />
                          {answer.correctOption}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom scrollbar style cho popup */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e0e7ff;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6366f1;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #e0e7ff #fff;
        }
        .custom-scrollbar:hover {
          scrollbar-color: #6366f1 #fff;
        }
      `}</style>
    </div>
  );
};

export default Profile; 