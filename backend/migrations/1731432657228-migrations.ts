import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1731432657228 implements MigrationInterface {
    name = 'Migrations1731432657228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "frames" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_24f76d02278950b00a73dd6d363" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "frames"`);
    }

}
