ALTER TABLE "users" ADD COLUMN "hashed_email" varchar(512) DEFAULT 'unset' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_hashed_email_key" UNIQUE("hashed_email");