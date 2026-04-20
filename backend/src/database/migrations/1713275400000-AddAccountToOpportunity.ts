import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class AddAccountToOpportunity1713275400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add accountId column to opportunities table
    await queryRunner.addColumn(
      'opportunities',
      new TableColumn({
        name: 'accountId',
        type: 'uuid',
        isNullable: false,
        default: "'00000000-0000-0000-0000-000000000000'", // Temporary default value
      }),
    );

    // Add foreign key constraint
    await queryRunner.createForeignKey(
      'opportunities',
      new TableForeignKey({
        columnNames: ['accountId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'CASCADE',
      }),
    );

    // Add index for tenant filtering with accountId
    await queryRunner.createIndex(
      'opportunities',
      new TableIndex({
        columnNames: ['tenantId', 'accountId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.dropIndex('opportunities', 'IDX_opportunities_tenantId_accountId');

    // Drop foreign key
    const table = await queryRunner.getTable('opportunities');
    const foreignKey = table!.foreignKeys.find((fk) => fk.columnNames.indexOf('accountId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('opportunities', foreignKey);
    }

    // Drop column
    await queryRunner.dropColumn('opportunities', 'accountId');
  }
}
