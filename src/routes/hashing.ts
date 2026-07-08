import * as argon2 from "argon2";
import { createHash } from "crypto";
    
    export async function hashPassword(DataToHash: string): Promise<string>{
    return await argon2.hash(DataToHash)
    
}

export async function checkPasswordHash(unHashedData: string, hash: string): Promise<boolean>{
    return await argon2.verify(hash, unHashedData)

}
export function hashEmail(email: string): string {
  return createHash("sha256").update(email).digest("hex")
}