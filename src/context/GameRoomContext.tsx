import React, { createContext, useContext, useState } from 'react';
import { GameRoomDto, GameStateDto } from '../types/game.types';

interface GameRoomContextType {
  room: GameRoomDto | null;
  setRoom: React.Dispatch<React.SetStateAction<GameRoomDto | null>>;
  gameState: GameStateDto | null;
  setGameState: React.Dispatch<React.SetStateAction<GameStateDto | null>>;
}

const GameRoomContext = createContext<GameRoomContextType | undefined>(undefined);

export const useGameRoom = () => {
  const context = useContext(GameRoomContext);
  if (!context) {
    throw new Error('useGameRoom must be used within a GameRoomProvider');
  }
  return context;
};

export const GameRoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [room, setRoom] = useState<GameRoomDto | null>(null);
  const [gameState, setGameState] = useState<GameStateDto | null>(null);

  return (
    <GameRoomContext.Provider value={{ room, setRoom, gameState, setGameState }}>
      {children}
    </GameRoomContext.Provider>
  );
}; 