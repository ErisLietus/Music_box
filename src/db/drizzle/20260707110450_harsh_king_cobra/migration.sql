ALTER TABLE "users" RENAME COLUMN "password" TO "hashed_password";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "hashed_password" SET DATA TYPE varchar(512) USING "hashed_password"::varchar(512);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "hashed_password" SET DEFAULT 'unset';--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_key" UNIQUE("username");