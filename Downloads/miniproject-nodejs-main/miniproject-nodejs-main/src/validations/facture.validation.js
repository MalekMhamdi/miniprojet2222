const Joi = require("joi");

const createFactureSchema = Joi.object({
  client: Joi.string().required(),
  montant: Joi.number().positive().required(),
  dateEmission: Joi.date().optional()
});

module.exports = { createFactureSchema };