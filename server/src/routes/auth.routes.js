const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware");

// Rotas públicas
router.post("/register", register);
router.post("/login", login);

// Rotas protegidas
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

// Rota de teste
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Rota de autenticação funcionando",
    endpoints: {
      register: "POST /api/auth/register",
      login: "POST /api/auth/login",
      profile: "GET /api/auth/me (protected)",
      updateProfile: "PUT /api/auth/me (protected)",
    },
  });
});

module.exports = router;
