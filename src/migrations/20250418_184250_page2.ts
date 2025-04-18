import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "invoice_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"template" jsonb NOT NULL,
  	"is_default" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "orders" ADD COLUMN "invoice_delivery_preferences_send_email" boolean DEFAULT true;
  ALTER TABLE "orders" ADD COLUMN "invoice_delivery_preferences_send_whats_app" boolean DEFAULT false;
  ALTER TABLE "orders" ADD COLUMN "invoice_delivery_preferences_send_s_m_s" boolean DEFAULT false;
  ALTER TABLE "orders" ADD COLUMN "invoice_delivery_status_email_sent" boolean DEFAULT false;
  ALTER TABLE "orders" ADD COLUMN "invoice_delivery_status_whatsapp_sent" boolean DEFAULT false;
  ALTER TABLE "orders" ADD COLUMN "invoice_delivery_status_sms_sent" boolean DEFAULT false;
  ALTER TABLE "orders" ADD COLUMN "invoice_delivery_status_last_sent_at" timestamp(3) with time zone;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "invoice_templates_id" integer;
  CREATE INDEX IF NOT EXISTS "invoice_templates_updated_at_idx" ON "invoice_templates" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "invoice_templates_created_at_idx" ON "invoice_templates" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invoice_templates_fk" FOREIGN KEY ("invoice_templates_id") REFERENCES "public"."invoice_templates"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_invoice_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("invoice_templates_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "invoice_templates" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "invoice_templates" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_invoice_templates_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_invoice_templates_id_idx";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "invoice_delivery_preferences_send_email";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "invoice_delivery_preferences_send_whats_app";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "invoice_delivery_preferences_send_s_m_s";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "invoice_delivery_status_email_sent";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "invoice_delivery_status_whatsapp_sent";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "invoice_delivery_status_sms_sent";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "invoice_delivery_status_last_sent_at";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "invoice_templates_id";`)
}
