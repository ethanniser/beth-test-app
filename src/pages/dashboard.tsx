import { Elysia } from "elysia";
import { set } from "zod";
import { BaseHtml } from "../components/base";
import { DashBoard } from "../components/dashboard";
import { ctx } from "../context";
import { buisnesses } from "../db/primary/schema";

export const dashboard = new Elysia()
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    if (!session) {
      ctx.set.redirect = "/login";
      ctx.set.headers["HX-Location"] = "/";
      return;
    }

    return { session };
  })
  .get("/dashboard", async ({ html, session, db, set }) => {
    const buisnessId = session.user.buisnessId;

    if (!buisnessId) {
      set.redirect = "/new-user";
      set.headers["HX-Location"] = "/new-user";
      return;
    }

    const buisness = await db.query.buisnesses.findFirst({
      where: (buisnesses, { eq }) => eq(buisnesses.id, buisnessId),
    });

    if (!buisness) {
      set.redirect = "/new-user";
      set.headers["HX-Location"] = "/new-user";
      return;
    }

    return html(() => (
      <BaseHtml>
        <DashBoard>
          <main class="flex-1 space-y-4 py-5">
            <div class="relative flex items-center justify-between px-6 py-3">
              <div>
                <h2 class="text-5xl" safe>
                  Welcome, {session.user.name}
                </h2>
                <p class="text-xl">Here is the overview of your account:</p>
              </div>

              <div class="text-right text-xl" safe>
                {buisness.name}
              </div>

              <div class="absolute inset-x-0 bottom-0 h-1 shadow-md"></div>
            </div>

            <div class="grid grid-cols-1 gap-5 px-5 md:grid-cols-2 lg:grid-cols-3">
              <Card name="Unclosed Tickets" value="14" href="#" />
              <Card name="Tickets Closed Today" value="5" href="#" />
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
      <div class="group absolute bottom-3 right-3 flex items-center space-x-2 rounded bg-gray-200 px-3 py-1 text-sm text-gray-600 transition duration-150 ease-in-out hover:bg-gray-300 hover:text-gray-800">
        <a href={href}>View</a>
        <div class="i-lucide-arrow-up-right transform transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </div>
  );
}
