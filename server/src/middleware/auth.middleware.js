const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Middleware para proteger rotas
const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar se token está no header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Não autorizado. Token não fornecido.",
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário (sem a senha)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Usuário não encontrado.",
      });
    }

    next();
  } catch (error) {
    console.error("Erro de autenticação:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Token inválido.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expirado.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Erro no servidor de autenticação.",
    });
  }
};

// Middleware para autorização baseada em roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Usuário não autenticado.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Acesso negado. Role ${req.user.role} não tem permissão.`,
      });
    }

    next();
  };
};

// Gerar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

module.exports = {
  protect,
  authorize,
  generateToken,
};
