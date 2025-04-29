import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_terms_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_terms_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_terms_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_terms_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_terms_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_terms_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_terms_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TABLE IF NOT EXISTS "terms_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_terms_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_terms_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_terms_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE IF NOT EXISTS "terms_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "terms_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "terms_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_terms_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL,
  	"link_appearance" "enum_terms_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE IF NOT EXISTS "terms_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "terms_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "terms_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_terms_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_terms_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "terms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"last_updated" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "terms_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"terms_id" integer
  );
  
  ALTER TABLE "terms_blocks_content_columns" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_blocks_content" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_blocks_media_block" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_blocks_cta_links" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_blocks_cta" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_blocks_form_block" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_blocks_archive" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_rels" ENABLE ROW LEVEL SECURITY;
  
  -- Add foreign key constraint for terms_id
  DO $$ BEGIN
    ALTER TABLE "terms_rels" ADD CONSTRAINT "terms_rels_terms_id_terms_id_fk" FOREIGN KEY ("terms_id") REFERENCES "public"."terms"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "terms_rels_terms_id_idx" ON "terms_rels" USING btree ("terms_id");
  
  -- Add terms_id to payload_locked_documents_rels
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "terms_id" integer;
  EXCEPTION
    WHEN undefined_table THEN
      -- Create the table if it doesn't exist
      CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
        "id" serial PRIMARY KEY NOT NULL,
        "order" integer,
        "parent_id" integer NOT NULL,
        "path" varchar NOT NULL,
        "terms_id" integer
      );
  END $$;
  
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_terms_fk" FOREIGN KEY ("terms_id") REFERENCES "public"."terms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_terms_id_idx" ON "payload_locked_documents_rels" USING btree ("terms_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "wishlists_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"added_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "wishlists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "terms_blocks_content_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_blocks_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_blocks_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_blocks_archive" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "terms_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "terms_blocks_content_columns" CASCADE;
  DROP TABLE "terms_blocks_content" CASCADE;
  DROP TABLE "terms_blocks_media_block" CASCADE;
  DROP TABLE "terms_blocks_cta_links" CASCADE;
  DROP TABLE "terms_blocks_cta" CASCADE;
  DROP TABLE "terms_blocks_form_block" CASCADE;
  DROP TABLE "terms_blocks_archive" CASCADE;
  DROP TABLE "terms" CASCADE;
  DROP TABLE "terms_rels" CASCADE;
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_terms_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "terms_id";
  DROP TYPE "public"."enum_terms_blocks_content_columns_size";
  DROP TYPE "public"."enum_terms_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_terms_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_terms_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_terms_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_terms_blocks_archive_populate_by";
  DROP TYPE "public"."enum_terms_blocks_archive_relation_to";`)
}
