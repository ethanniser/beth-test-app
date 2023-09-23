import Elysia from "elysia";
import { protectedRoutes } from "./(protected)/*";
import { db } from "./db";
import { index } from "./index";
import { login } from "./login";

export const pages = new Elysia()
  .use(index)
  .use(login)
  .use(db)
  .use(protectedRoutes);
