const { Barber, User } = require("../models");

// @desc    Obter todos os barbeiros ativos
// @route   GET /api/barbers
// @access  Public
exports.getBarbers = async (req, res) => {
  try {
    const barbers = await Barber.find({ isActive: true })
      .populate("user", "name email phone")
      .sort({ experience: -1 });

    res.json({
      success: true,
      count: barbers.length,
      barbers: barbers.map(barber => ({
        id: barber._id,
        name: barber.user.name,
        email: barber.user.email,
        phone: barber.user.phone,
        specialty: barber.specialty,
        experience: barber.experience,
        isActive: barber.isActive,
      })),
    });
  } catch (error) {
    console.error("Erro ao buscar barbeiros:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar barbeiros",
    });
  }
};

// @desc    Obter barbeiro por ID
// @route   GET /api/barbers/:id
// @access  Public
exports.getBarberById = async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id)
      .populate("user", "name email phone");
    
    if (!barber) {
      return res.status(404).json({
        success: false,
        error: "Barbeiro não encontrado",
      });
    }
    
    res.json({
      success: true,
      barber: {
        id: barber._id,
        name: barber.user.name,
        email: barber.user.email,
        phone: barber.user.phone,
        specialty: barber.specialty,
        experience: barber.experience,
        description: barber.description,
        isActive: barber.isActive,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar barbeiro:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar barbeiro",
    });
  }
};

// @desc    Obter barbeiros disponíveis
// @route   GET /api/barbers/available
// @access  Public
exports.getAvailableBarbers = async (req, res) => {
  try {
    const { date, time } = req.query;
    
    let query = { isActive: true };
    
    // Se fornecer data e hora, filtrar barbeiros disponíveis
    if (date && time) {
      // Lógica simplificada - em produção seria mais complexa
      const barbers = await Barber.find(query)
        .populate("user", "name");
      
      res.json({
        success: true,
        date,
        time,
        barbers: barbers.map(barber => ({
          id: barber._id,
          name: barber.user.name,
          specialty: barber.specialty,
          available: true, // Simplificado para agora
        })),
      });
    } else {
      // Sem filtro de data/hora
      const barbers = await Barber.find(query)
        .populate("user", "name");
      
      res.json({
        success: true,
        barbers: barbers.map(barber => ({
          id: barber._id,
          name: barber.user.name,
          specialty: barber.specialty,
          available: true,
        })),
      });
    }
  } catch (error) {
    console.error("Erro ao buscar barbeiros disponíveis:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar barbeiros disponíveis",
    });
  }
};
