import { refreshTokens, users, NewRefreshToken,  } from "../db/schema";
import { db } from "../db/indexDB";
import { eq, and,gt,isNull } from "drizzle-orm";
import { Request, Response } from "express";
import { UnauthorizedError } from "./error";
import { makeJWT } from "./auth";
import { respondWithJSON } from "./json";
import { envOrThrow } from "../db/indexDB";
import { randomBytes } from "crypto";

export async function createRefreshToken(token: string, id: number){
    const sixtyDays = 1000 * 60 * 60 * 24 * 60;
    const expiresAt = new Date(Date.now() + sixtyDays);

    const refreshToken: NewRefreshToken = {
        userID: id, 
        expiresAt: expiresAt,
        token: token
    } 

    const [result] = await db
        .insert(refreshTokens)
        .values(refreshToken)
        .returning();
      return result;
}



export async function getUserFromRefreshToken(token: string) {
  const result = await db
    .select({ id: users.id})
    .from(users)
    .innerJoin(refreshTokens, eq(refreshTokens.userID, users.id))
    .where(
      and(
        eq(refreshTokens.token, token),
        gt(refreshTokens.expiresAt, new Date()),
        isNull(refreshTokens.revokedAt),
      ),
    );
  return result[0];
}

export async function revokeRefreshToken(token:string) {
    await db
  .update(refreshTokens)
  .set({ revokedAt: new Date(), updatedAt: new Date() })
  .where(eq(refreshTokens.token, token));
}

export function getBearerToken(req: Request): string{
    const auth = req.get("Authorization")
    if(typeof auth !== "string"){
        throw new UnauthorizedError("An Error occurred")
    }
    return auth.replace("Bearer ", "").trim()
}

export function makeRefreshToken(){
    return randomBytes(32).toString("hex")
}

export async function refreshHandler(req: Request, res: Response){
    const token = getBearerToken(req)
    const user = await getUserFromRefreshToken(token)

    if(user === undefined){
        throw new UnauthorizedError("An Error has occurred")
    }else{
        const jwttoken = makeJWT(user.id, 60* 60 , envOrThrow("JWT_SECRET"))
        respondWithJSON(res, 200, {token: jwttoken})
    }
}

export async function revokeHandler(req: Request, res: Response){
    const token = getBearerToken(req)
    await revokeRefreshToken(token)

    res.status(204).send()

}