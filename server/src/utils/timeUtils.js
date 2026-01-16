// Gerar slots de horários
const generateTimeSlots = (startHour = 9, endHour = 18, interval = 30) => {
  const slots = [];
  const start = startHour * 60; // 9:00 em minutos
  const end = endHour * 60;     // 18:00 em minutos
  
  for (let time = start; time < end; time += interval) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    slots.push(timeString);
  }
  
  return slots;
};

// Calcular horário de término
const calculateEndTime = (startTime, duration) => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const startTotalMinutes = hours * 60 + minutes;
  const endTotalMinutes = startTotalMinutes + duration;
  
  const endHours = Math.floor(endTotalMinutes / 60);
  const endMinutes = endTotalMinutes % 60;
  
  return `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
};

// Verificar se data é válida para agendamento
const isValidAppointmentDate = (date) => {
  const selectedDate = new Date(date);
  const today = new Date();
  
  // Resetar horas para comparar apenas datas
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  // Não permitir datas passadas
  if (selectedDate < today) {
    return { isValid: false, reason: "Data passada não é permitida" };
  }
  
  // Não permitir domingos (0 = domingo)
  if (selectedDate.getDay() === 0) {
    return { isValid: false, reason: "Não trabalhamos aos domingos" };
  }
  
  // Não permitir sábados após 14h
  if (selectedDate.getDay() === 6) {
    return { isValid: true, reason: "Sábado: horário reduzido (9h-14h)" };
  }
  
  return { isValid: true, reason: "Data válida" };
};

// Formatar data para exibição
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Formatar hora para exibição
const formatTime = (time) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  
  if (hour < 12) {
    return `${time} AM`;
  } else if (hour === 12) {
    return `${time} PM`;
  } else {
    return `${hour - 12}:${minutes} PM`;
  }
};

module.exports = {
  generateTimeSlots,
  calculateEndTime,
  isValidAppointmentDate,
  formatDate,
  formatTime,
};
