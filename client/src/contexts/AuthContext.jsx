import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authService } from '../services';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    try {
      // Verifica se é um usuário convidado primeiro
      const guestUser = localStorage.getItem('guestUser');
      if (guestUser) {
        const parsedGuest = JSON.parse(guestUser);
        if (parsedGuest.isGuest) {
          setUser(parsedGuest);
          setLoading(false);
          return;
        }
      }

      // Se não for guest, verifica token normal
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authService.getProfile();
      setUser(response.user);
    } catch (error) {
      // Se erro na verificação, limpa tudo
      localStorage.removeItem('token');
      localStorage.removeItem('guestUser');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
  try {
    setLoading(true);
    console.log('[AuthContext] 🔑 Iniciando login para:', email);
    
    const response = await authService.login({ email, password });
    console.log('[AuthContext] 📥 Resposta da API:', response);
    
    // Remove guest se existir
    localStorage.removeItem('guestUser');
    
    localStorage.setItem('token', response.token);
    console.log('[AuthContext] ✅ Token salvo no localStorage');
    
    setUser(response.user);
    console.log('[AuthContext] 👤 Usuário definido no estado:', response.user.email);
    
    toast.success('Login realizado com sucesso!');
    return { success: true, user: response.user };
  } catch (error) {
    console.error('[AuthContext] ❌ Erro no login:', error);
    toast.error(error.message || error.error || 'Erro ao fazer login');
    return { success: false, error: error.message || error.error };
  } finally {
    setLoading(false);
    console.log('[AuthContext] 🏁 Login finalizado');
  }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);

      // Remove guest se existir
      localStorage.removeItem('guestUser');
      
      localStorage.setItem('token', response.token);
      setUser(response.user);

      toast.success('Cadastro realizado com sucesso!');
      return { success: true, user: response.user };
    } catch (error) {
      toast.error(error.error || 'Erro ao cadastrar');
      return { success: false, error: error.error };
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    const guestUser = {
      id: 'guest-' + Date.now(),
      name: 'Visitante',
      email: 'convidado@barbearia.com',
      phone: '11999999999',
      role: 'guest',
      isGuest: true,
    };

    // Remove token normal se existir
    localStorage.removeItem('token');
    
    // Salva guest
    localStorage.setItem('guestUser', JSON.stringify(guestUser));
    setUser(guestUser);

    toast.success('Entrou como convidado! Acesso limitado.');
    return { success: true, user: guestUser };
  };

  const logout = () => {
    // Remove tudo
    localStorage.removeItem('token');
    localStorage.removeItem('guestUser');
    setUser(null);
    toast.success('Logout realizado!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginAsGuest,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isBarber: user?.role === 'barbeiro',
        isClient: user?.role === 'cliente' || user?.role === 'guest',
        isGuest: user?.isGuest === true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
