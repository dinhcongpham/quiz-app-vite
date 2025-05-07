import React, { createContext, useContext, useState, useRef } from 'react';

interface TimerContextType {
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  startTimeRef: React.MutableRefObject<number | null>;
  resetTimer: () => void;
  calculateRemainingTime: (startedAt: Date, currentQuestionIndex: number) => number;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const startTimeRef = useRef<number | null>(null);

  const resetTimer = () => {
    setTimeLeft(15);
    startTimeRef.current = performance.now();
  };

  const calculateRemainingTime = (startedAt: Date, currentQuestionIndex: number) => {
    const now = new Date();
    const startTime = new Date(startedAt);
    const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const questionStartTime = currentQuestionIndex * 15; // Each question is 15 seconds
    const remainingTime = 15 - (elapsedSeconds - questionStartTime);
    return Math.max(0, Math.min(15, remainingTime)); // Ensure time is between 0 and 15
  };

  return (
    <TimerContext.Provider value={{ timeLeft, setTimeLeft, startTimeRef, resetTimer, calculateRemainingTime }}>
      {children}
    </TimerContext.Provider>
  );
}; 