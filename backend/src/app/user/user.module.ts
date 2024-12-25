import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobModule } from '../../features/jobs/jobs.module';
import { CustomMailerModule } from 'src/providers';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { PostModule } from '@app/post/post.module';
import { User } from '@app/user/entities/user.entity';
import { CustomRepositoryModule } from '../../libs/typeorm-custom-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CustomRepositoryModule.forFeature([UserRepository]),
    forwardRef(() => PostModule),
    CustomMailerModule,
    JobModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
