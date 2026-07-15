import { Request, Response, Router } from "express";
import { BadRequestError } from "./error";
import { createMedia, getMediaPosition, getPlaylistByUser } from "../db/lookups";
import { respondWithJSON } from "./json";
import { newMedia } from "../db/schema";
import { title } from "node:process";
import { requireAuth } from "./auth";

export const mediaRouter = Router()

mediaRouter.post("/link", requireAuth, (req, res, next) => {
    Promise.resolve(importMediaLinkHandler(req, res)).catch(next)
})

type parameters = { playlistName: string, mediaUrl: string, title: string };


export async function importMediaLinkHandler(req: Request, res: Response){
    const user = req.userid
    if(!user){
        throw new BadRequestError("No user")
    }
    const param: parameters = req.body
    if(!param.mediaUrl || !param.playlistName || !param.title){
        throw new BadRequestError("No media, title or playlist")
    } 
    const playlist = await getPlaylistByUser(user, param.playlistName)
    if(!playlist){
        throw new BadRequestError("No playlist found")
    }
    const num = await getMediaPosition(playlist.id)
    let position = 0
    if(!num.max_position){
        position++
    } else {
        position += num.max_position + 1
    }
    const type = "link"
    const media: newMedia = {
        playlistId: playlist.id,
        title: param.title,
        position: position,
        addedByUserId: user,
        fileUrl: param.mediaUrl,
        type: type
    }
    await createMedia(media)
    return respondWithJSON(res, 200, "Media has been uploaded")
}

/*export async function importMediaUploadHandler(req: Request, res: Response){
    const user = req.userid
    if(!user){
        throw new BadRequestError("No user")
    }
    const param: parameters = req.body
    if(!param.mediaUrl || !param.playlistName){
        throw new BadRequestError("No media or playlist")
    } 
    const playlist = await getPlaylistByUser(user, param.playlistName)
    if(!playlist){
        throw new BadRequestError("No playlist found")
    }
    const num = await getMediaPosition(playlist.id)
    let position = 0
    if(!num.max_position){
        position++
    } else {
        position += num.max_position + 1
    }
    const type = "link"
    const media: newMedia = {
        playlistId: playlist.id,
        title: title,
        position: position,
        addedByUserId: user,
        fileUrl: param.mediaUrl,
        type: type
    }
    createMedia(media)
    return respondWithJSON(res, 200, "Media has been uploaded")
}
*/