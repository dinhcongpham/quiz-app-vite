import axios from 'axios';
import { QuizStatsDto, UserStatsDto } from '../types';
import { createHeaders } from './api.helper';
import { API_BASE_URL } from '../constants/config';

export const dashboardService = {
  getUserStats: async (userId: number): Promise<UserStatsDto> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/stats/${userId}`, {
        headers: createHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  },
  getQuizStats: async (userId: number): Promise<QuizStatsDto> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/stats/quizzes/${userId}`, {
        headers: createHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  }
};
