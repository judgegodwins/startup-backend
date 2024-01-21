import {MigrationInterface, QueryRunner} from "typeorm";

export class orgLogo1705487403386 implements MigrationInterface {
    name = 'orgLogo1705487403386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`organization\` ADD \`logo\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`organization\` DROP COLUMN \`logo\``);
    }

}
