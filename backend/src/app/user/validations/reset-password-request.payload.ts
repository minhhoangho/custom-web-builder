import { EMAIL_MAX_LENGTH } from '@common/constants';
import { BaseValidation } from '@common/validations';
import Joi from 'joi';

export class ResetPasswordRequestPayloadValidation extends BaseValidation {
  getSchema(): Joi.ObjectSchema {
    return Joi.object().keys({
      email: Joi.string().email().max(EMAIL_MAX_LENGTH).required(),
    });
  }
}
