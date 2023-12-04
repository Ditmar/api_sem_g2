import { Request, Response, NextFunction } from 'express';
import HttpStateCodes from '../utils/http-state-codes';

// Vamos a definir nuestro mediationsw
export const RefreshTokenMediationsw = (req: Request, res: Response, next: NextFunction) => {
  
  const expectedFields = ['refreshToken'];
  const validKeys = Object.keys(req.body);

  const missingFields = expectedFields.filter((field) => !validKeys.includes(field));

  const extraFields = validKeys.filter((key) => !expectedFields.includes(key));

  if (missingFields.length > 0) {
    return res.json({
      message:`Faltan los siguientes campos en la solicitud: ${missingFields.join(', ')}`, 
      status:HttpStateCodes.BAD_REQUEST});
  }

  if (extraFields.length > 0) {
    return res.json({message:`Campos no válidos en la solicitud: ${extraFields.join(', ')}`, status:HttpStateCodes.BAD_REQUEST});
 }

  next();
};