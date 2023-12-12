import { Request, Response, NextFunction } from 'express';
import HttpStateCodes from '../utils/http-state-codes';
import { loginSchema } from '../schema/login-schema';

export const LoginMiddleware = (request: Request, response: Response, next: NextFunction) => {

  const { error, value } = loginSchema.validate(request.body);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return response.status(HttpStateCodes.BAD_REQUEST).json({
      message:  `Error de validación: ${errorMessage}`,
    });
  }
  
  request.body = value;
  next();
};