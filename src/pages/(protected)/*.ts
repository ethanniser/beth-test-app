import Elysia from "elysia";
import { ctx } from "../../context";
import { organization } from "./<organizationId>/*";
import { admin } from "./admin";
import { dashboard } from "./dashboard";
import { newUser } from "./new-user";

export const protectedRoutes = new Elysia()
  .use(newUser)
  .use(dashboard)
  .use(organization)
  .use(admin);
