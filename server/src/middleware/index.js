const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Middleware para proteger rotas
const protect = async (req, res, next) => {
  let token;

  // Verificar se tem token no header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extrair token
      token = req.headers.authorization.split(" ")[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar usuário pelo id do token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error("Erro na autenticação:", error);
      res.status(401).json({
        success: false,
        error: "Não autorizado, token inválido",
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      error: "Não autorizado, token não fornecido",
    });
  }
};

// Middleware para autorizar roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Role ${req.user.role} não tem autorização para acessar este recurso`,
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};