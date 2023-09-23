import Elysia, { t } from "elysia";
import { ctx } from "../context";

export const organization = new Elysia({
  prefix: "/organization",
})
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    return { session };
  })
  .post(
    "/",
    async ({ session, set, body }) => {
      if (!session) {
        set.status = "Unauthorized";
        set.redirect = "/signin";
        set.headers["HX-Redirect"] = "/signin";
        return "Please sign in.";
      }
    },
    {
      body: t.Object({
        orgName: t.String({
          minLength: 1,
          maxLength: 30,
        }),
      }),
    },
  )
  .post(
    "/join",
    async ({ session, set, body }) => {
      if (!session) {
        set.status = "Unauthorized";
        set.redirect = "/signin";
        set.headers["HX-Redirect"] = "/signin";
        return "Please sign in.";
      }
    },
    {
      body: t.Object({
        joinCode: t.String({
          minLength: 1,
          maxLength: 30,
        }),
      }),
    },
  );
