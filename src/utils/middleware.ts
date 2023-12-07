import NoSQLWrapper from '../data/interfaces/data-sources/no-sql-wrapper';
import jwt from 'jsonwebtoken';
import HttpStateCodes from './http-state-codes';

  const authenticateToken = (req: any, res: any, next: any) => {
    const secretKey = process.env.secret || 'seminario'
    const token = req.header('Authorization');
    if (!token) return res.status(HttpStateCodes.UNAUTHORIZED).json({ error: 'Acceso no autorizado', status: HttpStateCodes.UNAUTHORIZED });

    jwt.verify(token, secretKey, (err: any, user: any) => {
      if (err) return res.status(HttpStateCodes.FORBIDDEN).json({ error: 'Token no válido', status: HttpStateCodes.FORBIDDEN });

      req.user = user;
      next();
    });
  };
  export {authenticateToken}