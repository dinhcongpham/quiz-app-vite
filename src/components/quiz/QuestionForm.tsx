import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreateQuestionDto } from '../../types';
import { questionService } from '../../services';

const QuestionForm: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<CreateQuestionDto>({
    questionId: 0,
    quizId: parseInt(quizId || '0'),
    content: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'A',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (error || success) {
      timeoutId = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 2000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [error, success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await questionService.createQuestion(question);
      setQuestion({
        questionId: 0,
        quizId: parseInt(quizId || '0'),
        content: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: 'A',
      });
      setSuccess('Question added successfully!');
      setError(null);
    } catch {
      setError('Failed to add question. Please try again.');
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Add Question</h1>
                <p className="mt-2 text-gray-600">Create a new question for your quiz</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Question Content
                </label>
                <textarea
                  id="content"
                  value={question.content}
                  onChange={(e) => setQuestion({ ...question, content: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your question here"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="optionA" className="block text-sm font-medium text-gray-700">
                    Option A
                  </label>
                  <input
                    type="text"
                    id="optionA"
                    value={question.optionA}
                    onChange={(e) => setQuestion({ ...question, optionA: e.target.value })}
                    className="mt-1 block w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm hover:border-indigo-300 transition-colors duration-200"
                    placeholder="Enter option A"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="optionB" className="block text-sm font-medium text-gray-700">
                    Option B
                  </label>
                  <input
                    type="text"
                    id="optionB"
                    value={question.optionB}
                    onChange={(e) => setQuestion({ ...question, optionB: e.target.value })}
                    className="mt-1 block w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm hover:border-indigo-300 transition-colors duration-200"
                    placeholder="Enter option B"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="optionC" className="block text-sm font-medium text-gray-700">
                    Option C
                  </label>
                  <input
                    type="text"
                    id="optionC"
                    value={question.optionC}
                    onChange={(e) => setQuestion({ ...question, optionC: e.target.value })}
                    className="mt-1 block w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm hover:border-indigo-300 transition-colors duration-200"
                    placeholder="Enter option C"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="optionD" className="block text-sm font-medium text-gray-700">
                    Option D
                  </label>
                  <input
                    type="text"
                    id="optionD"
                    value={question.optionD}
                    onChange={(e) => setQuestion({ ...question, optionD: e.target.value })}
                    className="mt-1 block w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm hover:border-indigo-300 transition-colors duration-200"
                    placeholder="Enter option D"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="correctOption" className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setQuestion({ ...question, correctOption: option as 'A' | 'B' | 'C' | 'D' })}
                      className={`flex items-center justify-center px-4 py-3 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        question.correctOption === option
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300'
                      }`}
                    >
                      Option {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/my-quizzes')}
                  className="inline-flex items-center px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Finish
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border-2 border-indigo-600 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 transition-all duration-200"
                >
                  Add Question
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionForm; 