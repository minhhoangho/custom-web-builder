import { MigrationHelper } from 'src/utils/migration.helper';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { PostStatus } from '@app/post/constants';

export class CreatePostsTable1632499960705 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          MigrationHelper.intIdPrimary(),
          MigrationHelper.varchar({ name: 'title', isNullable: false }),
          MigrationHelper.text({ name: 'description' }),
          MigrationHelper.text({ name: 'content' }),
          MigrationHelper.varchar({ name: 'thumbnail' }),
          MigrationHelper.varchar({ name: 'cover' }),
          MigrationHelper.varchar({ name: 'avatar' }),
          MigrationHelper.tinyInteger({
            name: 'status',
            isNullable: false,
            defaultValue: PostStatus.Unpublished,
          }),
          MigrationHelper.integer({ name: 'author_id', isNullable: false }),
          MigrationHelper.integer({ name: 'category_id', isNullable: false }),
          ...MigrationHelper.timestampsWithDelete(),
          ...MigrationHelper.userInteractionFieldsWithSoftDelete(),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('posts', true);
  }
}
