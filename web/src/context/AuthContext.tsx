import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import useAxios from '../helpers/api';
import API from '../helpers/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { usernameOrEmail: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: { username: string; name: string; email: string; password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const axiosClient = useAxios();
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const checkAuth = async () => {
      try {
        const { data } = await axiosClient.get('/api/me');
        setUser(data.data);
      } catch {
        setUser(null);
      }
    };
    if (accessToken) {
      checkAuth();
    }
  }, []);

  const login = async (credentials: { usernameOrEmail: string; password: string }) => {
    const isEmail = credentials.usernameOrEmail.includes('@');

    const payload = isEmail
      ? { email: credentials.usernameOrEmail, password: credentials.password }
      : { username: credentials.usernameOrEmail, password: credentials.password };

    const { data }: any = await axiosClient.post('/auth/login', payload);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    const userData: any = await axiosClient.get('/api/me').then((res) => res.data);
    setUser(userData);
  };

  const register = async (credentials: { name: string; username: string; email: string; password: string }) => {
    await axiosClient.post('/auth/register', credentials).then((data) => {
      login({ usernameOrEmail: credentials.username, password: credentials.password });
    });
  };

  const logout = async () => {
    await axiosClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout, register }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
