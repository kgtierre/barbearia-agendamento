import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Scissors, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Agendamentos', value: '0', icon: <Calendar />, color: 'blue' },
    { label: 'Serviços Usados', value: '0', icon: <Scissors />, color: 'green' },
    { label: 'Horas Agendadas', value: '0h', icon: <Clock />, color: 'purple' },
    { label: 'Fidelidade', value: 'Novato', icon: <User />, color: 'yellow' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          👋 Olá, {user?.name}!
        </h1>
        <p className="text-gray-600">Bem-vindo ao seu painel de controle</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <div className={`text-${stat.color}-600`}>{stat.icon}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/booking"
            className="p-4 border-2 border-primary-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition flex items-center"
          >
            <Calendar className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <div className="font-semibold">Novo Agendamento</div>
              <div className="text-sm text-gray-600">Marque um horário</div>
            </div>
          </Link>
          
          <Link
            to="/my-appointments"
            className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition flex items-center"
          >
            <Clock className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <div className="font-semibold">Meus Agendamentos</div>
              <div className="text-sm text-gray-600">Ver seus horários</div>
            </div>
          </Link>
          
          <Link
            to="/services"
            className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition flex items-center"
          >
            <Scissors className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <div className="font-semibold">Ver Serviços</div>
              <div className="text-sm text-gray-600">Conheça nossos serviços</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">🎉 Bem-vindo ao sistema!</h2>
          <p className="mb-6">
            Aqui você pode gerenciar todos os seus agendamentos, conhecer nossos serviços
            e profissionais, e muito mais. Explore as funcionalidades abaixo:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/services" className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium">
              Serviços
            </Link>
            <Link to="/barbers" className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium">
              Barbeiros
            </Link>
            <Link to="/booking" className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium">
              Agendar
            </Link>
            <Link to="/my-appointments" className="bg-transparent border-2 border-white text-white px-4 py-2 rounded-lg font-medium">
              Meus Horários
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
