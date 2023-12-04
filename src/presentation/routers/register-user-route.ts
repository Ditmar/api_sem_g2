import express from 'express';
import HttpStateCodes from '../../utils/http-state-codes';
import NoSQLWrapper from '../../data/interfaces/data-sources/no-sql-wrapper';
import { RegisterMediationsw } from '../../mediationsw/mediationsw-register';
import { hash } from 'bcrypt';

export const RegisterUserRouter = (db: NoSQLWrapper) => {
    // routing
    const router = express.Router();
    
    router.post('/register',RegisterMediationsw ,async(request, response) => {
        let user = request.body;
        const emailExists = await db.FindUserByEmail(user.email)
        if(emailExists){
          return response.json({
            message:'el email ya se encuentra registrado',status:HttpStateCodes.BAD_REQUEST});
        }
        user.password = await hash(request.body.password,10)
        const resultDb = await db.CreateUser(user);
        return response.status(HttpStateCodes.OK).json({response: resultDb});
    })
    return router;
}
