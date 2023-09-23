import Elysia, { t } from "elysia";
import { BaseHtml } from "../../../../components/base";
import { ctx } from "../../../../context";

export const id = new Elysia().use(ctx).get(
  "/:organizationId/ticket/:id",
  async ({ html }) => {
    return html(() => (
      <BaseHtml>
        <div>placeholder</div>
      </BaseHtml>
    ));
  },
  {
    params: t.Object({
      id: t.Numeric(),
    }),
  },
);
