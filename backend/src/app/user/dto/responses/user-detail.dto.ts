import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from '@app/entity';

export class BasicUserInfoDto extends PartialType(OmitType(User, ['posts'])) {}

export class UserDetailDto extends BasicUserInfoDto {}
