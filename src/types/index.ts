// Tipos da aplicação VitalCare

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  expiresIn: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalAppointments: number;
  appointmentsByStatus: {
    agendadas: number;
    realizadas: number;
    canceladas: number;
  };
  usersByRole: {
    admin: number;
    user: number;
  };
  metrics: {
    appointmentsGrowth: number;
    usersGrowth: number;
    averageAppointmentsPerUser: number;
    mostRequestedSpecialties: Array<{
      specialty: string;
      count: number;
    }>;
  };
  charts: {
    appointmentsByMonth: Array<{
      month: string;
      count: number;
    }>;
    usersByMonth: Array<{
      month: string;
      count: number;
    }>;
    appointmentsByStatus: {
      agendadas: number;
      realizadas: number;
      canceladas: number;
    };
    usersByRole: {
      admin: number;
      user: number;
    };
  };
  alerts: Array<{
    type: 'warning' | 'info' | 'success';
    message: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  recentUsers: User[];
  recentAppointments: Array<{
    id: number;
    userId: number;
    userName: string;
    userEmail: string;
    doctorName: string;
    specialty: string;
    date: string;
    status: string;
  }>;
}

export interface Appointment {
  id: number;
  userId: number;
  doctorName: string;
  specialty: string;
  date: string;
  status: 'agendada' | 'realizada' | 'cancelada';
  createdAt: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export interface ApiError {
  message: string;
  status?: number;
  timestamp: string;
}
