import { User } from '@app/entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { MysqlDataSource } from '@database/typeorm.config';
import { DefaultUserData } from '@database/data/default-user.data';

export default class CreateUser implements Seeder {
  private async createDefaultUsers() {
    await MysqlDataSource.getRepository(User)
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(DefaultUserData)
      .orUpdate(['email'], ['email'], { skipUpdateIfNoValuesChanged: true })
      .execute();
  }

  public async run(factory: Factory): Promise<any> {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }
    await this.createDefaultUsers();
    await factory(User)().createMany(100);
  }
}
