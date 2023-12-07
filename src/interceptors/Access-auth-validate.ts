import { Request, Response, NextFunction } from 'express';
import HttpStateCodes from '../utils/http-state-codes';
import { MyRequest } from '../tools/utils';
import { rolMessages } from '../busines/messages';


  export const AccessControlMiddleware = (allowedRoles: string[]) => {
    return (request: MyRequest, response: Response, next: NextFunction) => {
      const rol = request.rol;
  
      if (!rol) {
        return response.status(HttpStateCodes.UNAUTHORIZED).json({ error: rolMessages.rolMissing });
      }
  
      if (!rol.some(role => allowedRoles.includes(role))) {
        return response.status(HttpStateCodes.FORBIDDEN).json({ error:rolMessages.rolSome });
      }
  
      next();
    };
  };