import express from 'express';
import HttpStateCodes from '../../utils/http-state-codes';
import NoSQLWrapper from '../../data/interfaces/data-sources/no-sql-wrapper';
import { authenticateToken } from '../../utils/middleware';
const YearRouter = (db: NoSQLWrapper) => {
    // routing
    const router = express.Router();
    router.get('/year', authenticateToken, async(request, response) => {
        const resultDbList = await db.FindAllYears();
        response.status(HttpStateCodes.OK).json({response: resultDbList});
    });
    router.post('/year', authenticateToken, async(request, response) => {
        const year = request.body;
        const resultDb = await db.CreateYear(year);
        response.status(HttpStateCodes.OK).json({response: resultDb});
    })
    return router;
}
export default YearRouter;