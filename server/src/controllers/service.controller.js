const { Service } = require("../models");
const { serviceSchema, validate } = require("../utils/validators");

// @desc    Obter todos os serviços
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ isAvailable: true }).sort({ name: 1 });
    
    res.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar serviços",
    });
  }
};

// @desc    Obter serviço por ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: "Serviço não encontrado",
      });
    }
    
    res.json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Erro ao buscar serviço:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar serviço",
    });
  }
};

// @desc    Criar novo serviço
// @route   POST /api/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  try {
    // Validar dados
    const validation = validate(serviceSchema, req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: "Erro de validação",
        details: validation.errors,
      });
    }

    const service = await Service.create(validation.value);
    
    res.status(201).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao criar serviço",
    });
  }
};

// @desc    Atualizar serviço
// @route   PUT /api/services/:id
// @access  Private/Admin
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: "Serviço não encontrado",
      });
    }

    // Atualizar campos
    Object.keys(req.body).forEach((key) => {
      service[key] = req.body[key];
    });
    
    await service.save();
    
    res.json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao atualizar serviço",
    });
  }
};

// @desc    Deletar serviço
// @route   DELETE /api/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: "Serviço não encontrado",
      });
    }

    // Marcar como indisponível em vez de deletar
    service.isAvailable = false;
    await service.save();
    
    res.json({
      success: true,
      message: "Serviço marcado como indisponível",
    });
  } catch (error) {
    console.error("Erro ao deletar serviço:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao deletar serviço",
    });
  }
};
