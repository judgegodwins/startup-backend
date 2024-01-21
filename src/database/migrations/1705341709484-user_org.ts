import {MigrationInterface, QueryRunner} from "typeorm";

export class userOrg1705341709484 implements MigrationInterface {
    name = 'userOrg1705341709484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`organization\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`yearFounded\` datetime NOT NULL, \`description\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_organizations_organization\` (\`userId\` varchar(36) NOT NULL, \`organizationId\` varchar(36) NOT NULL, INDEX \`IDX_7ad3d8541fbdb5a3d137c50fb4\` (\`userId\`), INDEX \`IDX_8d7c566d5a234be0a646101326\` (\`organizationId\`), PRIMARY KEY (\`userId\`, \`organizationId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_organizations_organization\` ADD CONSTRAINT \`FK_7ad3d8541fbdb5a3d137c50fb40\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_organizations_organization\` ADD CONSTRAINT \`FK_8d7c566d5a234be0a6461013269\` FOREIGN KEY (\`organizationId\`) REFERENCES \`organization\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_organizations_organization\` DROP FOREIGN KEY \`FK_8d7c566d5a234be0a6461013269\``);
        await queryRunner.query(`ALTER TABLE \`user_organizations_organization\` DROP FOREIGN KEY \`FK_7ad3d8541fbdb5a3d137c50fb40\``);
        await queryRunner.query(`DROP INDEX \`IDX_8d7c566d5a234be0a646101326\` ON \`user_organizations_organization\``);
        await queryRunner.query(`DROP INDEX \`IDX_7ad3d8541fbdb5a3d137c50fb4\` ON \`user_organizations_organization\``);
        await queryRunner.query(`DROP TABLE \`user_organizations_organization\``);
        await queryRunner.query(`DROP TABLE \`organization\``);
    }

}
