import Elysia from "elysia";
import { authController } from "./auth";
import { dbController } from "./db";
import { organization } from "./organization";

export const api = new Elysia({
  prefix: "/api",
})
  .use(authController)
  .use(dbController)
  .use(organization);
