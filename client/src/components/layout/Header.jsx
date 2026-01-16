import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Scissors, Calendar, Users, Home, LogOut, User as UserIcon, Settings } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, user, logout, isGuest } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 mb-4 md:mb-0">
            <Scissors className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-800">
              Barbearia Corte & Estilo
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center space-x-4">
            <Link to="/" className="flex items-center text-gray-600 hover:text-primary-600">
              <Home className="h-4 w-4 mr-1" />
              Início
            </Link>
            
            {isAuthenticated ? (
              <>
                {/* Menu para Clientes e Convidados */}
                {(user?.role === 'cliente' || isGuest) && (
                  <>
                    <Link to="/services" className="flex items-center text-gray-600 hover:text-primary-600">
                      <Scissors className="h-4 w-4 mr-1" />
                      Serviços
                    </Link>
                    <Link to="/barbers" className="flex items-center text-gray-600 hover:text-primary-600">
                      <Users className="h-4 w-4 mr-1" />
                      Barbeiros
                    </Link>
                    <Link to="/booking" className="flex items-center text-gray-600 hover:text-primary-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      Agendar
                    </Link>
                    <Link to="/my-appointments" className="text-gray-600 hover:text-primary-600">
                      Meus Horários
                    </Link>
                  </>
                )}
                
                {/* Menu para Admin */}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center text-gray-600 hover:text-primary-600">
                    <Settings className="h-4 w-4 mr-1" />
                    Admin
                  </Link>
                )}
                
                {/* Menu para Barbeiro */}
                {user?.role === 'barbeiro' && (
                  <Link to="/barbeiro" className="flex items-center text-gray-600 hover:text-primary-600">
                    <Scissors className="h-4 w-4 mr-1" />
                    Painel
                  </Link>
                )}

                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                      <UserIcon className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        {user?.name}
                        {isGuest && <span className="text-xs text-gray-500 ml-1">(Convidado)</span>}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {user?.role}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-red-600 hover:text-red-800 font-medium"
                    title="Sair do sistema"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600">
                  Entrar
                </Link>
                <Link to="/register" className="btn-primary px-4 py-2">
                  Cadastrar
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
