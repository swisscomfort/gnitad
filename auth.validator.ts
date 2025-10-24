import Joi from 'joi';

export const registerSchema = Joi.object({
  pseudonym: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  ageRange: Joi.string().required(),
  location: Joi.object({
    lat: Joi.number().required(),
    lon: Joi.number().required()
  }).optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
