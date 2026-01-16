const express = require("express");
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/service.controller");
const { protect, authorize } = require("../middleware");

// Rotas públicas
router.get("/", getServices);
router.get("/:id", getServiceById);

// Rotas protegidas (apenas admin)
router.post("/", protect, authorize("admin"), createService);
router.put("/:id", protect, authorize("admin"), updateService);
router.delete("/:id", protect, authorize("admin"), deleteService);

// Rota de teste
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Rota de serviços funcionando",
    endpoints: {
      list: "GET /api/services",
      get: "GET /api/services/:id",
      create: "POST /api/services (admin)",
      update: "PUT /api/services/:id (admin)",
      delete: "DELETE /api/services/:id (admin)",
    },
  });
});

module.exports = router;
