import { Request, Response, NextFunction } from 'express';
import HttpStateCodes from '../utils/http-state-codes';

export const ValidateAuthentication = (req: Request, res: Response, next: NextFunction) => {

  const authorizationHeader = req.headers.authorization;
  
  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    const token = authorizationHeader.split(' ')[1];
    if(token){
      (req as MyRequest).rol = ['administrador', 'revisor'];
      return next();
    }
    return res.json({message:`usuario no autenticadoo`,status:HttpStateCodes.UNAUTHORIZED});
  } else {
    return res.json({message:`usuario no autenticado`,status:HttpStateCodes.UNAUTHORIZED});
  }
  
    
  };

  interface MyRequest extends Request {
    rol?: string[];
  }
  

  export const AccessControlMiddleware = (allowedRoles: string[]) => {
    return (req: MyRequest, res: Response, next: NextFunction) => {
      const rol = req.rol;
  
      if (!rol) {
        return res.status(HttpStateCodes.UNAUTHORIZED).json({ error: 'No autorizado' });
      }
  
      if (!rol.some(role => allowedRoles.includes(role))) {
        return res.status(HttpStateCodes.FORBIDDEN).json({ error: 'Acceso prohibido' });
      }
  
      next();
    };
  };