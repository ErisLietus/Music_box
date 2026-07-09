ALTER TYPE "media_type" ADD VALUE 'link';--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "position" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "playlists" ADD COLUMN "allowCollabEdits" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "playlist_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "playlists" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "playlists" ALTER COLUMN "isPublic" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "hashed_email" DROP DEFAULT;