import { Request, Response, Router } from "express";

import { BadRequestError } from "./error";
import { newPlaylist } from "../db/schema";
import { createPlaylist } from "../db/lookups";
import { requireAuth } from "./auth";
import { respondWithJSON } from "./json";

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
    await createPlaylist(playlist)
    return respondWithJSON(res, 200, "Playlist has been made")
}