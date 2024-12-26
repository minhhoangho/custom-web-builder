import { Seeder } from 'typeorm-seeding';
import { MysqlDataSource } from '@database/typeorm.config';
import { Role, Category } from '@app/entity';
import { MasterCategoryData } from '@database/data/category.data';

export default class InitSystemData implements Seeder {
  async initRoles() {
    const roleData = [
      {
        name: 'Admin',
        key: 'admin',
      },
      {
        name: 'Moderator',
        key: 'moderator',
      },
      {
        name: 'Normal user',
        key: 'normal_user',
      },
    ];

    await MysqlDataSource.getRepository(Role)
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values(roleData)
      .orUpdate(['name', 'key'], ['key'], { skipUpdateIfNoValuesChanged: true })
      .execute();
  }

  async initCategories() {
    await MysqlDataSource.getRepository(Category)
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values(MasterCategoryData)
      .orUpdate(['name', 'description'], ['id'], {
        skipUpdateIfNoValuesChanged: true,
      })
      .execute();
  }

  public async run(): Promise<void> {
    if (!MysqlDataSource.isInitialized) {
      await MysqlDataSource.initialize();
    }

    await this.initRoles();
    await this.initCategories();
  }
}
