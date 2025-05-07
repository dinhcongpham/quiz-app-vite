import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { questionService, quizService } from '../../../services/';
import type { QuestionResponseDto, QuizResponseDto, CreateQuestionDto } from '../../../types/index';

const QuizView: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<QuizResponseDto | null>(null);
  const [questions, setQuestions] = useState<QuestionResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<QuestionResponseDto | null>(null);

  useEffect(() => {
    const fetchQuizAndQuestions = async () => {
      if (!quizId) return;

      try {
        const quizData = await quizService.getQuiz(Number(quizId));
        setQuiz(quizData);

        const questionsData = await questionService.getAllQuestionsOfQuiz(Number(quizId));
        setQuestions(questionsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching quiz data:', err);
        setError('Failed to load quiz data');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAndQuestions();
  }, [quizId]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (success) {
      timeoutId = setTimeout(() => {
        setSuccess(null);
      }, 2000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [success]);

  const handleEditQuestion = (question: QuestionResponseDto) => {
    setEditingQuestionId(question.questionId);
    setEditedQuestion({...question});
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setEditedQuestion(null);
  };

  const handleUpdateQuestion = async (question: QuestionResponseDto) => {
    if (!editedQuestion) return;
    
    try {
      const questionToUpdate: CreateQuestionDto = {
        ...editedQuestion,
        correctOption: editedQuestion.correctOption as "A" | "B" | "C" | "D"
      };
      await questionService.updateQuestion(question.questionId, questionToUpdate);
      setQuestions(questions.map(q => 
        q.questionId === question.questionId ? editedQuestion : q
      ));
      setEditingQuestionId(null);
      setEditedQuestion(null);
      setSuccess('Question updated successfully!');
    } catch {
      setError('Failed to update question');
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await questionService.deleteQuestion(questionId);
      setQuestions(questions.filter(q => q.questionId !== questionId));
      setSuccess('Question deleted successfully!');
    } catch {
      setError('Failed to delete question');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-500 mb-4">{error}</div>
          <Link to="/my-quizzes" className="text-indigo-600 hover:text-indigo-500">
            Back to My Quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {/* Quiz Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{quiz?.title}</h1>
          <Link
            to="/my-quizzes"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to My Quizzes
          </Link>
        </div>
        <p className="mt-2 text-gray-600">{quiz?.description}</p>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">No questions available</h3>
          <p className="mt-2 text-sm text-gray-500">This quiz doesn't have any questions yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question, index) => {
            const isEditing = editingQuestionId === question.questionId;
            const currentQuestion = isEditing ? editedQuestion : question;
            if (!currentQuestion) return null;

            return (
              <div key={question.questionId} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Question {index + 1}
                    </h3>
                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleUpdateQuestion(question)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Change
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditQuestion(question)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question.questionId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentQuestion.content}
                      onChange={(e) => setEditedQuestion({...editedQuestion!, content: e.target.value})}
                      className="w-full p-2 mb-4 border rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="mt-2 mb-4 text-gray-600">{currentQuestion.content}</p>
                  )}
                  
                  {/* Options */}
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((option) => {
                      const optionKey = `option${option}` as keyof QuestionResponseDto;
                      const isCorrect = currentQuestion.correctOption === option;
                      
                      return (
                        <div key={option} className={`p-3 rounded-md ${
                          isCorrect ? 'bg-green-50' : 'bg-gray-50'
                        } flex items-center justify-between`}>
                          <div className="flex-grow">
                            {isEditing ? (
                              <input
                                type="text"
                                value={currentQuestion[optionKey] as string}
                                onChange={(e) => setEditedQuestion({
                                  ...editedQuestion!,
                                  [optionKey]: e.target.value
                                })}
                                className="w-full bg-transparent border-0 focus:ring-0"
                              />
                            ) : (
                              <span className={isCorrect ? 'text-green-700' : 'text-gray-700'}>
                                {option}. {currentQuestion[optionKey]}
                              </span>
                            )}
                          </div>
                          {isEditing && (
                            <input
                              type="radio"
                              name="correctOption"
                              value={option}
                              checked={currentQuestion.correctOption === option}
                              onChange={(e) => setEditedQuestion({
                                ...editedQuestion!,
                                correctOption: e.target.value
                              })}
                              className="ml-2"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuizView; 