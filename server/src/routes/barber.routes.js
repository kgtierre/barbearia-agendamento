const express = require("express");
const router = express.Router();
const {
  getBarbers,
  getBarberById,
  getAvailableBarbers,
} = require("../controllers/barber.controller");

// Rotas públicas
router.get("/", getBarbers);
router.get("/:id", getBarberById);
router.get("/available", getAvailableBarbers);

// Rota de teste
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Rota de barbeiros funcionando",
    endpoints: {
      list: "GET /api/barbers",
      get: "GET /api/barbers/:id",
      available: "GET /api/barbers/available",
    },
  });
});

module.exports = router;
