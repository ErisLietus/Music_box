import { pgTable, serial, text, integer, timestamp, pgEnum, boolean, varchar} from "drizzle-orm/pg-core"

export const mediaTypeEnum = pgEnum("media_type", ["audio", "video"])

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  hashedEmail: varchar("hashed_email", {length: 512}).notNull().unique(),
  hashedPassword: varchar("hashed_password", {length: 512}).notNull().default("unset"),
  createdAt: timestamp("created_at").defaultNow(),
})

export type NewUser = typeof users.$inferInsert;

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {onDelete: "cascade"}),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isPublic: boolean().notNull(),
})

export type newPlaylist = typeof playlists.$inferInsert;

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").references(() => playlists.id, {onDelete: "cascade"}),
  title: text("title").notNull(),
  fileUrl: text("file_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  type: mediaTypeEnum("type").notNull()
})

export type newMedia = typeof media.$inferInsert;

export const refreshTokens = pgTable("refresh_tokens", {
  token: text("token").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userID:integer("user_id")
  .notNull()
  .references(() => users.id, {onDelete: "cascade"}),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
});

export type NewRefreshToken = typeof refreshTokens.$inferInsert
