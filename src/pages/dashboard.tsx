import { and, eq, gt, lt, sql } from "drizzle-orm";
import { Elysia } from "elysia";
import { authed } from "../auth/middleware";
import { FancyLink } from "../components";
import { BaseHtml } from "../components/base";
import { DashBoard } from "../components/dashboard";
import { ctx } from "../context";
import { organizations } from "../db/primary/schema";
import { getTenantDb } from "../db/tenant";
import { tickets } from "../db/tenant/schema";
import { redirect } from "../lib";

export const dashboard = new Elysia()
  .use(ctx)
  .get("/dashboard", async ({ html, session, db, set, headers }) => {
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

    const result = await tenantDb.batch([
      // select all tickets that are open
      tenantDb
        .select({
          unclosedTickets: sql<number>`count(*)`,
        })
        .from(tickets)
        .where(eq(tickets.status, "open")),
      // select all tickets that are closed today
      tenantDb
        .select({
          closedLastDay: sql<number>`count(*)`,
        })
        .from(tickets)
        .where(
          and(
            eq(tickets.status, "closed"),
            gt(
              tickets.closed_at,
              new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
            ), // 24 hours ago
            lt(tickets.closed_at, new Date()), // Now
          ),
        ),
    ]);

    const unclosedTickets = result[0][0]?.unclosedTickets ?? 0;
    const closedLastDay = result[1][0]?.closedLastDay ?? 0;

    return html(() => (
      <BaseHtml>
        <DashBoard session={session}>
          <main class="flex-1 space-y-4 py-5">
            <div class="relative flex items-center justify-between px-6 py-3">
              <div>
                <h2 class="text-5xl" safe>
                  Welcome, {session.user.name}
                </h2>
                <p class="text-xl">Here is the overview of your account:</p>
              </div>

              <div class="pr-10 text-right text-5xl" safe>
                {organization.name}
              </div>

              <div class="absolute inset-x-0 bottom-0 h-1 shadow-md"></div>
            </div>

            <div class="grid grid-cols-1 gap-5 px-5 md:grid-cols-2 lg:grid-cols-3">
              <Card
                name="Unclosed Tickets"
                value={unclosedTickets.toString()}
                href="/tickets"
              />
              <Card
                name="Tickets Closed Today"
                value={closedLastDay.toString()}
                href="/tickets"
              />
              <Card
                name="Customer Satisfaction This Week"
                value="50%"
                href="#"
              />
            </div>
          </main>
        </DashBoard>
      </BaseHtml>
    ));
  });

function Card({
  name,
  value,
  href,
}: {
  name: string;
  value: string;
  href: string;
}) {
  return (
    <div class="relative rounded-md border p-5">
      <h3 class="text-xl">{name}</h3>
      <p class="font-bold">{value}</p>
      <FancyLink href={href} text="View" />
    </div>
  );
}
