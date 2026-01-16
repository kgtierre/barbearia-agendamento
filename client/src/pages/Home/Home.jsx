import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Scissors, Users, Clock, Star, CheckCircle } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user, isGuest } = useAuth();

  const services = [
    { name: 'Corte Social', price: 35, duration: 30, emoji: '💇' },
    { name: 'Barba Completa', price: 25, duration: 25, emoji: '🧔' },
    { name: 'Corte + Barba', price: 55, duration: 50, emoji: '✂️🧔' },
    { name: 'Hidratação', price: 40, duration: 40, emoji: '🌟' }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Barbearia <span className="text-yellow-300">Corte & Estilo</span>
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Agendamento online fácil e rápido
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      {isAuthenticated && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Acesso Rápido</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/booking"
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="text-3xl mb-3">📅</div>
              <h3 className="font-semibold mb-2">Novo Agendamento</h3>
              <p className="text-gray-600 text-sm">Marque seu horário</p>
            </Link>
            
            <Link
              to="/services"
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="text-3xl mb-3">✂️</div>
              <h3 className="font-semibold mb-2">Serviços</h3>
              <p className="text-gray-600 text-sm">Conheça nossos serviços</p>
            </Link>
            
            <Link
              to="/barbers"
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="text-3xl mb-3">👨‍🎨</div>
              <h3 className="font-semibold mb-2">Barbeiros</h3>
              <p className="text-gray-600 text-sm">Nossa equipe</p>
            </Link>
            
            <Link
              to="/my-appointments"
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-semibold mb-2">Meus Horários</h3>
              <p className="text-gray-600 text-sm">Ver agendamentos</p>
            </Link>
          </div>
        </section>
      )}

      {/* Services Preview */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Serviços Populares</h2>
            <p className="text-gray-600">Escolha o serviço perfeito para você</p>
          </div>
          <Link
            to="/services"
            className="mt-4 md:mt-0 btn-primary px-6 py-2"
          >
            Ver Todos
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-3">{service.emoji}</div>
              <h3 className="font-semibold mb-2">{service.name}</h3>
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {service.duration}min
                </span>
                <span className="font-bold text-primary-600">
                  R$ {service.price}
                </span>
              </div>
              <Link
                to={isAuthenticated ? "/booking" : "/login"}
                className="mt-4 block w-full text-center btn-primary py-2 rounded-lg text-sm"
              >
                Agendar
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Por que escolher nossa barbearia?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">Profissionais Qualificados</h3>
            <p className="text-gray-600">Barbeiros com anos de experiência</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">Agendamento Online</h3>
            <p className="text-gray-600">Marque seu horário</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">Garantia de Satisfação</h3>
            <p className="text-gray-600">Resultado que você merece</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          {isAuthenticated ? 'Pronto para seu próximo corte?' : 'Pronto para transformar seu visual?'}
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          {isAuthenticated 
            ? 'Agende agora mesmo com nossos barbeiros especializados.'
            : 'Faça seu primeiro agendamento de forma rápida e fácil.'
          }
        </p>
        <Link
          to={isAuthenticated ? "/booking" : "/login"}
          className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
        >
          <Calendar className="mr-2 h-5 w-5" />
          {isAuthenticated ? 'Fazer Agendamento' : 'Começar Agora'}
        </Link>
      </section>
    </div>
  );
};

export default Home;
