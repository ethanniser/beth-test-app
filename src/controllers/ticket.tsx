import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { ctx } from "../context";
import { getTenantDb } from "../db/tenant";
import { tickets } from "../db/tenant/schema";
import { redirect } from "../lib";

export const ticketController = new Elysia({
  prefix: "/ticket",
})
  .use(ctx)
  .get("/", ({ set, headers }) => {
    console.log(set.headers["Host"] ?? "No HX-Request header");
    set.headers["FOO"] = "BAR";
    return "Hello World";
  })
  .post(
    "/",
    async ({ db, body, set, headers }) => {
      const { organizationId, subject, description } = body;

      const organization = await db.query.organizations.findFirst({
        where: (organizations, { eq }) => eq(organizations.id, organizationId),
      });

      if (!organization) {
        set.status = "Not Found";
        return "Organization not found";
      }

      const { tenantDb } = getTenantDb({
        dbName: organization.database_name,
        authToken: organization.database_auth_token,
      });

      const [ticket] = await tenantDb
        .insert(tickets)
        .values({
          subject,
          description,
        })
        .returning();

      if (!ticket) {
        set.status = "Internal Server Error";
        return "Failed to create ticket";
      }

      redirect(
        {
          set,
          headers,
        },
        `/${organizationId}/ticket/${ticket.id}`,
      );
    },
    {
      body: t.Object({
        organizationId: t.Numeric(),
        subject: t.String(),
        description: t.String(),
      }),
    },
  )
  .post(
    "/close",
    async ({ db, body, set, headers, session }) => {
      const { organizationId, ticketId } = body;

      const organization = await db.query.organizations.findFirst({
        where: (organizations, { eq }) => eq(organizations.id, organizationId),
      });

      if (!organization) {
        set.status = "Not Found";
        return "Organization not found";
      }

      if (session && session.user.buisness_id !== organizationId) {
        set.status = "Forbidden";
        redirect(
          {
            set,
            headers,
          },
          "/dashboard",
        );
      }

      const { tenantDb } = getTenantDb({
        dbName: organization.database_name,
        authToken: organization.database_auth_token,
      });

      const [ticket] = await tenantDb
        .update(tickets)
        .set({
          status: "closed",
          closed_at: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(tickets.id, ticketId))
        .returning();

      if (!ticket) {
        set.status = "Internal Server Error";
        return "Failed to update ticket";
      }

      redirect(
        {
          set,
          headers,
        },
        `/${organizationId}/ticket/${ticket.id}`,
      );
    },
    {
      body: t.Object({
        ticketId: t.Numeric(),
        organizationId: t.Numeric(),
      }),
    },
  )
  .post(
    "/open",
    async ({ db, body, set, headers, session }) => {
      const { organizationId, ticketId } = body;

      const organization = await db.query.organizations.findFirst({
        where: (organizations, { eq }) => eq(organizations.id, organizationId),
      });

      if (!organization) {
        set.status = "Not Found";
        return "Organization not found";
      }

      if (session && session.user.buisness_id !== organizationId) {
        set.status = "Forbidden";
        redirect(
          {
            set,
            headers,
          },
          "/dashboard",
        );
      }

      const { tenantDb } = getTenantDb({
        dbName: organization.database_name,
        authToken: organization.database_auth_token,
      });

      const [ticket] = await tenantDb
        .update(tickets)
        .set({
          status: "open",
          closed_at: null,
          updatedAt: new Date(),
        })
        .where(eq(tickets.id, ticketId))
        .returning();

      if (!ticket) {
        set.status = "Internal Server Error";
        return "Failed to update ticket";
      }

      redirect(
        {
          set,
          headers,
        },
        `/${organizationId}/ticket/${ticket.id}`,
      );
    },
    {
      body: t.Object({
        ticketId: t.Numeric(),
        organizationId: t.Numeric(),
      }),
    },
  );
