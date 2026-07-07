import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "./error";
import { db } from "../db/indexDB";
import { NewUser, users } from "../db/schema";
import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import { respondWithJSON } from "./json";
import { Router } from "express";

export const authRouter = Router();
authRouter.post("/register", (req, res, next) => {
  Promise.resolve(handlerUsersCreate(req, res)).catch(next)})

authRouter.post("/login", (req, res, next) => {
  Promise.resolve(loginHandler(req, res)).catch(next)})


export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getUserByName(name: string) {
  const result = await db.select().from(users).where(eq(users.username, name));
  return result[0];
}

  type parameters = { password: string, username: string };

  export async function handlerUsersCreate(req: Request, res: Response) {
    console.log("hit")
  const params: parameters = req.body
 

  if (!params.username || !params.password) {
    throw new BadRequestError("Email or password missing.")
  }
   const fetch = await getUserByName(params.username)
  if (fetch){
    return respondWithJSON(res, 400, "That Username has been taken")
  }
  const hashedPassword = await hashPassword(params.password);
  const userParams: NewUser = {
    username: params.username,
    hashedPassword: hashedPassword,
  };
  const user = await createUser(userParams)
  return respondWithJSON(res, 201, "User has been created")
}
 

export async function loginHandler(req: Request, res: Response){
    const input: parameters = req.body
    

    if(!input.username|| !input.password){
        throw new UnauthorizedError("Incorrect email or password")
    }


    const user = await getUserByName(input.username)
    if(!user){
        throw new UnauthorizedError("incorrect email or password")
    }

    if(!await checkPasswordHash(input.password, user.hashedPassword)){
        throw new UnauthorizedError("incorrect email or password")
    }
    return respondWithJSON(res,200, "Welcome back to the Music Box")
     

    }

    export async function hashPassword(userPassword: string): Promise<string>{
    return await argon2.hash(userPassword)
    
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean>{
    return await argon2.verify(hash, password)

}