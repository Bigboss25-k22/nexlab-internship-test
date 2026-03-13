import Joi from 'joi';

export const registerSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 2 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be valid',
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .required()
    .messages({
      'string.empty': 'Phone is required',
      'string.pattern.base': 'Phone must be 10-11 digits',
    }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  role: Joi.string().valid('owner', 'freelancer').required().messages({
    'string.empty': 'Role is required',
    'any.only': 'Role must be one of: owner, freelancer',
  }),
  // Optional user profile fields
  birthDate: Joi.string().optional(),
  gender: Joi.string().optional(),
  avatar: Joi.string().optional(),
  // Optional fields for freelancer
  houseNumber: Joi.string().max(50).optional(),
  street: Joi.string().max(100).optional(),
  ward: Joi.string().max(100).optional(),
  district: Joi.string().max(100).optional(),
  city: Joi.string().max(100).optional(),
}).custom((value) => {
  // Validate required fields based on role
  if (value.role === 'freelancer') {
    const requiredFields = ['houseNumber', 'street', 'ward', 'district', 'city'];
    const missingFields = requiredFields.filter((field) => !value[field]);

    if (missingFields.length > 0) {
      throw new Error(`${missingFields.join(', ')} are required for freelancer`);
    }
  }

  return value;
});

export const loginSchema = Joi.object({
  emailOrPhone: Joi.string().required().messages({
    'string.empty': 'Email or phone is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().optional().messages({
    'string.empty': 'Refresh token is required',
  }),
});
