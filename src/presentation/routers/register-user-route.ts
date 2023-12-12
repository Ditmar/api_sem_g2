import express from 'express';
import HttpStateCodes from '../../utils/http-state-codes';
import NoSQLWrapper from '../../data/interfaces/data-sources/no-sql-wrapper';
import { RegisterMiddleware } from '../../middleware/middleware-register';
import { hash } from 'bcrypt';
import { userMessages } from '../../busines/messages';

export const RegisterRouter = (db: NoSQLWrapper) => {
    // routing
    const router = express.Router();
    
    router.post('/auth/register',RegisterMiddleware ,async(request, response) => {
        let user = request.body;
        const emailExists = await db.FindUserByEmail(user.email)
        if(emailExists){
            return response.status(HttpStateCodes.BAD_REQUEST).json({
                message: `${userMessages.userExists}`});
        }
        user.password = await hash(request.body.password,10)
        const resultDb = await db.CreateUser(user);
        return response.status(HttpStateCodes.OK).json({response: resultDb});
    })
    return router;
}
