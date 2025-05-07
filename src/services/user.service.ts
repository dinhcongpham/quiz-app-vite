import axios from 'axios';
import { ChangeUserNameDto, ChangeUserPasswordDto } from '../types';
import { createHeaders } from './api.helper';
import { API_BASE_URL } from '../constants/config';

export const userService = {
  changeUserName: async (data: ChangeUserNameDto): Promise<void> => {
    await axios.post(`${API_BASE_URL}/auth/update-username`, data, {
      headers: createHeaders()
    });
  },

  changeUserPassword: async (data: ChangeUserPasswordDto): Promise<void> => {
    await axios.post(`${API_BASE_URL}/auth/update-password`, data, {
      headers: createHeaders()
    });
  },
}; 