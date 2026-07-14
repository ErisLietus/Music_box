import { Request, Response, Router } from "express";

import { BadRequestError, ConflictError } from "./error";
import { newPlaylist } from "../db/schema";
import { createPlaylist } from "../db/lookups";
import { requireAuth } from "./auth";
import { respondWithError, respondWithJSON } from "./json";

export const playlistRouter = Router()

playlistRouter.post("/create", requireAuth, (req, res, next) => {
    Promise.resolve(createPlaylistHandler(req, res)).catch(next)
})

async function  createPlaylistHandler(req: Request, res: Response){
    if(!req.userid){
        throw new BadRequestError("No user")
    }
    const user = req.userid
    const name = req.body.name
     const playlist: newPlaylist = {
        name: name,
        userId: user,
      };
    const playlistReturn = await createPlaylist(playlist)
    if (!playlistReturn){
            throw new ConflictError("This playlist name has already been used. Please choose another")
    }
    return respondWithJSON(res, 200, "Playlist has been made")
}