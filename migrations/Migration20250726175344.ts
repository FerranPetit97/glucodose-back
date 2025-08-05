import { Migration } from '@mikro-orm/migrations';

export class Migration20250726175344 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "core_data_patients"."daily_dose_events" drop constraint "daily_dose_events_dose_id_fkey";`,
    );

    this.addSql(
      `alter table "core_data_doses"."dose_mappings" drop constraint "dose_mappings_dose_id_fkey";`,
    );

    this.addSql(
      `alter table "biz_data_dose_recommendations"."dose_recommendations" drop constraint "dose_recommendations_dose_id_fkey";`,
    );

    this.addSql(
      `alter table "core_data_foods"."food_category_mappings" drop constraint "food_category_mappings_category_id_fkey";`,
    );

    this.addSql(
      `alter table "core_data_patients"."patient_allergy_mappings" drop constraint "patient_allergy_mappings_allergy_id_fkey";`,
    );

    this.addSql(
      `alter table "core_data_patients"."patient_diet_mappings" drop constraint "patient_diet_mappings_diet_id_fkey";`,
    );

    this.addSql(
      `alter table "core_data_patients"."daily_dose_events" drop constraint "daily_dose_events_patient_id_fkey";`,
    );

    this.addSql(
      `alter table "core_data_patients"."daily_food_events" drop constraint "daily_food_events_patient_id_fkey";`,
    );

    this.addSql(
      `alter table "biz_data_dose_recommendations"."dose_recommendations" drop constraint "dose_recommendations_patient_id_fkey";`,
    );

    this.addSql(
      `alter table "core_data_measurements"."glucose_measurements" drop constraint "glucose_measurements_patient_id_fkey";`,
    );

    this.addSql(
      `alter table "core_data_measurements"."insulin_doses" drop constraint "insulin_doses_patient_id_fkey";`,
    );

    this.addSql(
      `alter table "core_data_patients"."patient_allergy_mappings" drop constraint "patient_allergy_mappings_patient_id_fkey";`,
    );

    this.addSql(
      `alter table "core_data_patients"."patient_diet_mappings" drop constraint "patient_diet_mappings_patient_id_fkey";`,
    );

    this.addSql(`drop table if exists "audit_data"."access_logs" cascade;`);

    this.addSql(`drop table if exists "audit_data"."change_logs" cascade;`);

    this.addSql(
      `drop table if exists "core_data_patients"."daily_dose_events" cascade;`,
    );

    this.addSql(
      `drop table if exists "core_data_patients"."daily_food_events" cascade;`,
    );

    this.addSql(
      `drop table if exists "core_data_doses"."dose_guidelines" cascade;`,
    );

    this.addSql(
      `drop table if exists "core_data_doses"."dose_mappings" cascade;`,
    );

    this.addSql(
      `drop table if exists "biz_data_dose_recommendations"."dose_recommendations" cascade;`,
    );

    this.addSql(
      `drop table if exists "core_data_foods"."food_categories" cascade;`,
    );

    this.addSql(
      `drop table if exists "core_data_foods"."food_category_mappings" cascade;`,
    );

    this.addSql(
      `drop table if exists "core_data_foods"."food_nutrients" cascade;`,
    );

    this.addSql(
      `drop table if exists "core_data_measurements"."glucose_measurements" cascade;`,
    );

    this.addSql(
      `drop table if exists "core_data_measurements"."insulin_doses" cascade;`,
    );

    this.addSql(
      `drop table if exists "core_data_patients"."patient_allergies" cascade;`,
    );

    this.addSql(
      `drop table if exists "core_data_patients"."patient_allergy_mappings" cascade;`,
    );

    this.addSql(
      `drop table if exists "core_data_patients"."patient_diet_mappings" cascade;`,
    );

    this.addSql(
      `drop table if exists "core_data_patients"."patient_diets" cascade;`,
    );

    this.addSql(
      `drop table if exists "core_data_patients"."patients" cascade;`,
    );

    this.addSql(
      `alter table "core_data_foods"."foods" drop constraint "foods_name_key";`,
    );
    this.addSql(
      `alter table "core_data_foods"."foods" drop column "proteinss", drop column "fatss", drop column "created_at", drop column "updated_at";`,
    );

    this.addSql(
      `alter table "core_data_foods"."foods" add column "proteins" int not null, add column "fats" int not null;`,
    );
    this.addSql(
      `alter table "core_data_foods"."foods" alter column "id" drop default;`,
    );
    this.addSql(
      `alter table "core_data_foods"."foods" alter column "id" type uuid DEFAULT gen_random_uuid() using ("id"::uuid DEFAULT gen_random_uuid());`,
    );
    this.addSql(
      `alter table "core_data_foods"."foods" alter column "carbs" type int using ("carbs"::int);`,
    );
    this.addSql(
      `alter table "core_data_foods"."foods" alter column "calories" type int using ("calories"::int);`,
    );

    this.addSql(`drop schema if exists "audit_data";`);
    this.addSql(`drop schema if exists "core_data_patients";`);
    this.addSql(`drop schema if exists "core_data_doses";`);
    this.addSql(`drop schema if exists "biz_data_dose_recommendations";`);
    this.addSql(`drop schema if exists "core_data_measurements";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create schema if not exists "audit_data";`);
    this.addSql(`create schema if not exists "core_data_patients";`);
    this.addSql(`create schema if not exists "core_data_doses";`);
    this.addSql(`create schema if not exists "biz_data_dose_recommendations";`);
    this.addSql(`create schema if not exists "core_data_measurements";`);
    this.addSql(
      `create table "audit_data"."access_logs" ("id" uuid not null default uuid_generate_v4(), "user_id" uuid not null, "access_time" timestamp(6) not null default now(), "action" varchar(255) not null, "ip_address" varchar(50) null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "access_logs_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "audit_data"."change_logs" ("id" uuid not null default uuid_generate_v4(), "entity" varchar(100) not null, "entity_id" uuid not null, "change_type" varchar(50) not null, "changed_by" uuid not null, "change_time" timestamp(6) not null default now(), "details" text null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "change_logs_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "core_data_patients"."daily_dose_events" ("id" uuid not null default uuid_generate_v4(), "patient_id" uuid not null, "dose_id" uuid not null, "dose_amount" numeric(8,3) not null, "event_time" timestamp(6) not null default now(), "notes" text null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "daily_dose_events_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "idx_daily_dose_events_patient" on "core_data_patients"."daily_dose_events" ("patient_id");`,
    );

    this.addSql(
      `create table "core_data_patients"."daily_food_events" ("id" uuid not null default uuid_generate_v4(), "patient_id" uuid not null, "food_id" uuid not null, "amount" numeric(8,2) not null, "event_time" timestamp(6) not null default now(), "notes" text null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "daily_food_events_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "idx_daily_food_events_patient" on "core_data_patients"."daily_food_events" ("patient_id");`,
    );

    this.addSql(
      `create table "core_data_doses"."dose_guidelines" ("id" uuid not null default uuid_generate_v4(), "description" text not null, "units" varchar(50) not null, "insulin_type" varchar(50) null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "dose_guidelines_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "core_data_doses"."dose_mappings" ("id" uuid not null default uuid_generate_v4(), "food_id" uuid not null, "dose_id" uuid not null, "dose_amount" numeric(8,3) not null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "dose_mappings_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "core_data_doses"."dose_mappings" add constraint "dose_mappings_food_id_dose_id_key" unique ("food_id", "dose_id");`,
    );

    this.addSql(
      `create table "biz_data_dose_recommendations"."dose_recommendations" ("id" uuid not null default uuid_generate_v4(), "patient_id" uuid not null, "dose_id" uuid not null, "conditions" text null, "notes" text null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "dose_recommendations_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "core_data_foods"."food_categories" ("id" uuid not null default uuid_generate_v4(), "name" varchar(100) not null, "description" text null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "food_categories_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "core_data_foods"."food_categories" add constraint "food_categories_name_key" unique ("name");`,
    );

    this.addSql(
      `create table "core_data_foods"."food_category_mappings" ("food_id" uuid not null, "category_id" uuid not null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "food_category_mappings_pkey" primary key ("food_id", "category_id"));`,
    );

    this.addSql(
      `create table "core_data_foods"."food_nutrients" ("id" uuid not null default uuid_generate_v4(), "food_id" uuid not null, "nutrient" varchar(100) not null, "amount" numeric(8,3) not null, "unit" varchar(20) not null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "food_nutrients_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "core_data_measurements"."glucose_measurements" ("id" uuid not null default uuid_generate_v4(), "patient_id" uuid not null, "value" numeric(6,2) not null, "measurement_time" timestamp(6) not null, "context" varchar(50) null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "glucose_measurements_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "idx_glucose_measurements_patient" on "core_data_measurements"."glucose_measurements" ("patient_id");`,
    );

    this.addSql(
      `create table "core_data_measurements"."insulin_doses" ("id" uuid not null default uuid_generate_v4(), "patient_id" uuid not null, "dose_amount" numeric(8,3) not null, "dose_time" timestamp(6) not null, "insulin_type" varchar(50) null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "insulin_doses_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "idx_insulin_doses_patient" on "core_data_measurements"."insulin_doses" ("patient_id");`,
    );

    this.addSql(
      `create table "core_data_patients"."patient_allergies" ("id" uuid not null default uuid_generate_v4(), "allergy" varchar(255) not null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "patient_allergies_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "core_data_patients"."patient_allergy_mappings" ("patient_id" uuid not null, "allergy_id" uuid not null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "patient_allergy_mappings_pkey" primary key ("patient_id", "allergy_id"));`,
    );

    this.addSql(
      `create table "core_data_patients"."patient_diet_mappings" ("patient_id" uuid not null, "diet_id" uuid not null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "patient_diet_mappings_pkey" primary key ("patient_id", "diet_id"));`,
    );

    this.addSql(
      `create table "core_data_patients"."patient_diets" ("id" uuid not null default uuid_generate_v4(), "diet_plan" text not null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "patient_diets_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "core_data_patients"."patients" ("id" uuid not null default uuid_generate_v4(), "name" varchar(255) not null, "email" varchar(255) null, "phone" varchar(50) null, "dob" date not null, "diagnosis_date" date null, "type_diabetes" varchar(50) null, "created_at" timestamp(6) null default now(), "updated_at" timestamp(6) null default now(), constraint "patients_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "idx_patients_email" on "core_data_patients"."patients" ("email");`,
    );

    this.addSql(
      `alter table "core_data_patients"."daily_dose_events" add constraint "daily_dose_events_dose_id_fkey" foreign key ("dose_id") references "core_data_doses"."dose_guidelines" ("id") on update no action on delete cascade;`,
    );
    this.addSql(
      `alter table "core_data_patients"."daily_dose_events" add constraint "daily_dose_events_patient_id_fkey" foreign key ("patient_id") references "core_data_patients"."patients" ("id") on update no action on delete cascade;`,
    );

    this.addSql(
      `alter table "core_data_patients"."daily_food_events" add constraint "daily_food_events_food_id_fkey" foreign key ("food_id") references "core_data_foods"."foods" ("id") on update no action on delete cascade;`,
    );
    this.addSql(
      `alter table "core_data_patients"."daily_food_events" add constraint "daily_food_events_patient_id_fkey" foreign key ("patient_id") references "core_data_patients"."patients" ("id") on update no action on delete cascade;`,
    );

    this.addSql(
      `alter table "core_data_doses"."dose_mappings" add constraint "dose_mappings_dose_id_fkey" foreign key ("dose_id") references "core_data_doses"."dose_guidelines" ("id") on update no action on delete cascade;`,
    );
    this.addSql(
      `alter table "core_data_doses"."dose_mappings" add constraint "dose_mappings_food_id_fkey" foreign key ("food_id") references "core_data_foods"."foods" ("id") on update no action on delete cascade;`,
    );

    this.addSql(
      `alter table "biz_data_dose_recommendations"."dose_recommendations" add constraint "dose_recommendations_dose_id_fkey" foreign key ("dose_id") references "core_data_doses"."dose_guidelines" ("id") on update no action on delete cascade;`,
    );
    this.addSql(
      `alter table "biz_data_dose_recommendations"."dose_recommendations" add constraint "dose_recommendations_patient_id_fkey" foreign key ("patient_id") references "core_data_patients"."patients" ("id") on update no action on delete cascade;`,
    );

    this.addSql(
      `alter table "core_data_foods"."food_category_mappings" add constraint "food_category_mappings_category_id_fkey" foreign key ("category_id") references "core_data_foods"."food_categories" ("id") on update no action on delete cascade;`,
    );
    this.addSql(
      `alter table "core_data_foods"."food_category_mappings" add constraint "food_category_mappings_food_id_fkey" foreign key ("food_id") references "core_data_foods"."foods" ("id") on update no action on delete cascade;`,
    );

    this.addSql(
      `alter table "core_data_foods"."food_nutrients" add constraint "food_nutrients_food_id_fkey" foreign key ("food_id") references "core_data_foods"."foods" ("id") on update no action on delete cascade;`,
    );

    this.addSql(
      `alter table "core_data_measurements"."glucose_measurements" add constraint "glucose_measurements_patient_id_fkey" foreign key ("patient_id") references "core_data_patients"."patients" ("id") on update no action on delete cascade;`,
    );

    this.addSql(
      `alter table "core_data_measurements"."insulin_doses" add constraint "insulin_doses_patient_id_fkey" foreign key ("patient_id") references "core_data_patients"."patients" ("id") on update no action on delete cascade;`,
    );

    this.addSql(
      `alter table "core_data_patients"."patient_allergy_mappings" add constraint "patient_allergy_mappings_allergy_id_fkey" foreign key ("allergy_id") references "core_data_patients"."patient_allergies" ("id") on update no action on delete cascade;`,
    );
    this.addSql(
      `alter table "core_data_patients"."patient_allergy_mappings" add constraint "patient_allergy_mappings_patient_id_fkey" foreign key ("patient_id") references "core_data_patients"."patients" ("id") on update no action on delete cascade;`,
    );

    this.addSql(
      `alter table "core_data_patients"."patient_diet_mappings" add constraint "patient_diet_mappings_diet_id_fkey" foreign key ("diet_id") references "core_data_patients"."patient_diets" ("id") on update no action on delete cascade;`,
    );
    this.addSql(
      `alter table "core_data_patients"."patient_diet_mappings" add constraint "patient_diet_mappings_patient_id_fkey" foreign key ("patient_id") references "core_data_patients"."patients" ("id") on update no action on delete cascade;`,
    );

    this.addSql(
      `alter table "core_data_foods"."foods" drop column "proteins", drop column "fats";`,
    );

    this.addSql(
      `alter table "core_data_foods"."foods" add column "proteinss" numeric(6,2) not null, add column "fatss" numeric(6,2) not null, add column "created_at" timestamp(6) null default now(), add column "updated_at" timestamp(6) null default now();`,
    );
    this.addSql(
      `alter table "core_data_foods"."foods" alter column "id" drop default;`,
    );
    this.addSql(
      `alter table "core_data_foods"."foods" alter column "id" type uuid using ("id"::text::uuid);`,
    );
    this.addSql(
      `alter table "core_data_foods"."foods" alter column "id" set default uuid_generate_v4();`,
    );
    this.addSql(
      `alter table "core_data_foods"."foods" alter column "carbs" type numeric(6,2) using ("carbs"::numeric(6,2));`,
    );
    this.addSql(
      `alter table "core_data_foods"."foods" alter column "calories" type numeric(8,2) using ("calories"::numeric(8,2));`,
    );
    this.addSql(
      `alter table "core_data_foods"."foods" add constraint "foods_name_key" unique ("name");`,
    );
  }
}
