import Elysia, { t } from "elysia";
import { BaseHtml } from "../../../components/base";
import { ctx } from "../../../context";

export const slashNew = new Elysia().use(ctx).get(
  "/:organizationId/new",
  async ({ html, params, db }) => {
    const organization = await db.query.organizations.findFirst({
      where: (organizations, { eq }) =>
        eq(organizations.id, params.organizationId),
    });

    if (!organization) {
      return html(() => (
        <BaseHtml>
          <h1>An Organization was not found</h1>
          <p>Please config your link is correct</p>
        </BaseHtml>
      ));
    }

    return html(() => (
      <BaseHtml>
        <div
          class="flex h-screen w-full flex-col items-center justify-center bg-gray-300"
          hx-ext="response-targets"
        >
          <h1
            class="mb-6 rounded-lg bg-gray-800 p-5 text-4xl font-bold text-white shadow-md"
            safe
          >
            Submit a new ticket to {organization.name}
          </h1>
          <form
            hx-post="/api/ticket"
            hx-swap="innerHTML"
            hx-target-4xx="#errorMessage"
            hx-target-5xx="#errorMessage"
            class="w-full max-w-3xl rounded-lg bg-white p-12 shadow-lg"
            data-loading-states
          >
            <label
              for="subject"
              class="block pb-3 text-xl font-medium text-gray-700"
            >
              Subject
            </label>
            <input
              type="text"
              name="subject"
              id="subject"
              placeholder="Enter subject"
              required="true"
              minlength="3"
              maxlength="50"
              pattern="^[-a-zA-Z0-9]*$"
              class="mb-8 w-full rounded-md border p-4 text-xl focus:border-transparent focus:bg-gray-500 focus:outline-none focus:ring-4"
            />
            <label
              for="description"
              class="block pb-3 text-xl font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              placeholder="Enter description"
              required="true"
              minlength="10"
              maxlength="500"
              rows="4"
              class="w-full rounded-md border p-4 text-xl focus:border-transparent focus:bg-gray-500 focus:outline-none focus:ring-4"
            />
            <div class="py-4" />
            <button
              type="submit"
              data-loading-disable
              class="flex w-full items-center justify-center rounded-md bg-gray-800 p-4 text-xl text-white hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Create Ticket
              <div
                data-loading
                class="i-lucide-loader-2 animate-spin pl-4 text-3xl"
              />
            </button>
            <div id="errorMessage" class="pt-6 text-xl text-red-600"></div>
            <input
              type="hidden"
              name="organizationId"
              value={organization.id.toString()}
            />
          </form>
          <div class="absolute bottom-8 w-full text-center">
            <h2 class="text-3xl font-semibold focus:bg-gray-700">Beth Saas</h2>
          </div>
        </div>
      </BaseHtml>
    ));
  },
  {
    params: t.Object({
      organizationId: t.Numeric(),
    }),
  },
);
