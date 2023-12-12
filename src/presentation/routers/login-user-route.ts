import express from 'express';
import HttpStateCodes from '../../utils/http-state-codes';
import NoSQLWrapper from '../../data/interfaces/data-sources/no-sql-wrapper';
import { compare } from 'bcrypt';
import { LoginMiddleware } from '../../middleware/middleware-login';
import jwt,{ JwtPayload }   from 'jsonwebtoken';
import { RefreshTokenMiddleware } from '../../middleware/middleware-refresh-token';
import { RefreshTokenMessages, userMessages } from '../../busines/messages';

export const LoginRouter = (db: NoSQLWrapper) => {
    // routing
    const router = express.Router();
    
    router.post('/auth/login',LoginMiddleware ,async(request, response) => {
        const {email, password} = request.body;
        
        const findEmail = await db.FindUserByEmail(email);
        if(!findEmail){
          return response.status(HttpStateCodes.BAD_REQUEST).json({
            message: `${userMessages.incorrectCredentials}` });
        }

        const checkPassword = await compare(password, findEmail.password);
        if(!checkPassword){
          return response.status(HttpStateCodes.BAD_REQUEST).json({
            message:`${userMessages.incorrectCredentials}` });
        }

        const payload = {id:findEmail._id}

        const token = await jwt.sign(
            payload,`${process.env.TOKEN_SECRET || 'tokenSecret'}`,
            {
              expiresIn: `${process.env.TOKEN_EXPIRES || '5h'}`
            }
          )
          return response.status(HttpStateCodes.CREATED).json({message: `${userMessages.userLogin}`,token});
        })


    router.post('/refresh-token',RefreshTokenMiddleware ,async(request, response) => {
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
      return response.status(HttpStateCodes.UNAUTHORIZED).json({message:`${RefreshTokenMessages.tokenDinied}`});
    }
  })


    return router;
}

interface User {
  id: string;
}