import { MigrationHelper } from 'src/utils/migration.helper';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { PostStatus } from '@app/post/constants';

export class CreateDrawDBSchema1732499961705 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'draw_db',
        columns: [
          MigrationHelper.intIdPrimary(),
          MigrationHelper.varchar({ name: 'name', isNullable: false }),
          MigrationHelper.varchar({ name: 'database', isNullable: false }),
          MigrationHelper.json({ name: 'note' }),
          MigrationHelper.json({ name: 'pan' }), // position
          MigrationHelper.json({ name: 'references' }),
          MigrationHelper.json({ name: 'areas' }),
          MigrationHelper.json({ name: 'tables' }),
          MigrationHelper.json({ name: 'todo' }),
          MigrationHelper.float({ name: 'zoom', isNullable: false }),
          ...MigrationHelper.timestampsWithDelete(),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('draw_db', true);
  }
}
