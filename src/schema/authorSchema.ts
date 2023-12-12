import Joi from 'joi';

export const authorSchema = Joi.object({
  title: Joi.string().pattern(new RegExp('^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ\s_.,]{2,100}$'))
    .required()
    .messages({
      'string.pattern.base': 'Ingrese valores de A-Za-z0-9 de 2-100 caracteres en el campo title',
      'any.required': 'El campo title es obligatorio',
    }),
  
  author: Joi.string().pattern(new RegExp('^[A-Za-záéíóúÁÉÍÓÚñÑ\s_.,]{2,50}$'))
    .required()
    .messages({
      'string.pattern.base': 'Ingrese valores de A-Za-záéíóúÁÉÍÓÚñÑ de 2-50 caracteres en el campo author',
      'any.required': 'El campo author es obligatorio',
    }),
});
