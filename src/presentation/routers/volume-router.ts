import express, { response } from 'express';
import HttpStateCodes from '../../utils/http-state-codes';
import NoSQLWrapper from '../../data/interfaces/data-sources/no-sql-wrapper';
import { authenticateToken } from '../../utils/middleware';

const VolumeRouter = (db: NoSQLWrapper) => {
    // routing
    const router = express.Router();
    router.get('/volumes/', authenticateToken, async(request:any, response) => {
      const { page, limit} = request.query;
        const resultDbList = await db.FindAllVolumes(page, limit);
        response.status(HttpStateCodes.OK).json({response: resultDbList});
    });
    router.post('/volume', authenticateToken,  async(request, response) => {
        const volume = request.body;
        const resultDb = await db.CreateVolume(volume);
        response.status(HttpStateCodes.OK).json({response: resultDb});
    })
    
    
    router.get('/volumes/:year', authenticateToken, async (request:any, res) => {
        try {
          const {year,page,limit} = request
          const resultDb = await db.FindAllVolumeByYear(year,page,limit,);
      
          if (!resultDb) {
            return res.status(HttpStateCodes.NOT_FOUND).json({ error: 'Volumen no encontrado', status: HttpStateCodes.NOT_FOUND });
          }
      
          const response = resultDb.map((item: any) => {
            return {
              id: item._id,
              year: item.year,
              title: item.title,
              coverImage: item.coverImage,
              metadata: item.metadata,
              author: item.author,
              genre: item.genre
            } 
          });
      
          return res.status(HttpStateCodes.OK).json({ response });
        } catch (error) {
          console.error('Error al buscar el volumen en la base de datos:', error);
          return res.status(HttpStateCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error interno del servidor', status: HttpStateCodes.INTERNAL_SERVER_ERROR });
        }
    });

    return router;

    

}
export default VolumeRouter;