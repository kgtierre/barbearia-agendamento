// Horários disponíveis para agendamento
export const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

// Gerar slots disponíveis (70% disponível, 30% ocupado)
export const generateAvailableSlots = (date, barberId) => {
  return timeSlots.map(time => ({
    time,
    available: Math.random() > 0.3, // 70% de chance de estar disponível
    barberId
  }));
};
