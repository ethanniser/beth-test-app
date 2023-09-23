import { createId, init } from "@paralleldrive/cuid2";

init({
  length: 7,
});

export function createBuisnessCode() {
  return createId();
}
