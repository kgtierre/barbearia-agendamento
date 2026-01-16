const { Appointment, User, Barber, Service } = require("../models");
const { appointmentSchema, validate } = require("../utils/validators");
const { calculateEndTime, isValidAppointmentDate } = require("../utils/timeUtils");

// @desc    Criar novo agendamento
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
  try {
    // Validar dados
    const validation = validate(appointmentSchema, req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: "Erro de validação",
        details: validation.errors,
      });
    }

    const { barber, service, date, startTime, notes } = validation.value;
    const clientId = req.user.id;

    // Verificar se data é válida
    const dateValidation = isValidAppointmentDate(date);
    if (!dateValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: dateValidation.reason,
      });
    }

    // Verificar se barbeiro existe
    const barberExists = await Barber.findById(barber);
    if (!barberExists || !barberExists.isActive) {
      return res.status(404).json({
        success: false,
        error: "Barbeiro não encontrado ou inativo",
      });
    }

    // Verificar se serviço existe
    const serviceExists = await Service.findById(service);
    if (!serviceExists || !serviceExists.isAvailable) {
      return res.status(404).json({
        success: false,
        error: "Serviço não encontrado ou indisponível",
      });
    }

    // Calcular horário de término
    const endTime = calculateEndTime(startTime, serviceExists.duration);

    // Verificar conflito de horário
    const existingAppointment = await Appointment.findOne({
      barber,
      date: new Date(date),
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
      status: { $nin: ["cancelado"] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        error: "Horário já reservado para este barbeiro",
      });
    }

    // Criar agendamento
    const appointment = await Appointment.create({
      client: clientId,
      barber,
      service,
      date: new Date(date),
      startTime,
      endTime,
      notes,
      price: serviceExists.price,
    });

    // Popular dados para resposta
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("barber", "specialty")
      .populate("service", "name duration price");

    res.status(201).json({
      success: true,
      appointment: populatedAppointment,
    });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao criar agendamento",
    });
  }
};

// @desc    Obter agendamentos do usuário logado
// @route   GET /api/appointments/my
// @access  Private
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ client: req.user.id })
      .populate("barber", "specialty")
      .populate("barber.user", "name")
      .populate("service", "name price duration")
      .sort({ date: -1, startTime: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar agendamentos",
    });
  }
};

// @desc    Obter todos os agendamentos (admin/barbeiro)
// @route   GET /api/appointments
// @access  Private/Admin/Barbeiro
exports.getAllAppointments = async (req, res) => {
  try {
    let query = {};
    
    // Se for barbeiro, mostrar apenas seus agendamentos
    if (req.user.role === "barbeiro") {
      const barber = await Barber.findOne({ user: req.user.id });
      if (barber) {
        query.barber = barber._id;
      }
    }
    
    // Filtrar por data se fornecido
    if (req.query.date) {
      query.date = new Date(req.query.date);
    }
    
    // Filtrar por status se fornecido
    if (req.query.status) {
      query.status = req.query.status;
    }

    const appointments = await Appointment.find(query)
      .populate("client", "name email phone")
      .populate("barber", "specialty")
      .populate("barber.user", "name")
      .populate("service", "name price")
      .sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar agendamentos",
    });
  }
};

// @desc    Atualizar status do agendamento
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin/Barbeiro
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["confirmado", "em_andamento", "concluido", "cancelado", "ausente"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Status inválido",
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Agendamento não encontrado",
      });
    }

    // Verificar permissões
    if (req.user.role === "barbeiro") {
      const barber = await Barber.findOne({ user: req.user.id });
      if (!barber || barber._id.toString() !== appointment.barber.toString()) {
        return res.status(403).json({
          success: false,
          error: "Não autorizado a atualizar este agendamento",
        });
      }
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao atualizar status",
    });
  }
};

// @desc    Obter horários disponíveis
// @route   GET /api/appointments/available
// @access  Public
exports.getAvailableSlots = async (req, res) => {
  try {
    const { barberId, date } = req.query;
    
    if (!barberId || !date) {
      return res.status(400).json({
        success: false,
        error: "Barbeiro e data são obrigatórios",
      });
    }

    // Obter barbeiro
    const barber = await Barber.findById(barberId);
    if (!barber || !barber.isActive) {
      return res.status(404).json({
        success: false,
        error: "Barbeiro não encontrado",
      });
    }

    // Obter agendamentos do dia
    const appointments = await Appointment.find({
      barber: barberId,
      date: new Date(date),
      status: { $nin: ["cancelado"] },
    });

    // Gerar slots básicos (simplificado por enquanto)
    const slots = [];
    const startHour = 9;
    const endHour = 18;
    const interval = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        
        // Verificar se horário está ocupado
        const isBooked = appointments.some((apt) => {
          return time >= apt.startTime && time < apt.endTime;
        });

        slots.push({
          time,
          available: !isBooked,
        });
      }
    }

    res.json({
      success: true,
      date,
      barber: {
        id: barber._id,
        specialty: barber.specialty,
      },
      slots,
    });
  } catch (error) {
    console.error("Erro ao buscar horários:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar horários disponíveis",
    });
  }
};
