import { NextFunction, Request, Response } from "express";
import { respondWithError } from "./json";

class HTTPError extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}
export class BadRequestError extends HTTPError {
  constructor(message: string) {
    super(message, 400)
  }
}
export class UnauthorizedError extends HTTPError {
  constructor(message: string) {
    super(message, 401)
  }
}
export class ForbiddenError extends HTTPError {
  constructor(message: string) {
    super(message, 403)
  }
}
export class NotFoundError extends HTTPError {
  constructor(message: string) {
    super(message, 404)
  }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction){
    if(err instanceof HTTPError){
        respondWithError(res, err.statusCode, err.message)
    }else{
      console.log(err)
    respondWithError(res, 500, "Something has gone wrong on our end")
}
}

