import { Elysia } from "elysia";
import { authed } from "../../auth/middleware";
import { BaseHtml } from "../../components/base";
import { ctx } from "../../context";
import { redirect } from "../../lib";

export const newUser = new Elysia()
  .use(ctx)
  .get("/new-user", async ({ html, session, set }) => {
    if (!session) {
      redirect(set, "/");
      return "Please sign in.";
    }

    if (session.user.buisness_id) {
      redirect(set, "/dashboard");
      return "redirecting...";
    }

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
            hx-target-5xx="#errorMessage"
            class="w-96 rounded-lg bg-white p-8 shadow-md"
            data-loading-states
          >
            <label
              for="orgName"
              class="block text-sm font-medium text-gray-600"
            >
              Organization Name (numbers and letters only)
            </label>
            <input
              type="text"
              name="orgName"
              id="orgName"
              placeholder="Enter organization name"
              required="true"
              pattern="^org-[a-z0-9]{7}$"
              class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              type="submit"
              data-loading-disable
              class="flex w-full items-center justify-center rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Create Organization
              <div
                data-loading
                class="i-lucide-loader-2 ml-2 animate-spin text-2xl"
              />
            </button>
            <div id="errorMessage" class="pt-4 text-red-500"></div>
          </form>

          <form
            hx-post="/api/organization/join"
            hx-swap="innerHTML"
            hx-target-4xx="#errorMessageJoin"
            hx-target-5xx="#errorMessageJoin"
            class="w-96 rounded-lg bg-white p-8 shadow-md"
            data-loading-states
          >
            <label
              for="joinCode"
              class="block text-sm font-medium text-gray-600"
            >
              Join with Code (get from organization admin)
            </label>
            <input
              type="text"
              name="joinCode"
              id="joinCode"
              placeholder="Enter code"
              required="true"
              pattern="^[-a-zA-Z0-9]*$"
              class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              data-loading-disable
              class="flex w-full items-center justify-center rounded-md bg-green-600 p-2 text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Join Organization
              <div
                data-loading
                class="i-lucide-loader-2 ml-2 animate-spin text-2xl"
              />
            </button>
            <div id="errorMessageJoin" class="pt-4 text-red-500"></div>
          </form>
        </div>
      </BaseHtml>
    ));
  });
