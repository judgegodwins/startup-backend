import {MigrationInterface, QueryRunner} from "typeorm";

export class orgUpdate1705863001767 implements MigrationInterface {
    name = 'orgUpdate1705863001767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`organization\` ADD \`phoneNumber\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`organization\` ADD \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`organization\` ADD \`industry\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`organization\` ADD \`type\` enum ('for-profit', 'non-profit') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`organization\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`organization\` DROP COLUMN \`industry\``);
        await queryRunner.query(`ALTER TABLE \`organization\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`organization\` DROP COLUMN \`phoneNumber\``);
    }

}
