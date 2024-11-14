import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveConfigsFields1731605699102 implements MigrationInterface {
    name = 'RemoveConfigsFields1731605699102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "frames" DROP COLUMN "config"`);
        await queryRunner.query(`ALTER TABLE "frames" DROP COLUMN "config_viewer"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "frames" ADD "config_viewer" jsonb`);
        await queryRunner.query(`ALTER TABLE "frames" ADD "config" jsonb`);
    }

}
