import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { ctx } from "../context";
import { organizations, user } from "../db/primary/schema";
import { getTenantDb, pushToTenantDb } from "../db/tenant";
import { createDbId, redirect } from "../lib";

export const organization = new Elysia({
  prefix: "/organization",
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
      redirect(set, "/login");
      return "Please sign in.";
    }
  })
  .post(
    "/",
    async ({ session, set, body, db, turso }) => {
      const dbName = "org-" + createDbId();

      const {
        database: { Name },
      } = await turso.databases.create({
        name: dbName,
        group: "test",
      });

      const { jwt } = await turso.logicalDatabases.mintAuthToken(
        "ethanniser",
        Name,
      );

      await pushToTenantDb({
        dbName: Name,
        authToken: jwt,
      });

      const [result] = await db
        .insert(organizations)
        .values({
          name: body.orgName,
          database_name: Name,
          database_auth_token: jwt,
        })
        .returning({
          id: organizations.id,
        });

      if (!result) {
        set.status = "Internal Server Error";
        return "Something went wrong";
      }

      await db
        .update(user)
        .set({
          buisness_id: result.id,
        })
        .where(eq(user.id, session.user.id));

      redirect(set, "/dashboard");
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
        redirect(set, "/login");
        return "Please sign in.";
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      set.status = "Internal Server Error";
      return "Something went wrong";
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
