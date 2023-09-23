import Elysia, { t } from "elysia";
import { BaseHtml } from "../../../components/base";
import { ctx } from "../../../context";

export const slashNew = new Elysia()
  .use(ctx)
  .get("/:organizationId/new", async ({ html }) => {
    return html(() => (
      <BaseHtml>
        <div>placeholder</div>
      </BaseHtml>
    ));
  });
