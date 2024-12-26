import * as _ from 'lodash';
import { MailProducer } from '../../features/jobs/producers/mail.producer';
import { Auth } from '@common/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { PaginationParamDto } from '@common/dtos/pagination-param.dto';
import { UserRepository } from '@app/user/user.repository';
import { CreateUserDto } from '@app/user/dto/requests/create-user.dto';
import { UpdateUserDto } from '@app/user/dto/requests/update-user.dto';
import { ListUserPaginateDto } from '@app/user/dto/responses/list-user.dto';
import {
  BasicUserInfoDto,
  UserDetailDto,
} from '@app/user/dto/responses/user-detail.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private userRepository: UserRepository,
    public userService: UserService,
    public mailProducer: MailProducer,
  ) {}

  @Auth()
  @Post('/')
  @HttpCode(HttpStatus.OK)
  create(@Body() payload: CreateUserDto): Promise<BasicUserInfoDto> {
    return this.userService.create(payload);
  }

  @Auth()
  @Get('/')
  @HttpCode(HttpStatus.OK)
  listPaginate(
    @Query() queryParams: PaginationParamDto,
  ): Promise<ListUserPaginateDto> {
    return this.userService.listPaginate(queryParams);
  }

  @Auth()
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  retrieve(@Param('id', ParseIntPipe) id: number): Promise<UserDetailDto> {
    return this.userService.detail(id);
  }

  @Auth()
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ): Promise<BasicUserInfoDto> {
    return this.userService.update(id, payload);
  }

  @Auth()
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.remove(id);
  }

  @Put('/mail')
  @HttpCode(HttpStatus.NO_CONTENT)
  sendDummyEmail() {
    Logger.log('Dummy emails ....');
    _.range(100).map(() =>
      this.mailProducer.sendMail(Math.random().toString(36).slice(6)),
    );
  }
}
