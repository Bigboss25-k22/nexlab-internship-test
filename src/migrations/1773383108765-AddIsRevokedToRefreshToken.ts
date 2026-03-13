import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsRevokedToRefreshToken1773383108765 implements MigrationInterface {
  name = 'AddIsRevokedToRefreshToken1773383108765';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if column already exists
    const table = await queryRunner.getTable('refresh_tokens');
    const hasIsRevokedColumn = table?.columns.find((column) => column.name === 'is_revoked');

    if (!hasIsRevokedColumn) {
      await queryRunner.query(
        `ALTER TABLE "refresh_tokens" ADD "is_revoked" boolean NOT NULL DEFAULT false`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "is_revoked"`);
  }
}
