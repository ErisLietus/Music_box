export {}
 
 declare global {
  namespace Express {
    interface Request {
      userid?: number
    }
  }
}