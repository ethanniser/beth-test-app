import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { ctx } from "../context";
import { organizations, user } from "../db/primary/schema";
import { getTenantDb, pushToTenantDb } from "../db/tenant";
import { createDbId, redirect, syncIfLocal } from "../lib";

export const organization = new Elysia({
  prefix: "/organization",
})
  .use(ctx)
  .post(
    "/",
    async ({ session, set, body, db, turso, headers }) => {
      if (!session) {
        redirect(
          {
            set,
            headers,
          },
          "/login",
        );
        return "Please sign in.";
      }
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
          role: "admin",
        })
        .where(eq(user.id, session.user.id));

      await syncIfLocal();

      redirect(
        {
          set,
          headers,
        },
        "/dashboard",
      );
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
    async ({ session, set, body, db, headers }) => {
      if (!session) {
        redirect(
          {
            set,
            headers,
          },
          "/login",
        );
        return "Please sign in.";
      }

      const buisness = await db.query.organizations.findFirst({
        where: (organizations, { eq }) =>
          eq(organizations.database_name, body.joinCode),
      });

      console.log(buisness);

      if (!buisness) {
        set.status = "Not Found";
        return "Organization not found";
      }

      await db
        .update(user)
        .set({
          buisness_id: buisness.id,
        })
        .where(eq(user.id, session.user.id));

      await syncIfLocal();

      redirect(
        {
          set,
          headers,
        },
        "/dashboard",
      );
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
