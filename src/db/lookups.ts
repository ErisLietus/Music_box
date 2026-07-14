import { db } from "./indexDB";
import { media, newMedia, newPlaylist, NewUser, playlists, users } from "./schema";
import { and, eq, max } from "drizzle-orm";


export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function updateUserPass(id: number, password:string) {
  const [result] = await db.update(users)
        .set({hashedPassword: password})
        .where(eq(users.id, id))
        .returning()
  return result
}

export async function getUserByName(name: string) {
  const result = await db.select().from(users).where(eq(users.username, name));
  return result[0];
}

export async function getUserByEmail(name: string) {
  const result = await db.select().from(users).where(eq(users.hashedEmail, name));
  return result[0];
}

export async function createPlaylist(playlist: newPlaylist) {
  const [result] = await db
    .insert(playlists)
    .values(playlist)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getPlaylistByUser(userID: number, playlistName: string) {
  const [result] = await db
  .select()
  .from(playlists)
  .where(and(eq(playlists.userId, userID),eq(playlists.name, playlistName)))
  return result
}


export async function getMediaByPlaylist(playlist_id: number){
  const result = await db
    .select({username: users.username,
      title: media.title,
      id: media.id,
      type: media.type,
      fileUrl: media.fileUrl,
      position : media.position,
      created : media.createdAt
    })
    .from(media)
    .innerJoin(users, eq(media.addedByUserId, users.id))
    .where(eq(media.playlistId, playlist_id))

    return result
}

export async function getMediaPosition(playlist: number) {
  const [result] = await db
  .select({max_position : max(media.position)})
  .from(media)
  .where(eq(media.playlistId, playlist))
  return result
}

export async function createMedia(nMedia: newMedia) {
  const [result] = await db
  .insert(media)
  .values(nMedia)
  .returning()
  return result
}