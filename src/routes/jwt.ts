import { JwtPayload} from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./error";



type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: number, expiresIn: number, secret: string): string{
  const stringId = userID.toString()
   const issuedAt = Math.floor(Date.now() / 1000)
   const expiresAt = issuedAt + expiresIn

   const payload: payload ={
    iss: "music_box", 
    sub: stringId, 
    iat: issuedAt,
    exp: expiresAt
   } 
   return jwt.sign(payload, secret)

}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const token = jwt.verify(tokenString, secret)

        if (typeof token === "string") {
            throw new UnauthorizedError("jwt Error")
        }

        if (!token.sub || typeof token.sub !== "string") {
            throw new UnauthorizedError("jwt Error")
        }

        return token.sub
    } catch {
        throw new UnauthorizedError("jwt Error")
    }
}