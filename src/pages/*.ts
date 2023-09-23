import Elysia from "elysia";
import { authGroup } from "./(auth)/*";
import { organization } from "./<organizationId>/*";
import { dashboard } from "./dashboard";
import { db } from "./db";
import { index } from "./index";
import { newUser } from "./new-user";

export const pages = new Elysia()
  .use(index)
  .use(authGroup)
  .use(db)
  .use(dashboard)
  .use(organization)
  .use(newUser)
