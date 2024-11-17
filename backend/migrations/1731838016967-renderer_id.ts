import { MigrationInterface, QueryRunner } from "typeorm";

export class RendererId1731838016967 implements MigrationInterface {
    name = 'RendererId1731838016967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "frames" ADD "renderer_id" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "frames" DROP COLUMN "renderer_id"`);
    }

}
