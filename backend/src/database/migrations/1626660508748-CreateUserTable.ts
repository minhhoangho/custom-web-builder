import { MigrationHelper } from 'src/utils/migration.helper';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1626660508748 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          MigrationHelper.intIdPrimary(),
          MigrationHelper.tinyInteger({
            name: 'role_id',
            isNullable: false,
            defaultValue: 0,
          }),
          MigrationHelper.varchar({ name: 'email', isNullable: false }),
          MigrationHelper.varchar({ name: 'password' }),
          MigrationHelper.varchar({ name: 'first_name' }),
          MigrationHelper.varchar({ name: 'last_name' }),
          MigrationHelper.varchar({ name: 'avatar' }),
          MigrationHelper.varchar({ name: 'google_id' }),
          MigrationHelper.json({ name: 'credentials' }),
          ...MigrationHelper.timestampsWithDelete(),
          ...MigrationHelper.userInteractionFieldsWithSoftDelete(),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true);
  }
}
