import { User } from "./user";

export {};

declare global {
  namespace Express {
    interface Request {
      users: User
    }
  }
}