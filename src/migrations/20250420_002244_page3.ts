import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_returns_items_reason" AS ENUM('damaged', 'wrong_item', 'not_as_described', 'changed_mind', 'sizing_issue', 'other');
  CREATE TYPE "public"."enum_returns_items_condition" AS ENUM('new', 'used', 'damaged');
  CREATE TYPE "public"."enum_returns_customer_messages_sent_by" AS ENUM('customer', 'admin');
  CREATE TYPE "public"."enum_returns_status" AS ENUM('pending', 'approved', 'rejected', 'received', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_returns_return_method" AS ENUM('store_dropoff', 'mail', 'pickup');
  CREATE TYPE "public"."enum_returns_refund_type" AS ENUM('full_refund', 'partial_refund', 'store_credit', 'replacement', 'no_refund');
  CREATE TABLE IF NOT EXISTS "returns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"quantity" numeric NOT NULL,
  	"reason" "enum_returns_items_reason" NOT NULL,
  	"reason_details" varchar,
  	"condition" "enum_returns_items_condition"
  );
  
  CREATE TABLE IF NOT EXISTS "returns_customer_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" varchar NOT NULL,
  	"sent_by" "enum_returns_customer_messages_sent_by" NOT NULL,
  	"sent_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "returns_return_receipt_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "returns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"return_id" varchar,
  	"order_id" integer NOT NULL,
  	"user_id" integer NOT NULL,
  	"status" "enum_returns_status" DEFAULT 'pending' NOT NULL,
  	"request_date" timestamp(3) with time zone,
  	"return_method" "enum_returns_return_method",
  	"refund_type" "enum_returns_refund_type" DEFAULT 'full_refund',
  	"refund_amount" numeric,
  	"is_refund_processed" boolean DEFAULT false,
  	"refund_processed_date" timestamp(3) with time zone,
  	"admin_notes" varchar,
  	"return_shipping_label" varchar,
  	"return_shipping_carrier" varchar,
  	"return_tracking_number" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "returns_id" integer;
  DO $$ BEGIN
   ALTER TABLE "returns_items" ADD CONSTRAINT "returns_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "returns_items" ADD CONSTRAINT "returns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "returns_customer_messages" ADD CONSTRAINT "returns_customer_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "returns_return_receipt_images" ADD CONSTRAINT "returns_return_receipt_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "returns_return_receipt_images" ADD CONSTRAINT "returns_return_receipt_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "returns" ADD CONSTRAINT "returns_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "returns" ADD CONSTRAINT "returns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "returns_items_order_idx" ON "returns_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "returns_items_parent_id_idx" ON "returns_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "returns_items_product_idx" ON "returns_items" USING btree ("product_id");
  CREATE INDEX IF NOT EXISTS "returns_customer_messages_order_idx" ON "returns_customer_messages" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "returns_customer_messages_parent_id_idx" ON "returns_customer_messages" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "returns_return_receipt_images_order_idx" ON "returns_return_receipt_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "returns_return_receipt_images_parent_id_idx" ON "returns_return_receipt_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "returns_return_receipt_images_image_idx" ON "returns_return_receipt_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "returns_order_idx" ON "returns" USING btree ("order_id");
  CREATE INDEX IF NOT EXISTS "returns_user_idx" ON "returns" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "returns_updated_at_idx" ON "returns" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "returns_created_at_idx" ON "returns" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_returns_fk" FOREIGN KEY ("returns_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_returns_id_idx" ON "payload_locked_documents_rels" USING btree ("returns_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "returns_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "returns_customer_messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "returns_return_receipt_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "returns" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "returns_items" CASCADE;
  DROP TABLE "returns_customer_messages" CASCADE;
  DROP TABLE "returns_return_receipt_images" CASCADE;
  DROP TABLE "returns" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_returns_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_returns_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "returns_id";
  DROP TYPE "public"."enum_returns_items_reason";
  DROP TYPE "public"."enum_returns_items_condition";
  DROP TYPE "public"."enum_returns_customer_messages_sent_by";
  DROP TYPE "public"."enum_returns_status";
  DROP TYPE "public"."enum_returns_return_method";
  DROP TYPE "public"."enum_returns_refund_type";`)
}
