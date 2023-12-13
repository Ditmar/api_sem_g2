import { Request, Response, NextFunction } from 'express';
import HttpStateCodes from '../utils/http-state-codes';
import { registerSchema } from '../schema/register-schema';

export const RegisterMiddleware = (request: Request, response: Response, next: NextFunction) => {
  
  const { error, value } = registerSchema.validate(request.body);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return response.status(HttpStateCodes.BAD_REQUEST).json({
      message:  `Error de validación: ${errorMessage}`,
    });
  }
  
  request.body = value;

  next();
};