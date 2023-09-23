import { Elysia } from "elysia";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";

export const newUser = new Elysia()
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
  .get("/new-user", async ({ html, session }) => {
    return html(() => (
      <BaseHtml>
        <div
          class="flex h-screen w-full flex-col items-center justify-center bg-gray-200"
          hx-ext="response-targets"
        >
          <div class="p-4 pb-8 text-center text-3xl font-semibold">
            Thanks for signing up {session.user.name}, please create or join an
            organization to get started
          </div>

          <form
            hx-post="/api/organization"
            hx-swap="innerHTML"
            hx-target-4xx="#errorMessage"
            class=" w-96 rounded-lg bg-white p-8 shadow-md"
          >
            <div class="mb-4">
              <label
                for="orgName"
                class=" block text-sm font-medium text-gray-600"
              >
                Organization Name
              </label>
              <input
                type="text"
                name="orgName"
                id="orgName"
                placeholder="Enter organization name"
                class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              type="submit"
              class="w-full rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
            >
              Create Organization
            </button>
          </form>
          <div id="errorMessage" class="pt-4 text-red-500"></div>

          <form
            hx-post="/api/organization/join"
            hx-swap="innerHTML"
            hx-target-4xx="#errorMessageJoin"
            class="w-96 rounded-lg bg-white p-8 shadow-md"
          >
            <div class="mb-4">
              <label
                for="joinCode"
                class=" block text-sm font-medium text-gray-600"
              >
                Join with Code (get from organization admin)
              </label>
              <input
                type="text"
                name="joinCode"
                id="joinCode"
                placeholder="Enter code"
                class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              type="submit"
              class="w-full rounded-md bg-green-600 p-2 text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
            >
              Join Organization
            </button>
          </form>

          <div id="errorMessageJoin" class="pt-4 text-red-500"></div>
        </div>
      </BaseHtml>
    ));
  });
