import { MigrationHelper } from 'src/utils/migration.helper';
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateRolesTable1626660508747 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          MigrationHelper.intIdPrimary(),
          MigrationHelper.varchar({ name: 'name', length: 255 }),
          MigrationHelper.varchar({ name: 'key', length: 255 }),
          MigrationHelper.text({ name: 'description', defaultValue: '' }),
          ...MigrationHelper.timestamps(),
          ...MigrationHelper.userInteractionFields(),
        ],
      }),
    );

    const indexes: TableIndex[] = [
      new TableIndex({
        name: 'idx_roles_key',
        columnNames: ['key'],
      }),
    ];
    for (const index of indexes) {
      await queryRunner.createIndex('roles', index);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('roles', true);
  }
}
