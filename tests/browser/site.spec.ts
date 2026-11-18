import { test, expect } from "@playwright/test";
import { pattayaDate } from "../../src/lib/whatsapp";
import { packages, formatPrice } from "../../src/data/packages";
import { mkdir } from "node:fs/promises";

const routes = [
  "/",
  "/vip-packages/",
  ...packages.map((p) => "/vip-packages/" + p.slug + "/"),
  "/contact/",
  "/how-it-works/",
  "/about/",
  "/faq/",
  "/pattaya-vip-table-booking/",
  "/privacy-policy/",
  "/booking-policy/",
  "/terms-and-conditions/",
];

test("pages, assets, links and contact destinations resolve", async ({
  page,
  request,
  baseURL,
}) => {
  const titles = new Set<string>(),
    descriptions = new Set<string>(),
    paths = new Set<string>();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  for (const route of routes) {
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    titles.add(await page.title());
    descriptions.add(
      (await page.locator("meta[name=description]").getAttribute("content"))!,
    );
    const links = await page
      .locator("a[href],img[src],link[rel=icon],link[rel=apple-touch-icon]")
      .evaluateAll((nodes) =>
        nodes.map((n) => n.getAttribute("href") || n.getAttribute("src")!),
      );
    for (const value of links) {
      const url = new URL(value, new URL(route, baseURL));
      if (url.origin === new URL(baseURL!).origin) paths.add(url.pathname);
      else if (url.host === "wa.me") expect(url.pathname).toBe("/66834691637");
      else if (url.host === "www.instagram.com")
        expect(url.href).toBe("https://www.instagram.com/bookmyvip");
      else throw new Error("Unexpected external link: " + url.href);
    }
    const html = await page.locator("main").innerText();
    expect(html).not.toMatch(
      /shisha|whisk[e]?y|glenfiddich|club money|chivas|mixture/i,
    );
  }
  for (const path of paths)
    expect((await request.get(path)).status(), path).toBe(200);
  expect(titles.size).toBe(routes.length);
  expect(descriptions.size).toBe(routes.length);
  expect(errors).toEqual([]);
});
for (const width of [360, 390, 768, 1024, 1440, 1920]) {
  test("layout fits " + width + " pixels", async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        route,
      ).toBeLessThanOrEqual(width);
      if (route === "/" && [390, 768, 1440].includes(width)) {
        await mkdir("test-results/layout", { recursive: true });
        await page.screenshot({
          path: "test-results/layout/home-" + width + ".png",
        });
      }
    }
  });
}
test("mobile menu, image navigation and FAQ open with keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Next atmosphere image" }).click();
  await expect(page.locator(".scene-number")).toHaveText("02 / 03");
  await page.getByRole("button", { name: "Previous atmosphere image" }).click();
  await expect(page.locator(".scene-number")).toHaveText("01 / 03");
  const toggle = page.locator(".mobile-menu summary");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "FAQ" })
    .click();
  await page.locator(".faq-list summary").first().click();
  await expect(page.locator(".faq-list details").first()).toHaveAttribute(
    "open",
    "",
  );
});
test("package detail, guest defaults, validity and WhatsApp message", async ({
  page,
}) => {
  await page.goto("/vip-packages/");
  await page
    .locator(".vip-premium .card-links")
    .getByRole("link", { name: "View details" })
    .click();
  await expect(page.locator("h1")).toHaveText("VIP Premium");
  await page.getByRole("link", { name: "Choose date & guests" }).click();
  await expect(page.getByLabel("Number of guests")).toHaveValue("6");
  const select = page.getByLabel("Preferred package");
  await select.selectOption("vip-package");
  await expect(page.getByLabel("Number of guests")).toHaveValue("4");
  await select.selectOption("vip-gold");
  await expect(page.getByLabel("Number of guests")).toHaveValue("");
  const form = page.locator("form");
  expect(
    await form.evaluate((f) => (f as HTMLFormElement).checkValidity()),
  ).toBe(false);
  await page.getByLabel("Number of guests").fill("7");
  await page.getByLabel("Preferred date").fill("2000-01-01");
  expect(
    await form.evaluate((f) => (f as HTMLFormElement).checkValidity()),
  ).toBe(false);
  await page.getByLabel("Preferred date").fill(pattayaDate());
  await page.getByText("Add optional details").click();
  await page.getByLabel("Your name").fill("Zoë");
  await page
    .getByLabel("Additional requests")
    .fill("Friends & family + birthday");
  await page.evaluate(() => {
    window.open = (url) => {
      document.body.dataset.opened = String(url);
      return null;
    };
  });
  await page.getByRole("button", { name: "Enquire on WhatsApp" }).click();
  const url = new URL(
    (await page.locator("body").getAttribute("data-opened"))!,
  );
  expect(url.origin + url.pathname).toBe("https://wa.me/66834691637");
  for (const text of [
    "VIP Gold",
    formatPrice(packages[2].price),
    "7",
    "Zoë",
    "Friends & family + birthday",
  ])
    expect(url.searchParams.get("text")).toContain(text);
  await expect(page.getByLabel("Number of guests")).toHaveValue("7");
});
test("unknown page returns 404", async ({ page }) => {
  expect((await page.goto("/missing-page-for-testing/"))?.status()).toBe(404);
  await expect(page.locator("main")).toContainText("Let’s get you back");
});
