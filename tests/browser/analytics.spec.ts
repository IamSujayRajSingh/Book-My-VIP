import { test, expect } from "@playwright/test";

test("optional analytics respects the visitor's choice", async ({ page }) => {
  const requests: string[] = [];
  await page.route("https://www.googletagmanager.com/**", async (route) => {
    requests.push(route.request().url());
    await route.fulfill({ contentType: "application/javascript", body: "" });
  });
  await page.goto("/vip-packages/vip-premium/?ref=test-only");
  const panel = page.locator("#privacy-choice");
  expect(requests).toEqual([]);
  if (!(await panel.count())) {
    await expect(page.getByRole("button", { name: "Analytics preferences" })).toHaveCount(0);
    return;
  }
  await expect(panel).toBeVisible();
  await page.getByRole("button", { name: "Decline" }).click();
  await page.reload();
  await expect(panel).toBeHidden();
  expect(requests).toEqual([]);
  await page.getByRole("button", { name: "Analytics preferences" }).click();
  await page.getByRole("button", { name: "Allow analytics" }).click();
  await expect.poll(() => requests.length).toBe(1);
  const commands = await page.evaluate(() => JSON.stringify(window.dataLayer));
  expect(commands).toContain("package_view");
  expect(commands).toContain("vip-premium");
  expect(commands).not.toContain("ref=test-only");
  await page.getByRole("button", { name: "Analytics preferences" }).click();
  await page.getByRole("button", { name: "Decline" }).click();
  await expect(panel).toBeHidden();
  await page.reload();
  expect(requests.length).toBe(1);
});
