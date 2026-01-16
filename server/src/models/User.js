const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nome é obrigatório"],
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Email é obrigatório"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Email inválido"],
  },
  password: {
    type: String,
    required: [true, "Senha é obrigatória"],
    minlength: 6,
  },
  phone: {
    type: String,
    required: [true, "Telefone é obrigatório"],
    match: [/^[0-9]{10,11}$/, "Telefone inválido (10 ou 11 dígitos)"],
  },
  role: {
    type: String,
    enum: ["cliente", "admin", "barbeiro"],
    default: "cliente",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔥 MIDDLEWARE CORRETO - SEM "next" parameter
userSchema.pre("save", async function() {
  // Apenas faz hash se a senha foi modificada
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      // NÃO CHAME next() - o Mongoose 7+ lida automaticamente
    } catch (err) {
      throw err; // Lança o erro para ser capturado pelo Mongoose
    }
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);