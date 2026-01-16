const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rotas
const authRoutes = require("./routes/auth.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const serviceRoutes = require("./routes/service.routes");
const barberRoutes = require("./routes/barber.routes");

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/barbers", barberRoutes);

// Rota principal
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API da Barbearia Corte & Estilo",
    version: "1.0.0",
    status: "online",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      appointments: "/api/appointments",
      services: "/api/services",
      barbers: "/api/barbers",
      test: "/api/test",
      health: "/health",
    },
  });
});

// Rota de saúde
app.get("/health", (req, res) => {
  res.json({
    success: true,
    database: "MongoDB",
    status: "operational",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// Rota de teste geral
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API funcionando corretamente",
    allEndpoints: {
      home: "GET /",
      health: "GET /health",
      auth: {
        test: "GET /api/auth/test",
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        profile: "GET /api/auth/me",
      },
      appointments: {
        test: "GET /api/appointments/test",
        list: "GET /api/appointments",
        my: "GET /api/appointments/my",
        available: "GET /api/appointments/available",
        create: "POST /api/appointments",
      },
      services: {
        test: "GET /api/services/test",
        list: "GET /api/services",
        get: "GET /api/services/:id",
      },
      barbers: {
        test: "GET /api/barbers/test",
        list: "GET /api/barbers",
        available: "GET /api/barbers/available",
      },
    },
  });
});

// Middleware para rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: "Rota não encontrada",
    path: req.originalUrl,
    method: req.method,
  });
});

// Middleware global de erros
app.use((err, req, res, next) => {
  console.error("Erro:", err.message);
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Erro interno do servidor",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

module.exports = app;
