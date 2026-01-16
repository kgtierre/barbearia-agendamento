const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nome do serviço é obrigatório"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Descrição é obrigatória"],
  },
  duration: {
    type: Number,
    required: [true, "Duração é obrigatória"],
    min: 15,
    max: 180,
  },
  price: {
    type: Number,
    required: [true, "Preço é obrigatório"],
    min: 0,
  },
  category: {
    type: String,
    enum: ["cabelo", "barba", "combo", "estilo"],
    default: "cabelo",
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Service", serviceSchema);
