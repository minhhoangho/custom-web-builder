import { BaseValidation } from '@common/validations';
import Joi from 'joi';

export class CreateUserPayloadValidation extends BaseValidation {
  getSchema(): Joi.ObjectSchema {
    return Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string()
        .max(127)
        .email({ tlds: { allow: false } })
        .required(),
    });
  }
}
