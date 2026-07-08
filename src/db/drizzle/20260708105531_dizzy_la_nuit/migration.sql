CREATE TYPE "media_type" AS ENUM('audio', 'video');--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY,
	"playlist_id" integer,
	"title" text NOT NULL,
	"file_url" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"type" "media_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playlists" (
	"id" serial PRIMARY KEY,
	"user_id" integer,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"isPublic" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"token" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"username" text NOT NULL UNIQUE,
	"hashed_password" varchar(512) DEFAULT 'unset' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_playlist_id_playlists_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlists"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;