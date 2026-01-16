const { validate } = require("../utils/validators");

// Middleware genérico de validação
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { isValid, errors, value } = validate(schema, req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: "Erro de validação",
        details: errors,
      });
    }

    // Substituir body pelos dados validados (sem campos extras)
    req.body = value;
    next();
  };
};

// Middleware para validar query params
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { isValid, errors, value } = validate(schema, req.query);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: "Parâmetros de query inválidos",
        details: errors,
      });
    }

    req.query = value;
    next();
  };
};

// Middleware para validação de params
const validateParams = (schema) => {
  return (req, res, next) => {
    const { isValid, errors, value } = validate(schema, req.params);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: "Parâmetros de rota inválidos",
        details: errors,
      });
    }

    req.params = value;
    next();
  };
};

module.exports = {
  validateRequest,
  validateQuery,
  validateParams,
};
