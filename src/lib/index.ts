import { init } from "@paralleldrive/cuid2";
import { config } from "../config";
import { client } from "../db/primary";

const createId = init({
  length: 7,
});

export function createDbId() {
  return createId();
}

type ElysiaSet = {
  headers: Record<string, string>;
  redirect?: string;
};

export function redirect(
  {
    set,
    headers,
  }: {
    set: ElysiaSet;
    headers: Record<string, string | null>;
  },
  url: string,
) {
  if (headers["hx-request"] === "true") {
    set.headers["HX-Location"] = url;
  } else {
    set.redirect = url;
  }
}

export async function syncIfLocal() {
  if (config.env.DATABASE_CONNECTION_TYPE === "local-replica") {
    await client.sync();
  }
}
