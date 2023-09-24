import { init } from "@paralleldrive/cuid2";

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

export function redirect(set: ElysiaSet, url: string) {
  if (set.headers["HX-Request"] === "true") {
    set.headers["HX-Location"] = url;
  } else {
    set.redirect = url;
  }
}
