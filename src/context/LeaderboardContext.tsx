import React, { createContext, useContext, useState } from 'react';
import { LeaderboardSnapshotDto } from '../types/game.types';

interface LeaderboardContextType {
  leaderboard: LeaderboardSnapshotDto | null;
  setLeaderboard: React.Dispatch<React.SetStateAction<LeaderboardSnapshotDto | null>>;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
};

export const LeaderboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardSnapshotDto | null>(null);

  return (
    <LeaderboardContext.Provider value={{ leaderboard, setLeaderboard }}>
      {children}
    </LeaderboardContext.Provider>
  );
}; 