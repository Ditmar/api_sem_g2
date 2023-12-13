import Joi from 'joi';
import { LoginMessages, RegisterMessages } from '../busines/messages';

export const registerSchema = Joi.object({
  name: Joi.string().pattern(/^[a-zA-Z0-9]{2,50}$/)
    .required()
    .messages({
      'string.pattern.base': `${RegisterMessages.nameIncorect}`  ,
      'any.required': `${RegisterMessages.nameRequired}`,
    }),
  
  email: Joi.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,20}$/)
    .required()
    .messages({
      'string.pattern.base': `${LoginMessages.emailIncorect}`  ,
      'any.required':  `${LoginMessages.emailRequired}`,
    }),
  
  password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/)
    .required()
    .messages({
      'string.pattern.base':  `${LoginMessages.passwordIncorect}`,
      'any.required':  `${LoginMessages.passwordRequired}`,
    }),
});