import axios from 'axios';
import { CreateRoomDto } from '../types';
import { createHeaders } from './api.helper';
import { API_BASE_URL } from '../constants/config';
import { GameRoomDto } from '../types/game.types';

export const roomService = {
  createRoom: async (data: CreateRoomDto): Promise<GameRoomDto> => {
    const response = await axios.post(`${API_BASE_URL}/game/rooms/`, data, {
      headers: createHeaders()
    });
    return response.data;
  },

  getRoom: async (roomCode: string): Promise<GameRoomDto> => {
    const response = await axios.get(`${API_BASE_URL}/game/rooms/${roomCode}`, {
      headers: createHeaders()
    });
    return response.data;
  },
}; 