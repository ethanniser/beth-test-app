import { pushToTenantDb } from ".";
import { db } from "../primary";
import { organizations } from "../primary/schema";

const test = await db
  .select({
    dbName: organizations.database_name,
    authToken: organizations.database_auth_token,
  })
  .from(organizations);

if (test) {
  test.forEach(async (org) => {
    await pushToTenantDb({
      dbName: org.dbName,
      authToken: org.authToken,
      input: true,
    });
    console.log("pushed to", org.dbName);
  });
}
