import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTenantDatabaseColumns1713275500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'organizations',
      new TableColumn({
        name: 'dbHost',
        type: 'varchar',
        length: '255',
        default: "'localhost'",
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'organizations',
      new TableColumn({
        name: 'dbPort',
        type: 'integer',
        default: 5432,
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'organizations',
      new TableColumn({
        name: 'dbName',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'organizations',
      new TableColumn({
        name: 'dbUser',
        type: 'varchar',
        length: '255',
        default: "'postgres'",
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'organizations',
      new TableColumn({
        name: 'dbPassword',
        type: 'varchar',
        length: '255',
        default: "'postgres'",
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('organizations', 'dbPassword');
    await queryRunner.dropColumn('organizations', 'dbUser');
    await queryRunner.dropColumn('organizations', 'dbName');
    await queryRunner.dropColumn('organizations', 'dbPort');
    await queryRunner.dropColumn('organizations', 'dbHost');
  }
}
