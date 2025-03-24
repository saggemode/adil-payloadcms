import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_loyalty_points_points_history_type" AS ENUM('earned', 'redeemed', 'expired', 'adjusted');
  CREATE TYPE "public"."enum_loyalty_points_rewards_status" AS ENUM('available', 'redeemed', 'expired');
  CREATE TYPE "public"."enum_loyalty_points_tier_history_tier" AS ENUM('bronze', 'silver', 'gold', 'platinum');
  CREATE TYPE "public"."enum_loyalty_points_tier" AS ENUM('bronze', 'silver', 'gold', 'platinum');
  CREATE TYPE "public"."enum_rewards_tier_restrictions" AS ENUM('bronze', 'silver', 'gold', 'platinum');
  CREATE TYPE "public"."enum_rewards_type" AS ENUM('discount', 'free_shipping', 'free_product', 'special_access');
  CREATE TYPE "public"."enum_rewards_discount_type" AS ENUM('percentage', 'fixed');
  CREATE TYPE "public"."enum_payment_methods_icon" AS ENUM('paypal', 'credit-card', 'wallet');
  ALTER TYPE "public"."enum_orders_paidat_tz" ADD VALUE 'Australia/Brisbane' BEFORE 'Australia/Sydney';
  ALTER TYPE "public"."enum_orders_deliveredat_tz" ADD VALUE 'Australia/Brisbane' BEFORE 'Australia/Sydney';
  ALTER TYPE "public"."enum_orders_createdat_tz" ADD VALUE 'Australia/Brisbane' BEFORE 'Australia/Sydney';
  ALTER TYPE "public"."enum_products_publishedat_tz" ADD VALUE 'Australia/Brisbane' BEFORE 'Australia/Sydney';
  ALTER TYPE "public"."enum__products_v_version_publishedat_tz" ADD VALUE 'Australia/Brisbane' BEFORE 'Australia/Sydney';
  ALTER TYPE "public"."enum_coupons_startdate_tz" ADD VALUE 'Australia/Brisbane' BEFORE 'Australia/Sydney';
  ALTER TYPE "public"."enum_coupons_enddate_tz" ADD VALUE 'Australia/Brisbane' BEFORE 'Australia/Sydney';
  CREATE TABLE IF NOT EXISTS "loyalty_points_points_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"points" numeric NOT NULL,
  	"type" "enum_loyalty_points_points_history_type" NOT NULL,
  	"description" varchar NOT NULL,
  	"created_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "loyalty_points_rewards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"reward_id" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"points_cost" numeric NOT NULL,
  	"status" "enum_loyalty_points_rewards_status" NOT NULL,
  	"redeemed_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "loyalty_points_tier_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tier" "enum_loyalty_points_tier_history_tier" NOT NULL,
  	"changed_at" timestamp(3) with time zone NOT NULL,
  	"reason" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "loyalty_points" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" varchar NOT NULL,
  	"points" numeric DEFAULT 0 NOT NULL,
  	"tier" "enum_loyalty_points_tier" DEFAULT 'bronze' NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "rewards_tier_restrictions" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_rewards_tier_restrictions",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "rewards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"points_cost" numeric NOT NULL,
  	"type" "enum_rewards_type" NOT NULL,
  	"discount_amount" numeric,
  	"discount_type" "enum_rewards_discount_type",
  	"free_product_id" integer,
  	"special_access_details" varchar,
  	"valid_from" timestamp(3) with time zone NOT NULL,
  	"valid_until" timestamp(3) with time zone NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"stock" numeric NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payment_methods" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon" "enum_payment_methods_icon" NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "forms_blocks_select" ADD COLUMN "placeholder" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "loyalty_points_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "rewards_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payment_methods_id" integer;
  DO $$ BEGIN
   ALTER TABLE "loyalty_points_points_history" ADD CONSTRAINT "loyalty_points_points_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."loyalty_points"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "loyalty_points_rewards" ADD CONSTRAINT "loyalty_points_rewards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."loyalty_points"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "loyalty_points_tier_history" ADD CONSTRAINT "loyalty_points_tier_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."loyalty_points"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "rewards_tier_restrictions" ADD CONSTRAINT "rewards_tier_restrictions_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."rewards"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "rewards" ADD CONSTRAINT "rewards_free_product_id_products_id_fk" FOREIGN KEY ("free_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "loyalty_points_points_history_order_idx" ON "loyalty_points_points_history" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "loyalty_points_points_history_parent_id_idx" ON "loyalty_points_points_history" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "loyalty_points_rewards_order_idx" ON "loyalty_points_rewards" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "loyalty_points_rewards_parent_id_idx" ON "loyalty_points_rewards" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "loyalty_points_tier_history_order_idx" ON "loyalty_points_tier_history" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "loyalty_points_tier_history_parent_id_idx" ON "loyalty_points_tier_history" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "loyalty_points_customer_id_idx" ON "loyalty_points" USING btree ("customer_id");
  CREATE INDEX IF NOT EXISTS "rewards_tier_restrictions_order_idx" ON "rewards_tier_restrictions" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "rewards_tier_restrictions_parent_idx" ON "rewards_tier_restrictions" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "rewards_free_product_idx" ON "rewards" USING btree ("free_product_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "payment_methods_name_idx" ON "payment_methods" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "payment_methods_updated_at_idx" ON "payment_methods" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payment_methods_created_at_idx" ON "payment_methods" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_loyalty_points_fk" FOREIGN KEY ("loyalty_points_id") REFERENCES "public"."loyalty_points"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rewards_fk" FOREIGN KEY ("rewards_id") REFERENCES "public"."rewards"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payment_methods_fk" FOREIGN KEY ("payment_methods_id") REFERENCES "public"."payment_methods"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_loyalty_points_id_idx" ON "payload_locked_documents_rels" USING btree ("loyalty_points_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_rewards_id_idx" ON "payload_locked_documents_rels" USING btree ("rewards_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payment_methods_id_idx" ON "payload_locked_documents_rels" USING btree ("payment_methods_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "loyalty_points_points_history" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "loyalty_points_rewards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "loyalty_points_tier_history" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "loyalty_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "rewards_tier_restrictions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "rewards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payment_methods" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "loyalty_points_points_history" CASCADE;
  DROP TABLE "loyalty_points_rewards" CASCADE;
  DROP TABLE "loyalty_points_tier_history" CASCADE;
  DROP TABLE "loyalty_points" CASCADE;
  DROP TABLE "rewards_tier_restrictions" CASCADE;
  DROP TABLE "rewards" CASCADE;
  DROP TABLE "payment_methods" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_loyalty_points_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_rewards_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payment_methods_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_loyalty_points_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_rewards_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_payment_methods_id_idx";
  ALTER TABLE "forms_blocks_select" DROP COLUMN IF EXISTS "placeholder";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "loyalty_points_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "rewards_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payment_methods_id";
  ALTER TABLE "public"."orders" ALTER COLUMN "paidat_tz" SET DATA TYPE text;
  DROP TYPE "public"."enum_orders_paidat_tz";
  CREATE TYPE "public"."enum_orders_paidat_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  ALTER TABLE "public"."orders" ALTER COLUMN "paidat_tz" SET DATA TYPE "public"."enum_orders_paidat_tz" USING "paidat_tz"::"public"."enum_orders_paidat_tz";
  ALTER TABLE "public"."orders" ALTER COLUMN "deliveredat_tz" SET DATA TYPE text;
  DROP TYPE "public"."enum_orders_deliveredat_tz";
  CREATE TYPE "public"."enum_orders_deliveredat_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  ALTER TABLE "public"."orders" ALTER COLUMN "deliveredat_tz" SET DATA TYPE "public"."enum_orders_deliveredat_tz" USING "deliveredat_tz"::"public"."enum_orders_deliveredat_tz";
  ALTER TABLE "public"."orders" ALTER COLUMN "createdat_tz" SET DATA TYPE text;
  DROP TYPE "public"."enum_orders_createdat_tz";
  CREATE TYPE "public"."enum_orders_createdat_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  ALTER TABLE "public"."orders" ALTER COLUMN "createdat_tz" SET DATA TYPE "public"."enum_orders_createdat_tz" USING "createdat_tz"::"public"."enum_orders_createdat_tz";
  ALTER TABLE "public"."products" ALTER COLUMN "publishedat_tz" SET DATA TYPE text;
  DROP TYPE "public"."enum_products_publishedat_tz";
  CREATE TYPE "public"."enum_products_publishedat_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  ALTER TABLE "public"."products" ALTER COLUMN "publishedat_tz" SET DATA TYPE "public"."enum_products_publishedat_tz" USING "publishedat_tz"::"public"."enum_products_publishedat_tz";
  ALTER TABLE "public"."_products_v" ALTER COLUMN "version_publishedat_tz" SET DATA TYPE text;
  DROP TYPE "public"."enum__products_v_version_publishedat_tz";
  CREATE TYPE "public"."enum__products_v_version_publishedat_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  ALTER TABLE "public"."_products_v" ALTER COLUMN "version_publishedat_tz" SET DATA TYPE "public"."enum__products_v_version_publishedat_tz" USING "version_publishedat_tz"::"public"."enum__products_v_version_publishedat_tz";
  ALTER TABLE "public"."coupons" ALTER COLUMN "startdate_tz" SET DATA TYPE text;
  DROP TYPE "public"."enum_coupons_startdate_tz";
  CREATE TYPE "public"."enum_coupons_startdate_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  ALTER TABLE "public"."coupons" ALTER COLUMN "startdate_tz" SET DATA TYPE "public"."enum_coupons_startdate_tz" USING "startdate_tz"::"public"."enum_coupons_startdate_tz";
  ALTER TABLE "public"."coupons" ALTER COLUMN "enddate_tz" SET DATA TYPE text;
  DROP TYPE "public"."enum_coupons_enddate_tz";
  CREATE TYPE "public"."enum_coupons_enddate_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  ALTER TABLE "public"."coupons" ALTER COLUMN "enddate_tz" SET DATA TYPE "public"."enum_coupons_enddate_tz" USING "enddate_tz"::"public"."enum_coupons_enddate_tz";
  DROP TYPE "public"."enum_loyalty_points_points_history_type";
  DROP TYPE "public"."enum_loyalty_points_rewards_status";
  DROP TYPE "public"."enum_loyalty_points_tier_history_tier";
  DROP TYPE "public"."enum_loyalty_points_tier";
  DROP TYPE "public"."enum_rewards_tier_restrictions";
  DROP TYPE "public"."enum_rewards_type";
  DROP TYPE "public"."enum_rewards_discount_type";
  DROP TYPE "public"."enum_payment_methods_icon";`)
}
