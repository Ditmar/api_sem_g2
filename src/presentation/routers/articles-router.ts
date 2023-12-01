import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import HttpStateCodes from '../../utils/http-state-codes';
import NoSQLWrapper from '../../data/interfaces/data-sources/no-sql-wrapper';
import { ValidateFields } from '../../interceptors/Validate-fields';
import { AccessControlMiddleware, ValidateAuthentication } from '../../interceptors/Access-auth-validate';

export const ArticlesRouter = (db: NoSQLWrapper) => {
    // routing
    const router = express.Router();

      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = 'uploads';
      
          fs.access(uploadPath, (error) => {
            if (error) {
              fs.mkdir(uploadPath, (err) => {
                if (err) {
                  console.error('Error al crear el directorio de destino:', err);
                  cb(err, '');
                } else {
                  cb(null, uploadPath);
                }
              });
            } else {
              cb(null, uploadPath);
            }
          });
        },
        filename: (req, file, cb) => {
          const fileName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
          cb(null, fileName);
        },
      });

  const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

  router.post('/articles/publish', ValidateAuthentication, AccessControlMiddleware(['administrador', 'revisor']), upload.single('file'), ValidateFields, async (req: Request, res: Response) => {
    if (!req.file || req.file.mimetype !== 'application/pdf' || req.file.size > 20 * 1024 * 1024) {
      return res.status(HttpStateCodes.BAD_REQUEST).json({ error: 'Seleccione un archivo válido', status: HttpStateCodes.BAD_REQUEST });
    }
  
    const createArticle = req.body;
    const publicationDate = new Date();
    const filePath = req.file.path;
  
    const file = filePath;
  
    const articleData = { ...createArticle, publicationDate, file };
  
    try {
      const resultDb = await db.CreateArticle(articleData);
  
      return res.status(HttpStateCodes.OK).json({ response: resultDb });
    } catch (error) {
      console.error('Error al insertar el artículo en la base de datos:', error);
      return res.status(HttpStateCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error interno del servidor', status: HttpStateCodes.INTERNAL_SERVER_ERROR });
    }
  });

  router.get('/articles/publish', ValidateAuthentication, AccessControlMiddleware(['administrador', 'revisor']), async (req, res) => {
    try {
      const resultDbList = await db.FindAllArticle();

      const responseList = resultDbList.map(article => {
        return {
          _id:article._id,
          title:article.title,
          author:article.author,
          publicationDate:article.publicationDate,
          file: article.file
        };
      });

      return res.status(HttpStateCodes.OK).json({ response: responseList });
    } catch (error) {
      console.error('Error al buscar los artículos en la base de datos:', error);
      return res.status(HttpStateCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error interno del servidor', status: HttpStateCodes.INTERNAL_SERVER_ERROR });
    }
  });
 
  router.get('/articles/publish/:id', ValidateAuthentication, AccessControlMiddleware(['administrador', 'revisor']), async (req, res) => {
    try {
      const id = req.params.id;
      const resultDb = await db.FindArticleById(id);
  
      if (!resultDb) {
        return res.status(HttpStateCodes.NOT_FOUND).json({ error: 'Artículo no encontrado', status: HttpStateCodes.NOT_FOUND });
      }
  
      const response = {
        _id:resultDb._id,
        title:resultDb.title,
        author:resultDb.author,
        publicationDate:resultDb.publicationDate,
        file: resultDb.file 
      };
  
      return res.status(HttpStateCodes.OK).json({ response });
    } catch (error) {
      console.error('Error al buscar el artículo en la base de datos:', error);
      return res.status(HttpStateCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error interno del servidor', status: HttpStateCodes.INTERNAL_SERVER_ERROR });
    }
  });

  
  router.put('/articles/publish/:id', ValidateAuthentication, AccessControlMiddleware(['administrador', 'revisor']), upload.single('file'), ValidateFields, async (req, res) => {
    const id = req.params.id;
    const findArticle = await db.FindArticleById(id);
  
    if (!findArticle) {
      return res.status(HttpStateCodes.BAD_REQUEST).json({ error: 'No se encontró el artículo solicitado', status: HttpStateCodes.BAD_REQUEST });
    }
  
    let updatedData = req.body;
  
    if (req.file) {
      if (req.file.mimetype !== 'application/pdf' || req.file.size > 20 * 1024 * 1024) {
        return res.status(HttpStateCodes.BAD_REQUEST).json({ error: 'Seleccione un archivo PDF válido', status: HttpStateCodes.BAD_REQUEST });
      }
  
      const filePath = req.file.path;
      const newFileName = `file-updated-${Date.now()}.pdf`; 
      const newPath = path.join(newFileName); 
      const file = filePath;
      fs.renameSync(filePath, newPath);
  
      updatedData = { ...updatedData, file };
    }
  
    const publicationDate = new Date();
    updatedData = { ...updatedData, publicationDate };
  
    try {
      const resultDbList = await db.UpdateArticle(id, updatedData);
  
      return res.status(HttpStateCodes.OK).json({ response: resultDbList });
    } catch (error) {
      console.error('Error al actualizar el artículo en la base de datos:', error);
      return res.status(HttpStateCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error interno del servidor', status: HttpStateCodes.INTERNAL_SERVER_ERROR });
    }
  });
  
  
  

  router.delete('/articles/publish/:id', ValidateAuthentication, AccessControlMiddleware(['administrador', 'revisor']), async (req, res) => {
    const id = req.params.id;
  
    try {
      const articleToDelete = await db.FindArticleById(id);
  
      if (!articleToDelete) {
        return res.status(HttpStateCodes.NOT_FOUND).json({ error: 'Artículo no encontrado', status: HttpStateCodes.NOT_FOUND });
      }
  
      await db.DeleteArticle(id);
  
      const pdfPath = path.join(articleToDelete.file);
  
      fs.unlinkSync(pdfPath);
  
      return res.status(HttpStateCodes.OK).json({ message: 'Eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el artículo de la base de datos:', error);
      return res.status(HttpStateCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error interno del servidor', status: HttpStateCodes.INTERNAL_SERVER_ERROR });
    }
  });
  
    return router;
}