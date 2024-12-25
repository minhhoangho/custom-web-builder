import { ErrorCode } from '@common/constants';
import { ApiError } from 'src/errors';
import { ArgumentMetadata, HttpStatus, ParseIntPipe } from '@nestjs/common';

export class ParseIdPipe extends ParseIntPipe {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: string, _metadata: ArgumentMetadata): Promise<number> {
    const isNumeric =
      ['string', 'number'].includes(typeof value) &&
      !Number.isNaN(Number(value)) &&
      Number.isFinite(Number(value));
    if (!isNumeric) {
      throw new ApiError({
        title: __('errors.title.system'),
        code: ErrorCode.BAD_REQUEST,
        status: HttpStatus.BAD_REQUEST,
        message: __('errors.messages.numericString'),
      });
    }
    return parseInt(value, 10);
  }
}
