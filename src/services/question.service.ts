import axios from 'axios';
import { QuestionResponseDto, CreateQuestionDto } from '../types';
import { createHeaders } from './api.helper';
import { API_BASE_URL } from '../constants/config';

export const questionService = {
  getAllQuestionsOfQuiz: async (quizId: number): Promise<QuestionResponseDto[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions/quiz/${quizId}`, {
        headers: createHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  getQuestionById: async (questionId: number): Promise<QuestionResponseDto> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions/${questionId}`, {
        headers: createHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching question:', error);
      throw error;
    }
  },

  createQuestion: async (data: CreateQuestionDto): Promise<QuestionResponseDto> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/questions`, data, {
        headers: createHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  updateQuestion: async (questionId: number, data: CreateQuestionDto): Promise<QuestionResponseDto> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/questions/${questionId}`, data, {
        headers: createHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },

  deleteQuestion: async (questionId: number): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/questions/${questionId}`, {
        headers: createHeaders()
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }
}; 