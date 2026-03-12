import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1773340219988 implements MigrationInterface {
  name = 'Migration1773340219988';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "contracts" ("id" SERIAL NOT NULL, "freelancer_id" integer NOT NULL, "store_id" integer NOT NULL, "start_date" date NOT NULL, "end_date" date, "status" character varying(20) NOT NULL DEFAULT 'active', CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "freelancers" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "house_number" character varying(50), "street" character varying(100), "ward" character varying(100), "district" character varying(100), "city" character varying(100), CONSTRAINT "REL_3d5a5a7ca7b16032cbc31129cc" UNIQUE ("user_id"), CONSTRAINT "PK_2e27ad3c871f34f5d8cfffeb950" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "job_applications" ("id" SERIAL NOT NULL, "store_id" integer NOT NULL, "freelancer_id" integer NOT NULL, "type" character varying(50) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c56a5e86707d0f0df18fa111280" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "stores" ("id" SERIAL NOT NULL, "owner_id" integer NOT NULL, "name" character varying(100) NOT NULL, "logo" character varying(255), "phone" character varying(20) NOT NULL, "email" character varying(100) NOT NULL, "house_number" character varying(50) NOT NULL, "street" character varying(100) NOT NULL, "ward" character varying(100) NOT NULL, "district" character varying(100) NOT NULL, "city" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "store_owners" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "owner_code" character varying(50) NOT NULL, CONSTRAINT "UQ_ba883fa79215e3aa6956afb816c" UNIQUE ("owner_code"), CONSTRAINT "REL_b928fbe4678f96c45a16c24285" UNIQUE ("user_id"), CONSTRAINT "PK_b450b628536aff8f577099b2b19" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "token" character varying(500) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "full_name" character varying(100) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying(20) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone")`
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "birth_date" date`);
    await queryRunner.query(`ALTER TABLE "users" ADD "gender" character varying(10)`);
    await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying(255)`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "role" character varying(20) NOT NULL DEFAULT 'user'`
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "is_verified" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" ADD CONSTRAINT "FK_a94ffd0b1a052fddaa84d4cb186" FOREIGN KEY ("freelancer_id") REFERENCES "freelancers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" ADD CONSTRAINT "FK_eb65b270f40f7fe3fd3ae7f797e" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "freelancers" ADD CONSTRAINT "FK_3d5a5a7ca7b16032cbc31129cc8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "job_applications" ADD CONSTRAINT "FK_b87c734ef4f7892beb9a4956752" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "job_applications" ADD CONSTRAINT "FK_e97e9c9aacc7461a4dbea393df0" FOREIGN KEY ("freelancer_id") REFERENCES "freelancers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "stores" ADD CONSTRAINT "FK_c03f4f73d83362cabb34dfa9418" FOREIGN KEY ("owner_id") REFERENCES "store_owners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
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
      `ALTER TABLE "stores" DROP CONSTRAINT "FK_c03f4f73d83362cabb34dfa9418"`
    );
    await queryRunner.query(
      `ALTER TABLE "job_applications" DROP CONSTRAINT "FK_e97e9c9aacc7461a4dbea393df0"`
    );
    await queryRunner.query(
      `ALTER TABLE "job_applications" DROP CONSTRAINT "FK_b87c734ef4f7892beb9a4956752"`
    );
    await queryRunner.query(
      `ALTER TABLE "freelancers" DROP CONSTRAINT "FK_3d5a5a7ca7b16032cbc31129cc8"`
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" DROP CONSTRAINT "FK_eb65b270f40f7fe3fd3ae7f797e"`
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" DROP CONSTRAINT "FK_a94ffd0b1a052fddaa84d4cb186"`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_verified"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birth_date"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a000cca60bcf04454e727699490"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "full_name"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(100) NOT NULL`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "store_owners"`);
    await queryRunner.query(`DROP TABLE "stores"`);
    await queryRunner.query(`DROP TABLE "job_applications"`);
    await queryRunner.query(`DROP TABLE "freelancers"`);
    await queryRunner.query(`DROP TABLE "contracts"`);
  }
}
