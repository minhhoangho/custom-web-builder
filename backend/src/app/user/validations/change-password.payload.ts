import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@common/constants';
import { BaseValidation } from '@common/validations';
import Joi from 'joi';

export class ChangePasswordPayloadValidation extends BaseValidation {
  getSchema(): Joi.ObjectSchema {
    return Joi.object().keys({
      credentialToken: Joi.string().optional(),
      isLoggedIn: Joi.boolean().required(),
      password: Joi.string()
        .max(PASSWORD_MAX_LENGTH)
        .min(PASSWORD_MIN_LENGTH)
        .required(),
    });
  }
}
