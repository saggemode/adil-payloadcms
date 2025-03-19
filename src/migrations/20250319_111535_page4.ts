import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_flash_sales_rules_type" AS ENUM('minPurchase', 'maxDiscount', 'maxQuantity');
  CREATE TYPE "public"."enum_flash_sales_discount_type" AS ENUM('percentage', 'fixed');
  CREATE TABLE IF NOT EXISTS "flash_sales_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_flash_sales_rules_type" NOT NULL,
  	"value" numeric NOT NULL
  );
  
  ALTER TABLE "flash_sales" DROP CONSTRAINT "flash_sales_featured_image_id_media_id_fk";
  
  DROP INDEX IF EXISTS "flash_sales_featured_image_idx";
  DROP INDEX IF EXISTS "flash_sales_slug_idx";
  ALTER TABLE "products" ADD COLUMN "barcode" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_barcode" varchar;
  ALTER TABLE "flash_sales" ADD COLUMN "discount_type" "enum_flash_sales_discount_type" NOT NULL;
  ALTER TABLE "flash_sales" ADD COLUMN "discount_amount" numeric NOT NULL;
  ALTER TABLE "flash_sales" ADD COLUMN "stats_total_orders" numeric DEFAULT 0;
  ALTER TABLE "flash_sales" ADD COLUMN "stats_total_revenue" numeric DEFAULT 0;
  ALTER TABLE "flash_sales" ADD COLUMN "stats_total_discount" numeric DEFAULT 0;
  ALTER TABLE "flash_sales" ADD COLUMN "stats_average_order_value" numeric DEFAULT 0;
  DO $$ BEGIN
   ALTER TABLE "flash_sales_rules" ADD CONSTRAINT "flash_sales_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."flash_sales"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "flash_sales_rules_order_idx" ON "flash_sales_rules" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "flash_sales_rules_parent_id_idx" ON "flash_sales_rules" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "products_barcode_idx" ON "products" USING btree ("barcode");
  CREATE INDEX IF NOT EXISTS "_products_v_version_version_barcode_idx" ON "_products_v" USING btree ("version_barcode");
  ALTER TABLE "flash_sales" DROP COLUMN IF EXISTS "discount_percent";
  ALTER TABLE "flash_sales" DROP COLUMN IF EXISTS "featured_image_id";
  ALTER TABLE "flash_sales" DROP COLUMN IF EXISTS "minimum_purchase";
  ALTER TABLE "flash_sales" DROP COLUMN IF EXISTS "item_limit";
  ALTER TABLE "flash_sales" DROP COLUMN IF EXISTS "featured";
  ALTER TABLE "flash_sales" DROP COLUMN IF EXISTS "priority";
  ALTER TABLE "flash_sales" DROP COLUMN IF EXISTS "slug";
  ALTER TABLE "flash_sales" DROP COLUMN IF EXISTS "slug_lock";
  
  -- First, remove the default value constraint
  ALTER TABLE "public"."flash_sales" ALTER COLUMN "status" DROP DEFAULT;
  
  -- Then change the column type to text
  ALTER TABLE "public"."flash_sales" ALTER COLUMN "status" SET DATA TYPE text;
  
  -- Drop the old enum type
  DROP TYPE "public"."enum_flash_sales_status";
  
  -- Create the new enum type
  CREATE TYPE "public"."enum_flash_sales_status" AS ENUM('draft', 'scheduled', 'active', 'ended');
  
  -- Change the column type back to the new enum
  ALTER TABLE "public"."flash_sales" ALTER COLUMN "status" SET DATA TYPE "public"."enum_flash_sales_status" USING "status"::"public"."enum_flash_sales_status";
  
  -- Finally, set the default value
  ALTER TABLE "public"."flash_sales" ALTER COLUMN "status" SET DEFAULT 'draft'::"public"."enum_flash_sales_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "flash_sales_rules" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "flash_sales_rules" CASCADE;
  DROP INDEX IF EXISTS "products_barcode_idx";
  DROP INDEX IF EXISTS "_products_v_version_version_barcode_idx";
  ALTER TABLE "flash_sales" ADD COLUMN "discount_percent" numeric NOT NULL;
  ALTER TABLE "flash_sales" ADD COLUMN "featured_image_id" integer;
  ALTER TABLE "flash_sales" ADD COLUMN "minimum_purchase" numeric;
  ALTER TABLE "flash_sales" ADD COLUMN "item_limit" numeric DEFAULT 0;
  ALTER TABLE "flash_sales" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "flash_sales" ADD COLUMN "priority" numeric DEFAULT 0;
  ALTER TABLE "flash_sales" ADD COLUMN "slug" varchar;
  ALTER TABLE "flash_sales" ADD COLUMN "slug_lock" boolean DEFAULT true;
  DO $$ BEGIN
   ALTER TABLE "flash_sales" ADD CONSTRAINT "flash_sales_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "flash_sales_featured_image_idx" ON "flash_sales" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "flash_sales_slug_idx" ON "flash_sales" USING btree ("slug");
  ALTER TABLE "products" DROP COLUMN IF EXISTS "barcode";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_barcode";
  ALTER TABLE "flash_sales" DROP COLUMN IF EXISTS "discount_type";
  ALTER TABLE "flash_sales" DROP COLUMN IF EXISTS "discount_amount";
  ALTER TABLE "flash_sales" DROP COLUMN IF EXISTS "stats_total_orders";
  ALTER TABLE "flash_sales" DROP COLUMN IF EXISTS "stats_total_revenue";
  ALTER TABLE "flash_sales" DROP COLUMN IF EXISTS "stats_total_discount";
  ALTER TABLE "flash_sales" DROP COLUMN IF EXISTS "stats_average_order_value";
  
  -- First, remove the default value constraint
  ALTER TABLE "public"."flash_sales" ALTER COLUMN "status" DROP DEFAULT;
  
  -- Then change the column type to text
  ALTER TABLE "public"."flash_sales" ALTER COLUMN "status" SET DATA TYPE text;
  
  -- Drop the old enum type
  DROP TYPE "public"."enum_flash_sales_status";
  
  -- Create the new enum type
  CREATE TYPE "public"."enum_flash_sales_status" AS ENUM('draft', 'scheduled', 'active', 'completed', 'cancelled');
  
  -- Change the column type back to the new enum
  ALTER TABLE "public"."flash_sales" ALTER COLUMN "status" SET DATA TYPE "public"."enum_flash_sales_status" USING "status"::"public"."enum_flash_sales_status";
  
  -- Finally, set the default value
  ALTER TABLE "public"."flash_sales" ALTER COLUMN "status" SET DEFAULT 'draft'::"public"."enum_flash_sales_status";
  
  DROP TYPE "public"."enum_flash_sales_rules_type";
  DROP TYPE "public"."enum_flash_sales_discount_type";`)
}
