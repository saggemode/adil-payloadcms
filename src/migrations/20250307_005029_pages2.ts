import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_coupons_startdate_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  CREATE TYPE "public"."enum_coupons_enddate_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  CREATE TABLE IF NOT EXISTS "users_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"addresses_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "addresses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"full_name" varchar NOT NULL,
  	"street" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"postal_code" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"province" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"is_default" boolean DEFAULT false,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "coupons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"discount_percent" numeric NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"startdate_tz" "enum_coupons_startdate_tz" DEFAULT 'Africa/Lagos' NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"enddate_tz" "enum_coupons_enddate_tz" DEFAULT 'Africa/Lagos' NOT NULL,
  	"usage_limit" numeric NOT NULL,
  	"usage_count" numeric DEFAULT 0,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "coupons_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"orders_id" integer
  );
  
  ALTER TABLE "users_cart_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_cart_items" CASCADE;
  ALTER TABLE "orders" ALTER COLUMN "expecteddeliverydate_tz" DROP NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "coupon_id" integer;
  ALTER TABLE "orders" ADD COLUMN "address_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "addresses_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "coupons_id" integer;
  DO $$ BEGIN
   ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_addresses_fk" FOREIGN KEY ("addresses_id") REFERENCES "public"."addresses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "coupons_rels" ADD CONSTRAINT "coupons_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "coupons_rels" ADD CONSTRAINT "coupons_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_rels_order_idx" ON "users_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "users_rels_path_idx" ON "users_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "users_rels_addresses_id_idx" ON "users_rels" USING btree ("addresses_id");
  CREATE INDEX IF NOT EXISTS "addresses_user_idx" ON "addresses" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "addresses_slug_idx" ON "addresses" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "addresses_updated_at_idx" ON "addresses" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "addresses_created_at_idx" ON "addresses" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "coupons_code_idx" ON "coupons" USING btree ("code");
  CREATE INDEX IF NOT EXISTS "coupons_slug_idx" ON "coupons" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "coupons_updated_at_idx" ON "coupons" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "coupons_created_at_idx" ON "coupons" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "coupons_rels_order_idx" ON "coupons_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "coupons_rels_parent_idx" ON "coupons_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "coupons_rels_path_idx" ON "coupons_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "coupons_rels_orders_id_idx" ON "coupons_rels" USING btree ("orders_id");
  DO $$ BEGIN
   ALTER TABLE "orders" ADD CONSTRAINT "orders_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_addresses_fk" FOREIGN KEY ("addresses_id") REFERENCES "public"."addresses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_coupons_fk" FOREIGN KEY ("coupons_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "orders_coupon_idx" ON "orders" USING btree ("coupon_id");
  CREATE INDEX IF NOT EXISTS "orders_address_idx" ON "orders" USING btree ("address_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_addresses_id_idx" ON "payload_locked_documents_rels" USING btree ("addresses_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_coupons_id_idx" ON "payload_locked_documents_rels" USING btree ("coupons_id");
  ALTER TABLE "users" DROP COLUMN IF EXISTS "cart_items_price";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "cart_tax_price";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "cart_shipping_price";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "cart_total_price";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "cart_payment_method";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "cart_shipping_address";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "cart_delivery_date_index";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "cart_deliverydateindex_tz";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "cart_expected_delivery_date";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "cart_expecteddeliverydate_tz";
  DROP TYPE "public"."enum_users_cart_deliverydateindex_tz";
  DROP TYPE "public"."enum_users_cart_expecteddeliverydate_tz";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_cart_deliverydateindex_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  CREATE TYPE "public"."enum_users_cart_expecteddeliverydate_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  CREATE TABLE IF NOT EXISTS "users_cart_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quantity" numeric
  );
  
  ALTER TABLE "users_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "addresses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "coupons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "coupons_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_rels" CASCADE;
  DROP TABLE "addresses" CASCADE;
  DROP TABLE "coupons" CASCADE;
  DROP TABLE "coupons_rels" CASCADE;
  ALTER TABLE "orders" DROP CONSTRAINT "orders_coupon_id_coupons_id_fk";
  
  ALTER TABLE "orders" DROP CONSTRAINT "orders_address_id_addresses_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_addresses_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_coupons_fk";
  
  DROP INDEX IF EXISTS "orders_coupon_idx";
  DROP INDEX IF EXISTS "orders_address_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_addresses_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_coupons_id_idx";
  ALTER TABLE "orders" ALTER COLUMN "expecteddeliverydate_tz" SET NOT NULL;
  ALTER TABLE "users" ADD COLUMN "cart_items_price" numeric;
  ALTER TABLE "users" ADD COLUMN "cart_tax_price" numeric;
  ALTER TABLE "users" ADD COLUMN "cart_shipping_price" numeric;
  ALTER TABLE "users" ADD COLUMN "cart_total_price" numeric;
  ALTER TABLE "users" ADD COLUMN "cart_payment_method" varchar;
  ALTER TABLE "users" ADD COLUMN "cart_shipping_address" varchar;
  ALTER TABLE "users" ADD COLUMN "cart_delivery_date_index" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "cart_deliverydateindex_tz" "enum_users_cart_deliverydateindex_tz" DEFAULT 'Africa/Lagos';
  ALTER TABLE "users" ADD COLUMN "cart_expected_delivery_date" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "cart_expecteddeliverydate_tz" "enum_users_cart_expecteddeliverydate_tz" DEFAULT 'Africa/Lagos';
  DO $$ BEGIN
   ALTER TABLE "users_cart_items" ADD CONSTRAINT "users_cart_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_cart_items_order_idx" ON "users_cart_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "users_cart_items_parent_id_idx" ON "users_cart_items" USING btree ("_parent_id");
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "coupon_id";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "address_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "addresses_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "coupons_id";
  DROP TYPE "public"."enum_coupons_startdate_tz";
  DROP TYPE "public"."enum_coupons_enddate_tz";`)
}
