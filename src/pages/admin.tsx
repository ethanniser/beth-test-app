import Elysia from "elysia";
import { BaseHtml } from "../components/base";
import { DashBoard } from "../components/dashboard";
import { config } from "../config";
import { ctx } from "../context";
import { redirect } from "../lib";

export const admin = new Elysia()
  .use(ctx)
  .get("/admin", async ({ html, session, db, set, headers }) => {
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

    const buisness = await db.query.organizations.findFirst({
      where: (organizations, { eq }) => eq(organizations.id, buisness_id),
      with: {
        users: true,
      },
    });

    if (!buisness) {
      redirect(
        {
          set,
          headers,
        },
        "/new-user",
      );
      return;
    }
    const employees = buisness.users.filter((user) => user.role !== "admin");

    return html(() => (
      <BaseHtml>
        <DashBoard session={session}>
          <main class="flex-1 space-y-6 py-6">
            <div class="relative flex items-center justify-between px-6 pb-4">
              <h2 class="text-5xl" safe>
                Manage Your Organization - {buisness.name}
              </h2>
              <div class="absolute inset-x-0 bottom-0 h-1 shadow-md"></div>
            </div>

            <div class="flex flex-col">
              <CopyItem
                name="Employee Invite Code"
                value={buisness.database_name}
                id="code-to-copy"
              />
              <CopyItem
                name="Customer Create Ticket Link"
                value={`${config.env.HOST_URL}/${buisness.id}/new`}
                id="link-to-copy"
              />
            </div>

            <div class="px-6 py-4">
              <h3 class="mb-6 text-2xl font-bold">Employees</h3>
              {!employees || employees.length === 0 ? (
                <p class="text-xl">
                  You have no employees. Have one sign up and use the code to
                  add one.
                </p>
              ) : (
                <ul class="space-y-6">
                  {employees.map((employee) => (
                    <li class="flex items-center justify-between rounded border p-5 shadow-lg">
                      <div class="flex items-center space-x-6">
                        <img
                          src={employee.picture}
                          alt={employee.name}
                          class="h-14 w-14 rounded-full"
                        />
                        <div>
                          <p class="text-xl font-bold" safe>
                            {employee.name}
                          </p>
                          <p class="text-lg text-gray-700" safe>
                            {employee.email || "No Email"}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </main>
        </DashBoard>
      </BaseHtml>
    ));
  });

function CopyItem({
  name,
  value,
  id,
}: {
  name: string;
  value: string;
  id: string;
}) {
  return (
    <div class="flex items-center space-x-6 px-6 py-4">
      <span class="text-2xl font-bold">
        {name}:{" "}
        <span class="pl-4 text-lg font-medium" safe id={id}>
          {value}
        </span>
      </span>
      <button
        _={`on click throttled at 1s
              call copyCodeToClipboard(#${id}) 
              then set my innerHTML to 'Copied!' 
              then set my classList to 'rounded px-5 py-3 text-white bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50' 
              then wait 1s 
              then set my innerHTML to 'Copy to Clipboard'
              then set my classList to 'rounded bg-gray-800 px-5 py-3 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50'`}
        class="rounded bg-gray-800 px-5 py-3 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
      >
        Copy to Clipboard
      </button>
    </div>
  );
}
