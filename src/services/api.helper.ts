import { getAccessToken } from '../utils/auth';

export const createHeaders = () => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}; 