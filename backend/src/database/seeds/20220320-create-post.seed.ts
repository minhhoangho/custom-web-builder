import { Post } from '@app/entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { MysqlDataSource } from '@database/typeorm.config';

export default class CreatePost implements Seeder {
  public async run(factory: Factory): Promise<void> {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }
    await factory(Post)().createMany(50);
  }
}
