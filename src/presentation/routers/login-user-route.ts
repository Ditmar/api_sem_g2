import express from 'express';
import HttpStateCodes from '../../utils/http-state-codes';
import NoSQLWrapper from '../../data/interfaces/data-sources/no-sql-wrapper';
import { compare } from 'bcrypt';
import { LoginMediationsw } from '../../mediationsw/mediationsw-login';
import jwt,{ JwtPayload }   from 'jsonwebtoken';
import { RefreshTokenMediationsw } from '../../mediationsw/mediationsw-refresh-token';
export const LoginUserRouter = (db: NoSQLWrapper) => {
    // routing
    const router = express.Router();
    
    router.post('/login',LoginMediationsw ,async(request, response) => {
        const {email, password} = request.body;
        
        const findEmail = await db.FindUserByEmail(email);
        if(!findEmail){
          return response.json({
            message:'credenciales incorrectas',status:HttpStateCodes.BAD_REQUEST});
        }

        const checkPassword = await compare(password, findEmail.password);
        if(!checkPassword){
          return response.json({
            message:'credenciales incorrectas',status:HttpStateCodes.BAD_REQUEST});
        }

        const payload = {id:findEmail._id}

        const token = await jwt.sign(
            payload,`${process.env.TOKEN_SECRET || 'tokenSecret'}`,
            {
              expiresIn: `${process.env.TOKEN_EXPIRES || '5h'}`
            }
          )
        return response.json({message:"logueo exitoso",token});
    })


    router.post('/refresh-token',RefreshTokenMediationsw ,async(request, response) => {
      const {refreshToken} = request.body;
      try {
        const decodedToken: any | JwtPayload = jwt.verify(refreshToken, `${process.env.TOKEN_SECRET || 'tokenSecret'}`);
        const findUser = await db.FindUserById(decodedToken.id);
        const payload = {id:findUser._id}
        const token = await jwt.sign(
          payload,`${process.env.TOKEN_SECRET || 'tokenSecret'}`,
          {
            expiresIn: `${process.env.TOKEN_EXPIRES || '5h'}`
          }
        )
      return response.json({token});
      
    } catch (error) {
        return response.json({message:"acceso no autorizado",status:HttpStateCodes.UNAUTHORIZED});
      }
  })


    return router;
}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NWFjNzg0MjAzODliMjE2MWZlOTM5YiIsImlhdCI6MTcwMDQ0OTg0OSwiZXhwIjoxNzAwNTM2MjQ5fQ.oWbeaQvAfwhvQMfp67Ihf99NlMmIMzAnok7xUR-UeVQ

interface User {
  id: string;
}