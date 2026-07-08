import { db } from "./indexDB";
import { NewUser, users } from "./schema";
import { eq } from "drizzle-orm";


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