import Elysia, { t } from "elysia";
import { ChatBubble } from "../components/chat";
import { ctx } from "../context";
import { getTenantDb } from "../db/tenant";
import { chats, tickets } from "../db/tenant/schema";
import { redirect } from "../lib";

export const chatController = new Elysia({
  prefix: "/chat",
})
  .use(ctx)
  .post(
    "/",
    async ({ db, body, set, headers, session }) => {
      console.log(body);
      const { organizationId, message, ticketId } = body;

      const organization = await db.query.organizations.findFirst({
        where: (organizations, { eq }) => eq(organizations.id, organizationId),
      });

      if (!organization) {
        set.status = "Not Found";
        return "Organization not found";
      }

      console.log({
        session,
        organizationId: {
          organizationId,
          type: typeof organizationId,
        },
        buisness_id: {
          buisness_id: session?.user.buisness_id,
          type: typeof session?.user.buisness_id,
        },
      });
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

      const [chat] = await tenantDb
        .insert(chats)
        .values({
          message,
          ticket_id: ticketId,
          sender: session ? "employee" : "customer",
        })
        .returning();

      if (!chat) {
        set.status = "Internal Server Error";
        return "Failed to send message";
      }

      await tenantDb.update(tickets).set({
        updatedAt: new Date(),
      });

      return <ChatBubble chat={chat} />;
    },
    {
      body: t.Object({
        organizationId: t.Number(),
        ticketId: t.Number(),
        message: t.String(),
      }),
      transform({ body }) {
        const organizationId = +body.organizationId;
        const ticketId = +body.ticketId;

        if (!Number.isNaN(organizationId) && !Number.isNaN(ticketId)) {
          body.organizationId = organizationId;
          body.ticketId = ticketId;
        }
      },
    },
  );
