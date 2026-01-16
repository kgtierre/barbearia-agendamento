import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Scissors, Eye, EyeOff, User as UserIcon } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  // Função para login como convidado - ADICIONAR ESTA FUNÇÃO
  const handleGuestLogin = () => {
    console.log('[Login] 🎭 Entrando como convidado...');
    const result = loginAsGuest();
    if (result.success) {
      navigate('/');
    }
  };

  // Validação simples
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa erro quando usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('[Login] 🔍 Validando formulário...');
    
    if (!validateForm()) {
      console.log('[Login] ❌ Validação falhou');
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    console.log('[Login] 🔑 Chamando login() do AuthContext...', {
      email: formData.email,
      password: '***'
    });
    
    const result = await login(formData.email, formData.password);
    
    console.log('[Login] 📥 Resultado do login:', result);
    
    if (result.success) {
      console.log('[Login] ✅ Sucesso! Redirecionando manualmente...');
      // Redireciona manualmente para garantir
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } else {
      console.log('[Login] ❌ Falha:', result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo e Nome da Barbearia */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <Scissors className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Barbearia Corte & Estilo
          </h1>
          <p className="mt-2 text-gray-600">
            Sistema de agendamento online
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Entrar na sua conta
          </h2>
          
          {/* Erro geral */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-center font-medium">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Endereço de Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    ${errors.email ? 'border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="seu@email.com"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    ${errors.password ? 'border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="Sua senha"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white
                bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>

            {/* Entrar como Convidado - SE QUISER MANTER */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleGuestLogin} 
                disabled={loading}
                className={`
                  w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700
                  bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                Entrar como Convidado
              </button>
              <p className="mt-2 text-xs text-gray-500">
                Explore os serviços sem criar uma conta
              </p>
            </div>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {/* Link para Cadastro */}
            <div className="text-center">
              <p className="text-gray-600">
                Não tem uma conta?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Cadastre-se agora
                </Link>
              </p>
            </div>
          </form>

          {/* Dicas de Login para Desenvolvimento */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              <strong>Para teste rápido:</strong><br />
              • Cliente: cliente@teste.com / 123456<br />
              • Admin: admin@barbearia.com / [sua senha]<br />
              • Barbeiro: joao@barbearia.com / [sua senha]<br />
              • Ou use "Entrar como Convidado"
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Barbearia Corte & Estilo. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;