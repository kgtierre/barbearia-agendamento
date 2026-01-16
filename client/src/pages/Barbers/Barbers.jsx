import React, { useState, useEffect } from 'react';
import { User, Star, Briefcase, Phone } from 'lucide-react';
import { barbersData } from '../../data/barbers.data';

const Barbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBarbers(barbersData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Nossos Barbeiros</h1>
        <p className="text-gray-600 text-lg">
          Conheça nossa equipe de profissionais qualificados
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {barbers.map((barber) => (
          <div key={barber.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="text-5xl mb-4">{barber.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 text-center">{barber.name}</h3>
                <p className="text-primary-600 font-medium capitalize">{barber.specialty}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{barber.experience} anos de experiência</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{barber.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="h-4 w-4 mr-2 flex-shrink-0 text-yellow-500" />
                  <span>{barber.rating.toFixed(1)} ⭐</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  barber.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {barber.available ? 'Disponível' : 'Indisponível'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-gray-600 mb-6">
          Todos os nossos barbeiros passam por treinamento contínuo para oferecer o melhor serviço.
        </p>
        <p className="text-gray-500 text-sm">
          Para agendar, vá em "Agendar" no menu e escolha seu barbeiro preferido.
        </p>
      </div>
    </div>
  );
};

export default Barbers;
