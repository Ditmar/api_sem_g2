import { Request, Response, NextFunction } from 'express';
import HttpStateCodes from '../utils/http-state-codes';

export const ValidateFields = (req: Request, res: Response, next: NextFunction) => {
  const { title, author } = req.body
  
  const validFields = [ 'title', 'author' ];
  const valuesKeys = Object.keys(req.body);

  const missing = validFields.filter((field) => !valuesKeys.includes(field));

  const extra = valuesKeys.filter((key) => !validFields.includes(key));

  if (missing.length > 0) {
    return res.json({
      message:`Faltan los siguientes campos en la solicitud: ${missing.join(', ')}`, 
      status:HttpStateCodes.BAD_REQUEST});
  }
  if (extra.length > 0) {
    return res.json({message:`Campos no válidos en la solicitud: ${extra.join(', ')}`, status:HttpStateCodes.BAD_REQUEST});
  }

  if(!(/^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ\s_.,]{2,100}$/).test(title)){
    return res.json({message:`ingrese valores de A-Za-z0-9 de 2-100 caracteres en el campo title`,status:HttpStateCodes.BAD_REQUEST});
  }

  if(!(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s_.,]{2,50}$/).test(author)){
    return res.json({message:`ingrese valores de A-Za-z de 2-50 caracteres en el campo author`,status:HttpStateCodes.BAD_REQUEST});
  }
  
    next();
  };