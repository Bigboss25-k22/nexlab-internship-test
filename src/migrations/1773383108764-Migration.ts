import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1773383108764 implements MigrationInterface {
  name = 'Migration1773383108764';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "freelancers" DROP CONSTRAINT "FK_3d5a5a7ca7b16032cbc31129cc8"`
    );
    await queryRunner.query(
      `ALTER TABLE "freelancers" DROP CONSTRAINT "REL_3d5a5a7ca7b16032cbc31129cc"`
    );
    await queryRunner.query(`ALTER TABLE "freelancers" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "freelancers" ADD "user_id" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "freelancers" ADD CONSTRAINT "UQ_3d5a5a7ca7b16032cbc31129cc8" UNIQUE ("user_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "store_owners" DROP CONSTRAINT "FK_b928fbe4678f96c45a16c24285d"`
    );
    await queryRunner.query(
      `ALTER TABLE "store_owners" DROP CONSTRAINT "REL_b928fbe4678f96c45a16c24285"`
    );
    await queryRunner.query(`ALTER TABLE "store_owners" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "store_owners" ADD "user_id" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "store_owners" ADD CONSTRAINT "UQ_b928fbe4678f96c45a16c24285d" UNIQUE ("user_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "store_owners" ALTER COLUMN "owner_code" SET DEFAULT 'OWN_' || SUBSTR(MD5(RANDOM()::TEXT), 1, 12)`
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`
    );
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "user_id" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "freelancers" ADD CONSTRAINT "FK_3d5a5a7ca7b16032cbc31129cc8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "store_owners" ADD CONSTRAINT "FK_b928fbe4678f96c45a16c24285d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`
    );
    await queryRunner.query(
      `ALTER TABLE "store_owners" DROP CONSTRAINT "FK_b928fbe4678f96c45a16c24285d"`
    );
    await queryRunner.query(
      `ALTER TABLE "freelancers" DROP CONSTRAINT "FK_3d5a5a7ca7b16032cbc31129cc8"`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`
    );
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "user_id" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "store_owners" ALTER COLUMN "owner_code" SET DEFAULT ('OWN_'|| substr(md5((random())), 1, 12))`
    );
    await queryRunner.query(
      `ALTER TABLE "store_owners" DROP CONSTRAINT "UQ_b928fbe4678f96c45a16c24285d"`
    );
    await queryRunner.query(`ALTER TABLE "store_owners" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "store_owners" ADD "user_id" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "store_owners" ADD CONSTRAINT "REL_b928fbe4678f96c45a16c24285" UNIQUE ("user_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "store_owners" ADD CONSTRAINT "FK_b928fbe4678f96c45a16c24285d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "freelancers" DROP CONSTRAINT "UQ_3d5a5a7ca7b16032cbc31129cc8"`
    );
    await queryRunner.query(`ALTER TABLE "freelancers" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "freelancers" ADD "user_id" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "freelancers" ADD CONSTRAINT "REL_3d5a5a7ca7b16032cbc31129cc" UNIQUE ("user_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "freelancers" ADD CONSTRAINT "FK_3d5a5a7ca7b16032cbc31129cc8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
