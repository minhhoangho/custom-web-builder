import { JoiValidationError } from 'src/errors/joi-error';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { includes } from 'lodash';

@Injectable()
export abstract class BaseValidation implements PipeTransform {
  public schema: ObjectSchema;

  abstract getSchema(): ObjectSchema;

  transform(value: any, metadata: ArgumentMetadata) {
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
