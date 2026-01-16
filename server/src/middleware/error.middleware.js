// Middleware para tratar erros 404
const notFound = (req, res, next) => {
  const error = new Error(`Rota não encontrada: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Middleware global de tratamento de erros
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log do erro no servidor
  console.error(`💥 ERRO: ${error.message}`);
  console.error(`📍 Rota: ${req.method} ${req.originalUrl}`);
  console.error(`📝 Stack: ${err.stack}`);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Recurso não encontrado";
    error = new Error(message);
    error.statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `${field} já está em uso`;
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    const message = messages.join(", ");
    error = new Error(message);
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Token inválido";
    error = new Error(message);
    error.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expirado";
    error = new Error(message);
    error.statusCode = 401;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Erro no servidor",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
