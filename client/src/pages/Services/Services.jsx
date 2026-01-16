import React, { useState, useEffect } from 'react';
import { Scissors, Clock, DollarSign, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { servicesData } from '../../data/services.data';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setServices(servicesData);
    setLoading(false);
  }, []);

  const handleServiceSelect = (serviceId) => {
    // Navega para booking PASSANDO o serviço selecionado
    navigate('/booking', { state: { selectedServiceId: serviceId } });
  };

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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Nossos Serviços</h1>
        <p className="text-gray-600 text-lg">
          Escolha o serviço e agende diretamente
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">
                  {service.emoji}
                </div>
                {service.popular && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    ⭐ Popular
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>

              <div className="flex items-center justify-between text-gray-700 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-bold text-primary-600">R$ {service.price.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => handleServiceSelect(service.id)}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition flex items-center justify-center"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Este Serviço
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
