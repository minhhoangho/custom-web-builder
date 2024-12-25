import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } from '@common/constants';
import Joi from 'joi';
import { BaseValidation } from './base.validation';

export class AuthValidation extends BaseValidation {
  getSchema(): Joi.ObjectSchema {
    return Joi.object().keys({
      email: Joi.string().trim().email().max(EMAIL_MAX_LENGTH).required(),
      password: Joi.string().trim().max(PASSWORD_MAX_LENGTH).required(),
      rememberMe: Joi.boolean().optional()
    });
  }
}
