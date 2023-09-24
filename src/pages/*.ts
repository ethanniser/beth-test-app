import Elysia from "elysia";
import { organization } from "./<organizationId>/*";
import { admin } from "./admin";
import { dashboard } from "./dashboard";
import { index } from "./index";
import { login } from "./login";
import { newUser } from "./new-user";
import { tickets } from "./tickets";

export const pages = new Elysia()
  .use(organization)
  .use(index)
  .use(login)
  .use(admin)
  .use(dashboard)
  .use(newUser)
  .use(tickets);
