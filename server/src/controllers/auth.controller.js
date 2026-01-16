const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

// Gerar token JWT (APENAS AQUI)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @desc    Registrar novo usuário
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    console.log("Tentando registrar:", req.body);
    
    const { name, email, password, phone } = req.body;

    // Validação básica
    if (!name || name.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: "Nome deve ter pelo menos 3 caracteres",
      });
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Email inválido",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Senha deve ter pelo menos 6 caracteres",
      });
    }

    // Limpar telefone
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 11) {
      return res.status(400).json({
        success: false,
        error: "Telefone inválido (10 ou 11 dígitos)",
      });
    }

    // Verificar se usuário já existe
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: "Email já está em uso",
      });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criar usuário
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: cleanPhone,
      role: "cliente",
    });

    await user.save();
    console.log("Usuário criado com ID:", user._id);

    // Gerar token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Erro detalhado no registro:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao registrar usuário: " + error.message,
    });
  }
};

// @desc    Login de usuário
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email e senha são obrigatórios",
      });
    }

    // Buscar usuário e incluir senha
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Credenciais inválidas",
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Credenciais inválidas",
      });
    }

    // Gerar token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao fazer login",
    });
  }
};

// @desc    Obter perfil do usuário logado
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao obter perfil",
    });
  }
};

// @desc    Atualizar perfil do usuário
// @route   PUT /api/auth/me
// @access  Private
exports.updateMe = async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    // Buscar usuário
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Atualizar campos permitidos
    if (name && name.trim().length >= 3) {
      user.name = name.trim();
    }
    
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length >= 10 && cleanPhone.length <= 11) {
        user.phone = cleanPhone;
      }
    }
    
    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao atualizar perfil",
    });
  }
};