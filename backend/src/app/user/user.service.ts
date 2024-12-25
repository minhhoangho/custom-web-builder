import { Injectable } from '@nestjs/common';
import { User } from '@app/entity';
import { MailerProvider } from 'src/providers';
import { UserRepository } from './user.repository';
import { PaginationParamDto } from '@common/dtos/pagination-param.dto';
import { IPaginationEntity } from '@common/interfaces';
import { FindWithPaginationBuilderOptions } from '@common/constants/types';
import { CreateUserDto } from '@app/user/dto/requests/create-user.dto';
import { UpdateUserDto } from '@app/user/dto/requests/update-user.dto';
import { BadRequestError } from '../../errors';
import { ErrorCode } from '@common/constants';
import { UpdateResult } from 'typeorm';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailerProvider: MailerProvider,
  ) {}

  findOneById(id: number): Promise<User> {
    return this.userRepository.findOneByIdOrFail(id);
  }

  detail(id: number): Promise<User> {
    return this.userRepository.findOneWithRelations({
      where: { id },
      relations: ['role'],
    });
  }

  async listPaginate(
    query: PaginationParamDto,
  ): Promise<IPaginationEntity<Partial<User>>> {
    const options: FindWithPaginationBuilderOptions<User> = {
      // select: [
      //   'id',
      //   'email',
      //   'firstName',
      //   'lastName',
      //   'avatar',
      //   'createdAt',
      //   'updatedAt',
      // ],
      relations: ['role'],
      limit: query.limit,
      offset: query.offset,
    };

    return this.userRepository.findWithPagination(options);
  }

  async create(payload: CreateUserDto): Promise<User> {
    const email = payload.email;
    const existedUser = await this.userRepository.findOne({ where: { email } });
    if (existedUser)
      throw new BadRequestError(ErrorCode.BAD_REQUEST, {
        message: 'User with email existed',
      });
    return this.userRepository.create(payload).save({ reload: true });
  }

  async update(id: number, payload: UpdateUserDto): Promise<User> {
    const user: User = await this.userRepository.findOneByIdOrFail(id);
    if (payload.email) {
      const existedUser: User = await this.userRepository.findOne({
        where: { email: payload.email },
      });
      if (existedUser && existedUser.id !== user.id) {
        throw new BadRequestError(ErrorCode.BAD_REQUEST, {
          message: 'User with email existed',
        });
      }
    }
    await this.userRepository.findOneByIdAndUpdate(id, payload);
    return this.userRepository.findOneByIdOrFail(id);
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.userRepository.softDelete(id);
  }
}
