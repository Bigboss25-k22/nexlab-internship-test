import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1773379557693 implements MigrationInterface {
  name = 'Migration1773379557693';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "store_owners" ALTER COLUMN "owner_code" SET DEFAULT 'OWN_' || SUBSTR(MD5(RANDOM()::TEXT), 1, 12)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "store_owners" ALTER COLUMN "owner_code" DROP DEFAULT`);
  }
}
