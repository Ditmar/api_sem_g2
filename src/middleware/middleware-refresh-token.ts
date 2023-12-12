import { Request, Response, NextFunction } from 'express';
import HttpStateCodes from '../utils/http-state-codes';
import { resfreshTokenSchema } from '../schema/refresh-token-schema';

export const RefreshTokenMiddleware = (request: Request, response: Response, next: NextFunction) => {

  const { error, value } = resfreshTokenSchema.validate(request.body);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return response.status(HttpStateCodes.BAD_REQUEST).json({
      message:  `Error de validación: ${errorMessage}`,
    });
  }
  
  request.body = value;
  next();
};