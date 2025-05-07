import axios from 'axios';
import { CreateQuizDto, QuizResponseDto } from '../types';
import { createHeaders } from './api.helper';
import { API_BASE_URL } from '../constants/config';

export const quizService = {
  getQuizzes: async (userId: number): Promise<QuizResponseDto[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz/users/${userId}`, {
        headers: createHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  },

  getQuiz: async (quizId: number): Promise<QuizResponseDto> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz/${quizId}`, {
        headers: createHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  },

  createQuiz: async (data: CreateQuizDto): Promise<QuizResponseDto> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/quiz/`, data, {
        headers: createHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },

  updateQuiz: async (quizId: number, data: CreateQuizDto): Promise<QuizResponseDto> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/quiz/${quizId}`, data, {
        headers: createHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  },

  deleteQuiz: async (quizId: number): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/quiz/${quizId}`, {
        headers: createHeaders()
      });
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  },
}; 