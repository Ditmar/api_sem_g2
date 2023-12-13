import Joi from 'joi';
import { LoginMessages } from '../busines/messages';

export const loginSchema = Joi.object({
  email: Joi.string().pattern(new RegExp('^[^\s@]+@[^\s@]+\.[^\s@]{2,20}$'))
    .required()
    .messages({
      'string.pattern.base': `${LoginMessages.emailIncorect}` ,
      'any.required': `${LoginMessages.emailRequired}`,
    }),
  
  password: Joi.string().pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,20}$'))
    .required()
    .messages({
      'string.pattern.base': `${LoginMessages.passwordIncorect}`,
      'any.required': `${LoginMessages.passwordRequired}`,
    }),
});