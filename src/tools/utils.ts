import { Request, Response, NextFunction } from 'express';
import HttpStateCodes from '../utils/http-state-codes';
import { parseAuthToken } from './parseToken';
import { authMessages } from '../busines/messages';

export const ValidateAuthentication = (request: Request, response: Response, next: NextFunction) => {

  const authorizationHeader = request.headers.authorization;
  
  
  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    const token = parseAuthToken(request.headers.authorization);
    if(token){
      (request as MyRequest).rol = ['administrador', 'revisor'];
      return next();
    }
    return response.status(HttpStateCodes.UNAUTHORIZED).json({mesage:authMessages.tokenInvalid});
  } else {
    return response.status(HttpStateCodes.UNAUTHORIZED).json({message: authMessages.tokenMissing});
  }
    
  };

export interface MyRequest extends Request {
    rol?: string[];
  }
  