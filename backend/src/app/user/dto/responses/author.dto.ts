import { PartialType, PickType } from '@nestjs/swagger';
import { User } from '@app/entity';

export class AuthorInfo extends PartialType(
  PickType(User, ['id', 'firstName', 'lastName', 'email', 'avatar']),
) {}
