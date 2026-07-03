import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core"

export const mediaTypeEnum = pgEnum("media_type", ["audio", "video"])

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {onDelete: "cascade"}),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").references(() => playlists.id, {onDelete: "cascade"}),
  title: text("title").notNull(),
  fileUrl: text("file_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  type: mediaTypeEnum("type").notNull()
})
