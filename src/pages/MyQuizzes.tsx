import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import EditQuizModal from '../components/common/EditQuizModal';
import { QuizResponseDto, CreateQuizDto } from '../types';
import { quizService } from '../services';

const MyQuizzes: React.FC = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizResponseDto | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

    const fetchQuizzes = async () => {
      try {
      if (!user?.id) {
        setError("Please log in to view your quizzes");
        setLoading(false);
        return;
      }
      const response = await quizService.getQuizzes(user.id);
        setQuizzes(response);
      setError(null);
      } catch (err) {
      console.error('Failed to fetch quizzes:', err);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchQuizzes();
  }, [user?.id]);

  const handleDelete = async (quiz: QuizResponseDto) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedQuiz) return;
    setIsDeleting(true);
    try {
      await quizService.deleteQuiz(selectedQuiz.quizId);
      setQuizzes(quizzes.filter(quiz => quiz.quizId !== selectedQuiz.quizId));
      setIsDeleteModalOpen(false);
      setError(null);
    } catch (err) {
      console.error('Failed to delete quiz:', err);
      setError('Failed to delete quiz. Please try again.');
    } finally {
      setIsDeleting(false);
      setSelectedQuiz(null);
    }
  };

  const handleEdit = (quiz: QuizResponseDto) => {
    setSelectedQuiz(quiz);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (title: string, description: string) => {
    if (!selectedQuiz || !user?.id) return;
    try {
      const updateData: CreateQuizDto = {
        title,
        description,
        ownerId: user.id,
      };
      
      await quizService.updateQuiz(selectedQuiz.quizId, updateData);
      
      setQuizzes(prevQuizzes => 
        prevQuizzes.map(quiz => 
          quiz.quizId === selectedQuiz.quizId 
            ? { ...quiz, title, description }
            : quiz
        )
      );
      
      setIsEditModalOpen(false);
      setSelectedQuiz(null);
      setError(null);
    } catch (err) {
      console.error('Failed to update quiz:', err);
      setError('Failed to update quiz. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col justify-center items-center h-64">
              <div className="text-red-500 mb-4">{error}</div>
              {!user && (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex justify-between items-center mb-8">
              <div>
        <h1 className="text-3xl font-bold text-gray-900">My Quizzes</h1>
                <p className="mt-2 text-gray-600">Manage your quiz collection</p>
              </div>
        <Link
          to="/create-quiz"
                className="inline-flex items-center space-x-2 px-6 py-3 border-2 border-indigo-600 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 transition-all duration-200"
        >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Create New Quiz</span>
        </Link>
      </div>

      {quizzes.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No quizzes yet</h3>
          <p className="mt-2 text-sm text-gray-500">
                  Get started by creating your first quiz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.quizId}
                    className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden hover:border-indigo-500 transition-all duration-200"
            >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{quiz.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(quiz)}
                            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(quiz)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="mt-6 flex flex-col space-y-3">
                  <Link
                    to={`/quiz/${quiz.quizId}/questions`}
                          className="flex items-center justify-center space-x-2 p-2 rounded-lg border-2 border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
                        >
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="font-medium text-gray-900">Add Questions</span>
                        </Link>
                        <Link
                          to={`/quiz/${quiz.quizId}`}
                          className="flex items-center justify-center space-x-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
                  >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="font-medium text-white">View Quiz</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedQuiz(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete this quiz?"
        message="This can't be undone!"
        isDeleting={isDeleting}
      />

      <EditQuizModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedQuiz(null);
        }}
        onSave={handleSaveEdit}
        initialTitle={selectedQuiz?.title || ''}
        initialDescription={selectedQuiz?.description || ''}
      />
    </div>
  );
};

export default MyQuizzes; 