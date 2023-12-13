import Joi from 'joi';
import { RefreshTokenMessages } from '../busines/messages';

export const resfreshTokenSchema = Joi.object({
    refreshToken: Joi.string()
    .required()
    .messages({
      'string.pattern.base': `${RefreshTokenMessages.tokenIncorect} `,
      'any.required': `${RefreshTokenMessages.tokenRequired} `,
    }),
  

});