import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import HttpStateCodes from '../../utils/http-state-codes';
import NoSQLWrapper from '../../data/interfaces/data-sources/no-sql-wrapper';
import { ValidateFields } from '../../interceptors/Validate-fields';
import { AccessControlMiddleware } from '../../interceptors/Access-auth-validate';
import { ValidateAuthentication } from '../../tools/utils';
import { articleMessages, serverMessages } from '../../busines/messages';

export const ArticlesRouter = (db: NoSQLWrapper) => {
    // routing
    const router = express.Router();

      const storage = multer.diskStorage({
        destination: (request, file, cb) => {
          const uploadPath = process.env.API_UPLOAD_DIR || 'uploads';
      
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
        filename: (request, file, cb) => {
          const fileName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
          cb(null, fileName);
        },
      });

  const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

  router.post('/articles/publish', ValidateAuthentication, AccessControlMiddleware(['administrador', 'revisor']), upload.single('file'), ValidateFields, async (request: Request, response: Response) => {
    if (!request.file || request.file.mimetype !== 'application/pdf' || request.file.size > 20 * 1024 * 1024) {
      return response.status(HttpStateCodes.BAD_REQUEST).json({ error:articleMessages.pdfRequired});
    }
  
    const createArticle = request.body;
    const publicationDate = new Date();
    const filePath = request.file.path;
  
    const file = filePath;
  
    const articleData = { ...createArticle, publicationDate, file };
  
    try {
      const resultDb = await db.CreateArticle(articleData);
  
      return response.status(HttpStateCodes.OK).json({ response: resultDb });
    } catch (error) {
      console.error('Error al insertar el artículo en la base de datos:', error);
      return response.status(HttpStateCodes.INTERNAL_SERVER_ERROR).json({ error: serverMessages.serverError});
    }
  });

  router.get('/articles/publish', ValidateAuthentication, AccessControlMiddleware(['administrador', 'revisor']), async (request, response) => {
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

      return response.status(HttpStateCodes.OK).json({ response: responseList });
    } catch (error) {
      console.error('Error al buscar los artículos en la base de datos:', error);
      return response.status(HttpStateCodes.INTERNAL_SERVER_ERROR).json({ error:serverMessages.serverError});
    }
  });
 
  router.get('/articles/publish/:id', ValidateAuthentication, AccessControlMiddleware(['administrador', 'revisor']), async (request, response) => {
    try {
      const id = request.params.id;
      const resultDb = await db.FindArticleById(id);
  
      if (!resultDb) {
        return response.status(HttpStateCodes.NOT_FOUND).json({ error:articleMessages.articleFind});
      }
  
      const res = {
        _id:resultDb._id,
        title:resultDb.title,
        author:resultDb.author,
        publicationDate:resultDb.publicationDate,
        file: resultDb.file 
      };
  
      return response.status(HttpStateCodes.OK).json({ response });
    } catch (error) {
      console.error('Error al buscar el artículo en la base de datos:', error);
      return response.status(HttpStateCodes.INTERNAL_SERVER_ERROR).json({ error:serverMessages.serverError });
    }
  });

  
  router.put('/articles/publish/:id', ValidateAuthentication, AccessControlMiddleware(['administrador', 'revisor']), upload.single('file'), ValidateFields, async (request, response) => {
    const id = request.params.id;
    const findArticle = await db.FindArticleById(id);
  
    if (!findArticle) {
      return response.status(HttpStateCodes.BAD_REQUEST).json({ error: articleMessages.articleFind });
    }
  
    let updatedData = request.body;
  
    if (request.file) {
      if (request.file.mimetype !== 'application/pdf' || request.file.size > 20 * 1024 * 1024) {
        return response.status(HttpStateCodes.BAD_REQUEST).json({ error:articleMessages.pdfRequired});
      }
  
      const filePath = request.file.path;
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
  
      return response.status(HttpStateCodes.OK).json({ response: resultDbList });
    } catch (error) {
      console.error('Error al actualizar el artículo en la base de datos:', error);
      return response.status(HttpStateCodes.INTERNAL_SERVER_ERROR).json({ error:serverMessages.serverError });
    }
  });
  
  
  

  router.delete('/articles/publish/:id', ValidateAuthentication, AccessControlMiddleware(['administrador', 'revisor']), async (request, response) => {
    const id = request.params.id;
  
    try {
      const articleToDelete = await db.FindArticleById(id);
  
      if (!articleToDelete) {
        return response.status(HttpStateCodes.NOT_FOUND).json({ error:articleMessages.articleFind });
      }
  
      await db.DeleteArticle(id);
  
      const pdfPath = path.join(articleToDelete.file);
  
      fs.unlinkSync(pdfPath);
  
      return response.status(HttpStateCodes.OK).json({ message: articleMessages.articleDeleted });
    } catch (error) {
      console.error('Error al eliminar el artículo de la base de datos:', error);
      return response.status(HttpStateCodes.INTERNAL_SERVER_ERROR).json({ error: serverMessages.serverError });
    }
  });
  
    return router;
}