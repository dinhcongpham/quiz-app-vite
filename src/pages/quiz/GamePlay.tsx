import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useGameRoom } from '../../context/GameRoomContext';
import { useLeaderboard } from '../../context/LeaderboardContext';
import { useTimer } from '../../context/TimerContext';
import { GameRoomDto, GameStateDto, LeaderboardSnapshotDto, UserAnswersDto } from '../../types/game.types';
import { useConnection } from '../../context/ConnectionContext';
import { motion, AnimatePresence } from 'framer-motion';

const GamePlay: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const { user } = useAuth();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswersDto | null>(null);
  const { room, setRoom, gameState, setGameState } = useGameRoom();
  const { leaderboard, setLeaderboard } = useLeaderboard();
  const { connection } = useConnection();
  const { timeLeft, setTimeLeft, startTimeRef, resetTimer, calculateRemainingTime } = useTimer();
  const { state } = useLocation();
  const { room: nav_room, gameState: nav_gameState, leaderboard: nav_leaderboard, timeLeft: nav_timeLeft } = state || {};
  
  // Initialize default leaderboard when room changes
  useEffect(() => {
    if (nav_room && nav_gameState && nav_leaderboard) {
      setRoom(nav_room);
      setGameState(nav_gameState);
      setLeaderboard(nav_leaderboard);
      setTimeLeft(nav_timeLeft); // nếu cần
    }
  }, [nav_room, nav_gameState, nav_leaderboard, nav_timeLeft, setRoom, setGameState, setLeaderboard, setTimeLeft]);
  useEffect(() => {
    if (room) {
      const defaultLeaderboard = {
        roomId: room.quizId,
        entries: room.participants.map(participant => ({
          roomId: room.quizId,
          quizId: room.quizId,
          userId: participant.userId,
          score: 0
        }))
      };
      setLeaderboard(defaultLeaderboard);
    }
  }, [room, setLeaderboard]);

  useEffect(() => {
    if (connection) {
      // Listen for game state updates
      connection.on('GameStateUpdated', (newGameState: GameStateDto) => {
        setGameState(newGameState);
        setSelectedAnswer(null);
        resetTimer();
        setHasSubmitted(false);
      });

      // Listen for user joined when game is in progress
      connection.on('NotifyUserJoined', (roomInfo: GameRoomDto, newLeaderboard: LeaderboardSnapshotDto) => {
        setRoom(roomInfo);
        setLeaderboard(newLeaderboard);
        console.log('User joined:', newLeaderboard);
      });

      // Listen for question ended and leaderboard update
      connection.on('QuestionEnded', (newLeaderboard: LeaderboardSnapshotDto) => {
        setLeaderboard(newLeaderboard);
        setTimeLeft(0);
      });

      // Listen for game ended
      connection.on('GameEnded', (userAnswers: UserAnswersDto) => {
        toast.success('Game ended!');
        console.log(userAnswers);
        setUserAnswers(userAnswers);
      });

      return () => {
        connection.off('GameStateUpdated');
        connection.off('QuestionEnded');
        connection.off('GameEnded');
      };
    }
  }, [connection, setGameState, setLeaderboard, resetTimer, setTimeLeft]);
  
  // Timer effect
  useEffect(() => {
    if (!gameState || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, setTimeLeft]);

  // Reset selectedAnswer khi vào câu hỏi mới
  useEffect(() => {
    setSelectedAnswer(null);
  }, [gameState]);

  // Chỉ set lại timer khi user join giữa chừng (InProgress)
  useEffect(() => {
    const joinedInProgress = sessionStorage.getItem('joinedInProgress') === 'true';
    if (room && gameState && joinedInProgress && startTimeRef.current === null) {
      const remainingTime = calculateRemainingTime(room.startedAt, gameState.currentQuestionIndex);
      setTimeLeft(remainingTime);
      startTimeRef.current = performance.now();
      sessionStorage.removeItem('joinedInProgress');
    }
  }, [room, gameState, calculateRemainingTime, setTimeLeft, startTimeRef]);

  const handleAnswerSelect = (answer: string) => {
    if (!hasSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!connection || !roomCode || !user?.id || !gameState || !room || !selectedAnswer) return;

    try {
      const elapsedTimeMs = performance.now() - (startTimeRef.current || 0);
      const preciseTimeMs = Math.min(15000, elapsedTimeMs);
      const preciseTime = Number(preciseTimeMs.toFixed(3));
      await connection.invoke('SubmitAnswer',
        roomCode,
        user.id,
        room.questions[gameState.currentQuestionIndex].questionId,
        selectedAnswer,
        preciseTime
      );
      console.log('SubmitAnswer',
        roomCode,
        user.id,
        room.questions[gameState.currentQuestionIndex].questionId,
        selectedAnswer,
        preciseTime
      );
      setHasSubmitted(true);
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer');
    }
  };

  const getUserRankAndScore = () => {
    if (!leaderboard || !user) return { rank: '-', score: 0 };
    const sorted = [...leaderboard.entries].sort((a, b) => b.score - a.score);
    const userIndex = sorted.findIndex(e => e.userId === user.id);
    const userScore = sorted[userIndex]?.score ?? 0;
    return { rank: userIndex >= 0 ? `${userIndex + 1} / ${sorted.length}` : '-', score: userScore };
  };

  const getUserSpecificAnswers = () => {
    if (!userAnswers || !user) return [];
    return userAnswers.userAnswers.filter(ans => ans.userId === user.id);
  };

  const getAccuracy = () => {
    if (!userAnswers || !room || !user) return 0;
    const userSpecific = getUserSpecificAnswers();
    const correct = userSpecific.filter(ans => ans.isCorrect).length;
    return Math.round((correct / room.questions.length) * 100);
  };

  if (!room || !gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const currentQuestion = room.questions[gameState.currentQuestionIndex];
  const isTimeUp = timeLeft <= 0;
  const isCorrect = selectedAnswer === currentQuestion.correctOption;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col md:flex-row">
      {/* Leaderboard Sidebar */}
      {leaderboard && (
        <div className="w-full md:w-1/3 lg:w-1/4 bg-white rounded-r-lg shadow-md p-6 md:sticky md:top-0 md:h-screen flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Leaderboard</h3>
          <div className="bg-gray-50 rounded-lg p-4 flex-1 overflow-y-auto">
            <div className="space-y-2">
              <AnimatePresence>
                {leaderboard.entries.map((entry, index) => (
                  <motion.div
                    key={entry.userId}
                    layout
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`flex items-center justify-between p-3 rounded ${
                      entry.userId === user?.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{index + 1}</span>
                      </div>
                      <span className="font-medium">
                        {room?.participants.find(p => p.userId === entry.userId)?.userName || 'Unknown'}
                      </span>
                    </div>
                    <span className="font-semibold text-blue-600">{entry.score}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Main Quiz Content */}
      <div className="flex-1 max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Only show question UI if not showing result */}
          {!userAnswers && (
            <>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Question {gameState.currentQuestionIndex + 1} of {gameState.totalQuestions}
                </h2>
                <div className="text-lg font-medium">
                  Time: {timeLeft}s
                </div>
              </div>

              <div className="mb-6">
                <p className="text-lg">{currentQuestion.content}</p>
              </div>

              <div className="space-y-4">
                {['A', 'B', 'C', 'D'].map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrectOption = option === currentQuestion.correctOption;
                  const showResult = isTimeUp || hasSubmitted;
                  // Always have a border for smoothness
                  let buttonClass = 'w-full p-4 text-left rounded-lg transition-all cursor-pointer border-2';
                  if (showResult) {
                    if (isCorrectOption) {
                      buttonClass += ' bg-green-100 border-green-500 text-green-800';
                    } else if (isSelected && !isCorrectOption) {
                      buttonClass += ' bg-red-100 border-red-500 text-red-800';
                    } else {
                      buttonClass += ' bg-gray-50 border-gray-200 text-gray-500';
                    }
                  } else {
                    buttonClass += isSelected 
                      ? ' bg-blue-500 border-blue-500 text-white' 
                      : ' bg-gray-50 border-gray-200 hover:bg-gray-100';
                  }
                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={hasSubmitted || isTimeUp}
                      className={buttonClass}
                    >
                      <span className="font-medium mr-2">{option}.</span>
                      {currentQuestion[`option${option}` as keyof typeof currentQuestion]}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleAnswerSubmit}
                  disabled={selectedAnswer === null || hasSubmitted || isTimeUp}
                  className={`px-6 py-2 rounded-lg font-medium transition-all
                    ${selectedAnswer === null || hasSubmitted || isTimeUp
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }
                  `}
                >
                  Submit Answer
                </button>
              </div>

              {hasSubmitted && (
                <div className="mt-4 text-center">
                  <p className={`text-lg font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect!'}
                  </p>
                  <p className="text-gray-600 mt-2">
                    The correct answer is: {currentQuestion.correctOption}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Result UI remains unchanged, always below */}
          {userAnswers && (
            <>
              {/* Result Summary */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col md:flex-row justify-between mb-4">
                    <div className="flex flex-col items-center bg-black/80 rounded-lg p-4 m-2 min-w-[120px]">
                      <span className="text-gray-300 text-sm mb-1">Accuracy</span>
                      <div className="w-full bg-[#2d1836] rounded-full h-4 flex items-center relative">
                        <div className="bg-green-500 h-4 rounded-full" style={{ width: `${getAccuracy()}%` }}></div>
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">{getAccuracy()}%</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center bg-black/80 rounded-lg p-4 m-2 min-w-[120px]">
                      <span className="text-gray-300 text-sm mb-1">Rank</span>
                      <span className="text-white text-lg font-bold flex items-center gap-1"> {getUserRankAndScore().rank}</span>
                    </div>
                    <div className="flex flex-col items-center bg-black/80 rounded-lg p-4 m-2 min-w-[120px]">
                      <span className="text-gray-300 text-sm mb-1">Score</span>
                      <span className="text-white text-lg font-bold flex items-center gap-1"> {getUserRankAndScore().score}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Review Questions */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Review Questions</h3>
                <div className="space-y-4">
                  {room.questions.map((q, idx) => {
                    const userAns = getUserSpecificAnswers().find(a => a.questionId === q.questionId);
                    const isCorrect = userAns?.isCorrect;
                    return (
                      <div key={q.questionId} className={`border-l-4 rounded-lg p-4 bg-gray-50 ${isCorrect === undefined ? '' : isCorrect ? 'border-green-500' : 'border-red-500'}`}> 
                        <div className="flex items-center mb-2">
                          <span className="font-bold mr-2">{idx + 1}.</span>
                          <span className="text-base font-medium">{q.content}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          {['A', 'B', 'C', 'D'].map(opt => {
                            const optText = q[`option${opt}` as keyof typeof q];
                            const isUser = userAns?.selectedOption === opt;
                            const isRight = q.correctOption === opt;
                            // Always have border for smoothness
                            return (
                              <div key={opt} className={`flex items-center p-2 rounded border-2 transition-all
                                ${isRight ? 'border-green-500 bg-green-50' : isUser && !isRight ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}
                              `}>
                                <span className="font-bold mr-2">{opt}.</span>
                                <span>{optText}</span>
                                {isUser && (
                                  <span className={`ml-2 text-xs font-semibold ${isRight ? 'text-green-600' : 'text-red-600'}`}>{isRight ? 'Your answer (Correct)' : 'Your answer'}</span>
                                )}
                                {isRight && !isUser && (
                                  <span className="ml-2 text-xs text-green-600 font-semibold">Correct</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {isCorrect === false && (
                          <div className="mt-2 text-sm text-red-600 font-semibold">Incorrect</div>
                        )}
                        {isCorrect === true && (
                          <div className="mt-2 text-sm text-green-600 font-semibold">Correct</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePlay;