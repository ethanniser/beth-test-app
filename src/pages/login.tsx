import Elysia from "elysia";
import { maybeAuthed } from "../auth/middleware";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";
import { redirect } from "../lib";

export const login = new Elysia()
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    return { session };
  })
  .get("/login", async ({ session, set, html }) => {
    if (session) {
      redirect(set, "/");
      return;
    }

    return html(() => (
      <BaseHtml>
        <div
          class="flex h-screen w-full flex-col items-center justify-center bg-gray-200"
          hx-ext="response-targets"
        >
          <div class="p-4">
            <a
              href="/"
              class="text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Go Home
            </a>
          </div>
          <form
            hx-post="/api/auth/signInOrUp"
            hx-swap="innerHTML"
            hx-target-4xx="#errorMessage"
            class="w-96 rounded-lg bg-white p-8 shadow-md"
          >
            <div class="flex items-center justify-center rounded-lg bg-gray-800 p-2 transition duration-200 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
              <a
                hx-boost="false"
                href="/api/auth/login/google"
                class="text-center text-white"
              >
                Sign In with Google
              </a>
              <div class="i-logos-google-icon ml-2 inline-block text-2xl" />
            </div>

            <div id="errorMessage" class="pt-4 text-red-500"></div>
          </form>
        </div>
      </BaseHtml>
    ));
  });
