import Elysia from "elysia";
import { ctx } from "../context";

export const maybeAuthed = new Elysia({
  name: "@app/plugins/maybeAuthed",
})
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    return { session };
  });

export const authed = new Elysia({
  name: "@app/plugins/authed",
})
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    if (!session) return;

    return { session };
  })
  .onBeforeHandle(({ session, set, log }) => {
    if (!session) {
      set.redirect = "/login";
      set.headers["HX-Location"] = "/";
      return "Please sign in.";
    }
  });
