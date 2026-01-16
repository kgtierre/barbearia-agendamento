const Joi = require("joi");

// Validação para registro de usuário
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.min": "Nome deve ter no mínimo 3 caracteres",
    "string.max": "Nome deve ter no máximo 50 caracteres",
    "any.required": "Nome é obrigatório",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email inválido",
    "any.required": "Email é obrigatório",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Senha deve ter no mínimo 6 caracteres",
    "any.required": "Senha é obrigatória",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .required()
    .messages({
      "string.pattern.base": "Telefone inválido (10 ou 11 dígitos)",
      "any.required": "Telefone é obrigatório",
    }),
  role: Joi.string().valid("cliente", "admin", "barbeiro").default("cliente"),
});

// Validação para login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email inválido",
    "any.required": "Email é obrigatório",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Senha deve ter no mínimo 6 caracteres",
    "any.required": "Senha é obrigatória",
  }),
});

// Validação para agendamento
const appointmentSchema = Joi.object({
  barber: Joi.string().required().messages({
    "any.required": "Barbeiro é obrigatório",
  }),
  service: Joi.string().required().messages({
    "any.required": "Serviço é obrigatório",
  }),
  date: Joi.date().greater("now").required().messages({
    "date.greater": "Data deve ser futura",
    "any.required": "Data é obrigatória",
  }),
  startTime: Joi.string()
    .pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "Horário inválido (formato HH:MM)",
      "any.required": "Horário é obrigatório",
    }),
  notes: Joi.string().max(500).optional(),
});

// Validação para serviço
const serviceSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.min": "Nome deve ter no mínimo 3 caracteres",
    "string.max": "Nome deve ter no máximo 100 caracteres",
    "any.required": "Nome é obrigatório",
  }),
  description: Joi.string().min(10).max(500).required().messages({
    "string.min": "Descrição deve ter no mínimo 10 caracteres",
    "string.max": "Descrição deve ter no máximo 500 caracteres",
    "any.required": "Descrição é obrigatória",
  }),
  duration: Joi.number().min(15).max(180).required().messages({
    "number.min": "Duração mínima é 15 minutos",
    "number.max": "Duração máxima é 180 minutos",
    "any.required": "Duração é obrigatória",
  }),
  price: Joi.number().min(0).required().messages({
    "number.min": "Preço não pode ser negativo",
    "any.required": "Preço é obrigatório",
  }),
  category: Joi.string().valid("cabelo", "barba", "combo", "estilo").default("cabelo"),
  isAvailable: Joi.boolean().default(true),
});

// Função para validar dados
const validate = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false, // Retorna todos os erros
    stripUnknown: true, // Remove campos não definidos no schema
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    return { isValid: false, errors, value: null };
  }

  return { isValid: true, errors: null, value };
};

module.exports = {
  registerSchema,
  loginSchema,
  appointmentSchema,
  serviceSchema,
  validate,
};
