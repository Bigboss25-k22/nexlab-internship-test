import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('Validating request body:', req.body);
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      console.log('Validation error:', error.details);
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    console.log('Validation passed, validated value:', value);
    req.body = value;
    next();
  };
};
