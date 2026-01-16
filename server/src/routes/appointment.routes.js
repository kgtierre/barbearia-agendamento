const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  getAvailableSlots,
} = require("../controllers/appointment.controller");
const { protect, authorize } = require("../middleware");

// Rota pública
router.get("/available", getAvailableSlots);

// Rotas protegidas para clientes
router.post("/", protect, createAppointment);
router.get("/my", protect, getMyAppointments);

// Rotas protegidas para admin/barbeiro
router.get("/", protect, authorize("admin", "barbeiro"), getAllAppointments);
router.put("/:id/status", protect, authorize("admin", "barbeiro"), updateAppointmentStatus);

// Rota de teste
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Rota de agendamentos funcionando",
    endpoints: {
      create: "POST /api/appointments (protected)",
      myAppointments: "GET /api/appointments/my (protected)",
      allAppointments: "GET /api/appointments (admin/barbeiro)",
      updateStatus: "PUT /api/appointments/:id/status (admin/barbeiro)",
      availableSlots: "GET /api/appointments/available (public)",
    },
  });
});

module.exports = router;
