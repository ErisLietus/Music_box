import { NextFunction, Request, Response } from "express";
import { BadRequestError, UnauthorizedError, ConflictError } from "./error";
import {  envOrThrow } from "../db/indexDB";
import { NewUser } from "../db/schema";
import { respondWithJSON } from "./json";
import { Router } from "express";
import { makeRefreshToken, createRefreshToken, refreshHandler, revokeHandler } from "./refresh";
import { getUserByEmail, getUserByName, createUser, updateUserPass } from "../db/lookups";
import { makeJWT, validateJWT } from "./jwt";
import { hashPassword, hashEmail, checkPasswordHash } from "./hashing";


export const authRouter = Router();
authRouter.post("/register", (req, res, next) => {
  Promise.resolve(handlerUsersCreate(req, res)).catch(next)})

authRouter.post("/login", (req, res, next) => {
  Promise.resolve(loginHandler(req, res)).catch(next)})

authRouter.post("/refresh", (req, res, next) => {
  Promise.resolve(refreshHandler(req, res)).catch(next)})

authRouter.post("/revoke", (req, res, next) => {
  Promise.resolve(revokeHandler(req, res)).catch(next)})

authRouter.post("/password-reset", (req, res, next) => {
  Promise.resolve(resetPasswordHandler(req, res)).catch(next)})


  type parameters = { password: string, username: string, email: string };

  export async function handlerUsersCreate(req: Request, res: Response) {
    console.log("hit")
  const params: parameters = req.body
 

  if (!params.username || !params.password || !params.email) {
    throw new BadRequestError("Username ,Email or password missing.")
  }
   const hashedEmail = hashEmail(params.email)
   const fetchName = await getUserByName(params.username)
   const fetchEmail = await getUserByEmail(hashedEmail)
  if (fetchName) {
  throw new ConflictError("That username has been taken");
}
if (fetchEmail) {
  throw new ConflictError("That email has been taken");
}

  const hashedPassword = await hashPassword(params.password);
  
  const userParams: NewUser = {
    username: params.username,
    hashedPassword: hashedPassword,
    hashedEmail: hashedEmail,
  };
  await createUser(userParams)
  return respondWithJSON(res, 201, "User has been created")
}
  type loginParams = {username: string, password: string};


  

export async function loginHandler(req: Request, res: Response){
    const input: loginParams = req.body
    

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
    const jwtToken = makeJWT(user.id, 60*60, envOrThrow("JWT_SECRET"))
     const refreshToken = makeRefreshToken()
        await createRefreshToken(refreshToken, user.id)
        console.log("Welcome back to the music box")
    return respondWithJSON(res, 200, {
        id: user.id,
        user: user.username,
        createdAt: user.createdAt,
        token: jwtToken,
        refreshToken: refreshToken,
        
      });
    }
    type resetParams = {email: string, newPassword: string};

export async function resetPasswordHandler(req: Request, res: Response){
        const input: resetParams = req.body
        if(!input.email || !input.newPassword){
          throw new BadRequestError("Email or new password missing")
        }
        const hash = hashEmail(input.email)
        const user = await getUserByEmail(hash)
        if(!user){
          return respondWithJSON(res,200, "Password has been updated")
        }
        const hashedPassword = await hashPassword(input.newPassword)
        await updateUserPass(user.id, hashedPassword)
        return respondWithJSON(res, 200, "Password has been updated")
}

export function getBearerToken(req: Request): string{
    const auth = req.get("Authorization")
    if(typeof auth !== "string"){
        throw new UnauthorizedError("An Error occurred")
    }
    return auth.replace("Bearer ", "").trim()
}



export function requireAuth(req: Request, res: Response, next: NextFunction){
  try{
    const token = getBearerToken(req)
    const user = validateJWT(token, envOrThrow("JWT_SECRET"))
    req.userid = Number(user)
    return next()
  }catch(error){
      return 
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      next(error)
  }
 
}






