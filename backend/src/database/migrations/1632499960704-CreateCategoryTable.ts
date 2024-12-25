import { MigrationHelper } from 'src/utils/migration.helper';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCategoriesTable1632499960704 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          MigrationHelper.intIdPrimary(),
          MigrationHelper.varchar({ name: 'name', isNullable: false }),
          MigrationHelper.text({ name: 'description' }),
          MigrationHelper.text({ name: 'image' }),
          ...MigrationHelper.timestampsWithDelete(),
          ...MigrationHelper.userInteractionFieldsWithSoftDelete(),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('categories', true);
  }
}
