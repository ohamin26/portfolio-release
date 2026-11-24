import { expect, test } from "@playwright/test";

test("the production server responds to its health probe", async ({ request }) => {
  const response = await request.get("/health");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/json");
  expect(await response.json()).toEqual({ status: "ok" });
});
