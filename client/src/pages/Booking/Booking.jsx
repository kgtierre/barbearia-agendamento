import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Scissors, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { servicesData } from '../../data/services.data';
import { barbersData } from '../../data/barbers.data';
import { generateAvailableSlots } from '../../data/timeSlots.data';
import toast from 'react-hot-toast';


const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log('📍 DEBUG Booking Page');
  console.log('location.state:', location.state);
  console.log('selectedServiceId recebido:', location.state?.selectedServiceId);
  // Pegar serviço selecionado da navegação (se veio de Services)
  const selectedServiceFromState = location.state?.selectedServiceId;
  
  const [step, setStep] = useState(selectedServiceFromState ? 2 : 1); // Pula para passo 2 se já tem serviço
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Form data
  const [formData, setFormData] = useState({
    serviceId: selectedServiceFromState || '',
    barberId: '',
    date: '',
    time: '',
    notes: ''
  });

  // Carregar dados consistentes
  useEffect(() => {
    setServices(servicesData);
    setBarbers(barbersData.filter(b => b.available));
    
    // Set today's date as default
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    setFormData(prev => ({ ...prev, date: formattedDate }));
  }, []);

  // Fetch available slots when barber and date are selected
  useEffect(() => {
    if (formData.barberId && formData.date) {
      fetchAvailableSlots();
    }
  }, [formData.barberId, formData.date]);

  const fetchAvailableSlots = () => {
    setLoading(true);
    
    // Simular delay de API
    setTimeout(() => {
      const slots = generateAvailableSlots(formData.date, formData.barberId);
      setAvailableSlots(slots);
      setLoading(false);
    }, 500);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const isToday = dateString === new Date().toISOString().split('T')[0];
      const isSelected = dateString === selectedDate;
      const isPast = date < new Date().setHours(0, 0, 0, 0);
      const isSunday = date.getDay() === 0;
      
      days.push({
        day,
        date: dateString,
        isToday,
        isSelected,
        isPast,
        isSunday,
        isAvailable: !isPast && !isSunday
      });
    }
    
    return days;
  };

  const handleDateSelect = (date) => {
    if (!date) return;
    
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, date }));
    setStep(3); // Move to time selection
  };

  const handleServiceSelect = (serviceId) => {
    setFormData(prev => ({ ...prev, serviceId }));
    setStep(2); // Move to barber selection
  };

  const handleBarberSelect = (barberId) => {
    setFormData(prev => ({ ...prev, barberId }));
    // Auto-advance to calendar if date already selected
    if (formData.date) {
      setStep(3);
    }
  };

  const handleTimeSelect = (time) => {
    setFormData(prev => ({ ...prev, time }));
    setStep(4); // Move to confirmation
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    // Simular API call
    setTimeout(() => {
      // 1. Mostra toast de sucesso
      toast.success('✅ Agendamento realizado com sucesso!', {
        duration: 3000,
        position: 'top-center',
      });
      
      // 2. Redireciona para Home após 2 segundos
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
      // 3. Reset form
      setFormData({
        serviceId: '',
        barberId: '',
        date: selectedDate,
        time: '',
        notes: ''
      });
      setStep(1);
      setLoading(false);
    }, 1000);
    
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    toast.error('❌ Erro ao criar agendamento', {
      duration: 3000,
    });
    setLoading(false);
  }
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const calendarDays = generateCalendarDays();
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const currentMonthName = monthNames[currentMonth.getMonth()];
  const currentYear = currentMonth.getFullYear();

  const selectedService = services.find(s => s.id === formData.serviceId);
  const selectedBarber = barbers.find(b => b.id === formData.barberId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8 relative">
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className="flex flex-col items-center z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
              ${step >= stepNum ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
              {stepNum}
            </div>
            <div className="mt-2 text-sm">
              {stepNum === 1 && 'Serviço'}
              {stepNum === 2 && 'Barbeiro'}
              {stepNum === 3 && 'Data/Hora'}
              {stepNum === 4 && 'Confirmar'}
            </div>
          </div>
        ))}
        <div className="absolute top-5 left-10 right-10 h-1 bg-gray-200 -z-10">
          <div 
            className="h-1 bg-primary-600 transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Scissors className="mr-2" />
              Escolha o Serviço
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`p-6 rounded-lg border-2 text-left transition-all hover:shadow-lg
                    ${formData.serviceId === service.id 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-200 hover:border-primary-400'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{service.emoji}</div>
                    {service.popular && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                        ⭐ Popular
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-3 text-sm">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-600 font-bold">
                      R$ {service.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {service.duration} min
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Barber Selection */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <User className="mr-2" />
              Escolha o Barbeiro
            </h2>
            {selectedService && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700">
                  Serviço selecionado: <strong>{selectedService.name}</strong> 
                  (R$ {selectedService.price.toFixed(2)} • {selectedService.duration} min)
                </p>
              </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {barbers.map((barber) => (
                <button
                  key={barber.id}
                  onClick={() => handleBarberSelect(barber.id)}
                  className={`p-6 rounded-lg border-2 text-left transition-all hover:shadow-lg
                    ${formData.barberId === barber.id 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-200 hover:border-primary-400'}`}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <div className="text-2xl">{barber.emoji}</div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg">{barber.name}</h3>
                      <p className="text-gray-600 capitalize">{barber.specialty}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span>Experiência: {barber.experience} anos</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        {barber.rating.toFixed(1)} ⭐
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              className="mt-6 text-primary-600 hover:text-primary-800"
            >
              ← Voltar para serviços
            </button>
          </div>
        )}

        {/* Step 3: Date and Time Selection */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Calendar className="mr-2" />
              Escolha Data e Horário
            </h2>

            {/* Service and Barber Info */}
            <div className="mb-6 grid md:grid-cols-2 gap-4">
              {selectedService && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Serviço:</h3>
                  <p>{selectedService.name} • {selectedService.duration} min • R$ {selectedService.price.toFixed(2)}</p>
                </div>
              )}
              {selectedBarber && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Barbeiro:</h3>
                  <p>{selectedBarber.name} • {selectedBarber.specialty}</p>
                </div>
              )}
            </div>

            {/* Calendar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded">
                  <ChevronLeft />
                </button>
                <h3 className="text-xl font-semibold">
                  {currentMonthName} {currentYear}
                </h3>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded">
                  <ChevronRight />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div key={day} className="text-center font-semibold py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day?.isAvailable && handleDateSelect(day.date)}
                    disabled={!day?.isAvailable}
                    className={`p-3 rounded-lg transition text-center
                      ${!day ? 'invisible' : ''}
                      ${day?.isSelected ? 'bg-primary-600 text-white' : ''}
                      ${day?.isToday && !day?.isSelected ? 'border-2 border-primary-600' : ''}
                      ${day?.isPast || day?.isSunday ? 'text-gray-400 cursor-not-allowed' : ''}
                      ${day?.isAvailable && !day?.isSelected ? 'hover:bg-gray-100' : ''}`}
                  >
                    {day?.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Horários disponíveis para {selectedDate && new Date(selectedDate).toLocaleDateString('pt-BR')}
              </h3>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 rounded-lg transition text-center flex flex-col items-center justify-center
                        ${formData.time === slot.time
                          ? 'bg-primary-600 text-white'
                          : slot.available
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 cursor-not-allowed'}`}
                    >
                      <Clock className="h-4 w-4 mb-1" />
                      <span className="font-medium">{slot.time}</span>
                      {!slot.available && (
                        <span className="text-xs mt-1">Ocupado</span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600 bg-gray-50 rounded-lg">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg mb-2">Carregando horários disponíveis...</p>
                  <p className="text-sm">Selecione uma data para ver os horários</p>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="text-primary-600 hover:text-primary-800"
              >
                ← Voltar para barbeiros
              </button>
              
              {formData.time && (
                <button
                  onClick={() => setStep(4)}
                  className="btn-primary px-6 py-2"
                >
                  Confirmar Horário →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">✅ Confirmar Agendamento</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-green-200">
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-semibold">{user?.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Serviço:</span>
                  <span className="font-semibold">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Barbeiro:</span>
                  <span className="font-semibold">{selectedBarber?.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-semibold">
                    {new Date(formData.date).toLocaleDateString('pt-BR', { 
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Horário:</span>
                  <span className="font-semibold">{formData.time}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Duração:</span>
                  <span className="font-semibold">{selectedService?.duration} minutos</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-600">Valor Total:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    R$ {selectedService?.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                <span className="font-medium">Observações (opcional):</span>
                <span className="text-sm text-gray-500 ml-2">Alguma observação especial para o barbeiro...</span>
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="3"
                placeholder="Ex: Quero o lado direito mais curto que o esquerdo..."
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={() => setStep(3)}
                className="text-primary-600 hover:text-primary-800 py-3"
              >
                ← Voltar para horários
              </button>
              
              <div className="space-y-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold w-full sm:w-auto"
                >
                  {loading ? 'Confirmando...' : '✅ Confirmar Agendamento'}
                </button>
                <p className="text-xs text-gray-500 text-center sm:text-right">
                  Você receberá uma confirmação por e-mail
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
