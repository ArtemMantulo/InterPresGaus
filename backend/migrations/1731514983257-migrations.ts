import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1731514983257 implements MigrationInterface {
    name = 'Migrations1731514983257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "frames" ADD "config" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "frames" DROP COLUMN "config"`);
    }

}
