import axios from 'axios';
import { 
  RegisterDto, 
  LoginDto, 
  AuthResponseDto, 
  RefreshTokenDto, 
  ForgotPasswordDto, 
  ResetPasswordDto,
  User
} from '../types';
import { createHeaders } from './api.helper';
import { API_BASE_URL } from '../constants/config';

export const authService = {
  register: async (data: RegisterDto): Promise<AuthResponseDto> => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponseDto> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
    return response.data;
  },

  refreshToken: async (data: RefreshTokenDto): Promise<AuthResponseDto> => {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordDto): Promise<void> => {
    await axios.post(`${API_BASE_URL}/auth/forgot-password`, data);
  },

  resetPassword: async (data: ResetPasswordDto): Promise<void> => {
    await axios.post(`${API_BASE_URL}/auth/reset-password`, data);
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: createHeaders()
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}; 