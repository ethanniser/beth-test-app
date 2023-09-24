import Elysia from "elysia";
import { FancyLink } from "../components";
import { BaseHtml } from "../components/base";
import { DashBoard } from "../components/dashboard";
import { ctx } from "../context";
import { getTenantDb } from "../db/tenant";
import { Ticket } from "../db/tenant/schema/tickets";
import { redirect } from "../lib";

export const tickets = new Elysia()
  .use(ctx)
  .get("/tickets", async ({ html, session, db, set, headers }) => {
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

    const buisness_id = session.user.buisness_id;

    if (!buisness_id) {
      redirect(
        {
          set,
          headers,
        },
        "/new-user",
      );
      return;
    }

    const organization = await db.query.organizations.findFirst({
      where: (organizations, { eq }) => eq(organizations.id, buisness_id),
    });

    if (!organization) {
      redirect(
        {
          set,
          headers,
        },
        "/new-user",
      );
      return;
    }

    const { tenantDb } = getTenantDb({
      dbName: organization.database_name,
      authToken: organization.database_auth_token,
    });

    const tickets = await tenantDb.query.tickets.findMany({
      orderBy: (tickets, { asc }) => asc(tickets.created_at),
    });

    return html(() => (
      <BaseHtml>
        <DashBoard session={session}>
          <main class="flex-1 space-y-4 py-5">
            <div class="relative flex items-center justify-between px-6 py-3">
              <h2 class="text-5xl" safe>
                Manage Your Tickets - {organization.name}
              </h2>
              <div class="absolute inset-x-0 bottom-0 h-1 shadow-md"></div>
            </div>

            {!tickets || tickets.length === 0 ? (
              <div class="px-6 py-5 text-center">
                <p class="text-xl">You have no open tickets.</p>
              </div>
            ) : (
              <div class="grid grid-cols-1 gap-5 px-6 md:grid-cols-2 lg:grid-cols-3">
                {tickets.map((ticket) => (
                  <TicketCard
                    ticket={ticket}
                    organizationId={organization.id}
                  />
                ))}
              </div>
            )}
          </main>
        </DashBoard>
      </BaseHtml>
    ));
  });

function TicketCard({
  ticket,
  organizationId,
}: {
  ticket: Ticket;
  organizationId: number;
}) {
  return (
    <div class="relative rounded-md border p-5 shadow-lg">
      <div class="flex items-center justify-between">
        <p class="text-xl font-bold" safe>
          {ticket.subject}
        </p>
        {ticket.status === "open" ? (
          <span class="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
            Open
          </span>
        ) : (
          <span class="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
            Closed
          </span>
        )}
      </div>
      <p class="text-base text-gray-500">{ticket.description}</p>
      <p class="text-sm text-gray-400">
        Last updated:{" "}
        {ticket.updatedAt ? ticket.updatedAt.toDateString() : "Not yet updated"}
      </p>
      <FancyLink href={`/${organizationId}/ticket/${ticket.id}`} text="Open" />
    </div>
  );
}
