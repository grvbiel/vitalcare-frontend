import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, AuthResponse, LoginCredentials, DashboardStats, User, Appointment } from '../types';

// Configuração da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Cria instância do Axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@VitalCare:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('@VitalCare:token');
      localStorage.removeItem('@VitalCare:user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviço de Autenticação
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/login', credentials);
    return response.data.data!;
  },

  validateToken: async (token: string): Promise<{ valid: boolean; payload: any }> => {
    const response = await api.post<ApiResponse<{ valid: boolean; payload: any }>>('/validate-token', { token });
    return response.data.data!;
  },

  logout: async (): Promise<void> => {
    await api.post('/logout');
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/profile');
    return response.data.data!;
  },
};

// Serviço de Dashboard Administrativo
export const adminService = {
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard');
    return response.data.data!;
  },

  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/admin/stats');
    return response.data.data!;
  },

  getUsers: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/admin/users');
    return response.data.data!;
  },

  getAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get<ApiResponse<Appointment[]>>('/admin/appointments');
    return response.data.data!;
  },

  getAlerts: async (): Promise<DashboardStats['alerts']> => {
    const response = await api.get<ApiResponse<DashboardStats['alerts']>>('/admin/alerts');
    return response.data.data!;
  },

  getCharts: async (): Promise<DashboardStats['charts']> => {
    const response = await api.get<ApiResponse<DashboardStats['charts']>>('/admin/charts');
    return response.data.data!;
  },

  healthCheck: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>('/admin/health');
    return response.data.data!;
  },
};

// Serviço Público
export const publicService = {
  healthCheck: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>('/health');
    return response.data.data!;
  },

  getApiInfo: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>('/');
    return response.data.data!;
  },
};

export default api;
