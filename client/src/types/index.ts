export interface User {
  id: string;
  name: string;
  email: string;
  tdee?: number;
  targetCalories?: number;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
  activityLevel?: string;
  goal?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}