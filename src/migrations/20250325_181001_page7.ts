import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_social_media_platform" AS ENUM('facebook', 'twitter', 'instagram', 'pinterest', 'linkedin', 'whatsapp');
  CREATE TABLE IF NOT EXISTS "social_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum_social_media_platform" NOT NULL,
  	"is_enabled" boolean DEFAULT true,
  	"app_id" varchar,
  	"app_secret" varchar,
  	"api_key" varchar,
  	"api_secret" varchar,
  	"access_token" varchar,
  	"pinterest_access_token" varchar,
  	"client_id" varchar,
  	"client_secret" varchar,
  	"sharing_preferences_share_products" boolean DEFAULT true,
  	"sharing_preferences_share_blog_posts" boolean DEFAULT true,
  	"sharing_preferences_share_flash_sales" boolean DEFAULT true,
  	"default_share_message" varchar DEFAULT 'Check out this amazing product!',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "social_media_id" integer;
  CREATE INDEX IF NOT EXISTS "social_media_updated_at_idx" ON "social_media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "social_media_created_at_idx" ON "social_media" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_social_media_fk" FOREIGN KEY ("social_media_id") REFERENCES "public"."social_media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_social_media_id_idx" ON "payload_locked_documents_rels" USING btree ("social_media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "social_media" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "social_media" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_social_media_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_social_media_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "social_media_id";
  DROP TYPE "public"."enum_social_media_platform";`)
}
