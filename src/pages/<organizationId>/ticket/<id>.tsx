import Elysia, { t } from "elysia";
import { BaseHtml } from "../../../components/base";
import { ChatPage } from "../../../components/chat";
import { DashBoard } from "../../../components/dashboard";
import { ctx } from "../../../context";

export const id = new Elysia().use(ctx).get(
  "/:organizationId/ticket/:id",
  async ({ html, params, session, set, headers }) => {
    return html(() => (
      <BaseHtml>
        {/* <ChatPage organizationId={params.organizationId} ticketId={params.id} /> */}
        {session ? (
          <DashBoard session={session}>
            <main class="w-full">
              <ChatPage
                organizationId={params.organizationId}
                ticketId={params.id}
                employeeName={session.user.name}
              />
            </main>
          </DashBoard>
        ) : (
          <ChatPage
            organizationId={params.organizationId}
            ticketId={params.id}
          />
        )}
      </BaseHtml>
    ));
  },
  {
    params: t.Object({
      id: t.Numeric(),
      organizationId: t.Numeric(),
    }),
  },
);
