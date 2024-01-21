import {MigrationInterface, QueryRunner} from "typeorm";

export class orgFulltext1705568257422 implements MigrationInterface {
    name = 'orgFulltext1705568257422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE FULLTEXT INDEX \`IDX_c21e615583a3ebbb0977452afb\` ON \`organization\` (\`name\`)`);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`IDX_023d109af326d77b79a8dd4ee8\` ON \`organization\` (\`description\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_023d109af326d77b79a8dd4ee8\` ON \`organization\``);
        await queryRunner.query(`DROP INDEX \`IDX_c21e615583a3ebbb0977452afb\` ON \`organization\``);
    }

}
