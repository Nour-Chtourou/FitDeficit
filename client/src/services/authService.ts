import axios from 'axios';
import type { RegisterData, LoginData, AuthResponse } from '../types';
const API_URL = 'http://localhost:5001/api';

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
};