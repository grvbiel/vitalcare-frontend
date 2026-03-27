import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthContextType, User, LoginCredentials } from '../types';
import { authService } from '../services/api';
import { toast } from 'react-toastify';

// Estado inicial
const initialState: AuthContextType = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
};

// Action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'LOAD_USER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOAD_USER_FAILURE' };

// Reducer
const authReducer = (state: AuthContextType, action: AuthAction): AuthContextType => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    case 'LOAD_USER_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };

    default:
      return state;
  }
};

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>(initialState);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('@VitalCare:token');
      const userStr = localStorage.getItem('@VitalCare:user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          
          // Validar token com o backend
          const validation = await authService.validateToken(token);
          
          if (validation.valid) {
            dispatch({
              type: 'LOAD_USER_SUCCESS',
              payload: { user, token },
            });
          } else {
            localStorage.removeItem('@VitalCare:token');
            localStorage.removeItem('@VitalCare:user');
            dispatch({ type: 'LOAD_USER_FAILURE' });
          }
        } catch (error) {
          localStorage.removeItem('@VitalCare:token');
          localStorage.removeItem('@VitalCare:user');
          dispatch({ type: 'LOAD_USER_FAILURE' });
        }
      } else {
        dispatch({ type: 'LOAD_USER_FAILURE' });
      }
    };

    loadUser();
  }, []);

  // Login
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'LOGIN_START' });

      const response = await authService.login(credentials);
      
      if (response.success) {
        const { user, token } = response;
        
        // Salvar no localStorage
        localStorage.setItem('@VitalCare:token', token);
        localStorage.setItem('@VitalCare:user', JSON.stringify(user));
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token },
        });
        
        toast.success('Login realizado com sucesso!');
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        toast.error('Falha no login. Verifique suas credenciais.');
      }
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE' });
      const message = error.response?.data?.message || 'Falha no login. Tente novamente.';
      toast.error(message);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      // Ignora erro no logout do backend
      console.error('Erro no logout do backend:', error);
    } finally {
      // Limpa localStorage e estado
      localStorage.removeItem('@VitalCare:token');
      localStorage.removeItem('@VitalCare:user');
      dispatch({ type: 'LOGOUT' });
      toast.success('Logout realizado com sucesso!');
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
