import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1731439822530 implements MigrationInterface {
    name = 'Migrations1731439822530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "frames" ADD "preview" character varying NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "frames" DROP COLUMN "preview"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
