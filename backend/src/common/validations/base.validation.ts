import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { includes } from 'lodash';
import { JoiValidationError } from 'src/errors/joi-error';
import { AnyObject } from '@common/interfaces';

@Injectable()
export abstract class BaseValidation implements PipeTransform {
  public schema: ObjectSchema;

  abstract getSchema(): ObjectSchema;

  transform(value: AnyObject, metadata: ArgumentMetadata) {
    if (!includes(['body', 'query'], metadata.type)) return value;

    this.schema = this.getSchema();
    const { error, value: validatedValue } = this.schema.validate(value, {
      abortEarly: false,
    });
    if (error) {
      throw new JoiValidationError(error.details);
    }

    return validatedValue;
  }
}
