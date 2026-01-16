import api from './api';

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
};

export const serviceService = {
  getServices: () => api.get('/services'),
};

export const barberService = {
  getBarbers: () => api.get('/barbers'),
};

export const appointmentService = {
  createAppointment: (data) => api.post('/appointments', data),
  getMyAppointments: () => api.get('/appointments/my'),
};
