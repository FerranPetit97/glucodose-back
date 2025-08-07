import { Migration } from '@mikro-orm/migrations';

export class Migration20250805194215 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "core_data_foods"."foods" alter column "id" drop default;`,
    );
    this.addSql(
      `alter table "core_data_foods"."foods" alter column "id" type uuid using ("id"::text::uuid);`,
    );
    this.addSql(
      `alter table "core_data_foods"."foods" alter column "id" set default uuid_generate_v4();`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "core_data_foods"."foods" alter column "id" drop default;`,
    );
    this.addSql(
      `alter table "core_data_foods"."foods" alter column "id" type uuid DEFAULT gen_random_uuid() using ("id"::uuid DEFAULT gen_random_uuid());`,
    );
  }
}
