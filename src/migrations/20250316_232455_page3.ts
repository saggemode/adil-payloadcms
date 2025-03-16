import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_flash_sales_status" AS ENUM('draft', 'scheduled', 'active', 'completed', 'cancelled');
  CREATE TABLE IF NOT EXISTS "flash_sales" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"discount_percent" numeric NOT NULL,
  	"status" "enum_flash_sales_status" DEFAULT 'draft' NOT NULL,
  	"featured_image_id" integer,
  	"minimum_purchase" numeric,
  	"item_limit" numeric DEFAULT 0,
  	"total_quantity" numeric NOT NULL,
  	"sold_quantity" numeric DEFAULT 0,
  	"featured" boolean DEFAULT false,
  	"priority" numeric DEFAULT 0,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "flash_sales_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  ALTER TABLE "products" ADD COLUMN "flash_sale_id" varchar;
  ALTER TABLE "products" ADD COLUMN "flash_sale_end_date" timestamp(3) with time zone;
  ALTER TABLE "products" ADD COLUMN "flash_sale_discount" numeric;
  ALTER TABLE "_products_v" ADD COLUMN "version_flash_sale_id" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_flash_sale_end_date" timestamp(3) with time zone;
  ALTER TABLE "_products_v" ADD COLUMN "version_flash_sale_discount" numeric;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "flash_sales_id" integer;
  DO $$ BEGIN
   ALTER TABLE "flash_sales" ADD CONSTRAINT "flash_sales_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "flash_sales_rels" ADD CONSTRAINT "flash_sales_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."flash_sales"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "flash_sales_rels" ADD CONSTRAINT "flash_sales_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "flash_sales_featured_image_idx" ON "flash_sales" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "flash_sales_slug_idx" ON "flash_sales" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "flash_sales_updated_at_idx" ON "flash_sales" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "flash_sales_created_at_idx" ON "flash_sales" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "flash_sales_rels_order_idx" ON "flash_sales_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "flash_sales_rels_parent_idx" ON "flash_sales_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "flash_sales_rels_path_idx" ON "flash_sales_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "flash_sales_rels_products_id_idx" ON "flash_sales_rels" USING btree ("products_id");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_flash_sales_fk" FOREIGN KEY ("flash_sales_id") REFERENCES "public"."flash_sales"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_flash_sales_id_idx" ON "payload_locked_documents_rels" USING btree ("flash_sales_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "flash_sales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "flash_sales_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "flash_sales" CASCADE;
  DROP TABLE "flash_sales_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_flash_sales_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_flash_sales_id_idx";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "flash_sale_id";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "flash_sale_end_date";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "flash_sale_discount";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_flash_sale_id";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_flash_sale_end_date";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_flash_sale_discount";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "flash_sales_id";
  DROP TYPE "public"."enum_flash_sales_status";`)
}
