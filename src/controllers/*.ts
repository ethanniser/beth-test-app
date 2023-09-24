import Elysia from "elysia";
import { authController } from "./auth";
import { chatController } from "./chat";
import { dbController } from "./db";
import { organization } from "./organization";
import { ticketController } from "./ticket";

export const api = new Elysia({
  prefix: "/api",
})
  .use(chatController)
  .use(ticketController)
  .use(authController)
  .use(dbController)
  .use(organization);
