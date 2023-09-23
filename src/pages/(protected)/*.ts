import Elysia from "elysia";
import { ctx } from "../../context";
import { organization } from "./<organizationId>/*";
import { dashboard } from "./dashboard";
import { newUser } from "./new-user";

export const protectedRoutes = new Elysia({
  scoped: true,
})
  .use(dashboard)
  .use(organization)
  .use(newUser);
