import { MigrationInterface, QueryRunner } from "typeorm";

export class ViewerConfig1731524272739 implements MigrationInterface {
    name = 'ViewerConfig1731524272739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "frames" ADD "config_viewer" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "frames" DROP COLUMN "config_viewer"`);
    }

}
