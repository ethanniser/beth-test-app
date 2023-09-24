import Elysia from "elysia";
import { maybeAuthed } from "../auth/middleware";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";
import { redirect } from "../lib";

export const login = new Elysia()
  .use(ctx)
  .get("/login", async ({ session, set, html }) => {
    if (session) {
      redirect(set, "/");
      return;
    }

    return html(() => (
      <BaseHtml>
        <div class="flex h-screen w-full flex-col items-center justify-center bg-gray-300 p-4">
          <div class="pb-4">
            <a
              href="/"
              class="text-xl text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Go Home
            </a>
          </div>
          <div class="w-full rounded-lg bg-white p-8 shadow-lg md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5">
            <div class="pb-4 text-center text-2xl font-bold">Beth Saas</div>

            <button class="flex w-full items-center justify-center rounded-lg bg-gray-800 p-4 transition duration-200 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
              <a
                hx-boost="false"
                href="/api/auth/login/google"
                class="text-center text-xl text-white"
              >
                Sign In with Google
              </a>
              <div class="i-logos-google-icon ml-2 inline-block text-3xl" />
            </button>
          </div>
        </div>
      </BaseHtml>
    ));
  });
