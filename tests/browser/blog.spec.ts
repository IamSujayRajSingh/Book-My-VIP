import { test, expect } from "@playwright/test";

test.use({ javaScriptEnabled: false });

test("all ten Pattaya guides are readable, navigable and attributed without JavaScript", async ({
  page,
  request,
  baseURL,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const origin = new URL(baseURL!).origin;
  await page.goto("/blog/");
  const articles = page.locator("main article h2 a");
  await expect(articles).toHaveCount(10);
  const routes = await articles.evaluateAll((links) =>
    links.map((a) => a.getAttribute("href")!),
  );
  expect(new Set(routes).size).toBe(10);
  const titles = new Set<string>(),
    descriptions = new Set<string>(),
    paths = new Set<string>();
  for (const route of routes) {
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
    const title = await page.locator("main h1").innerText();
    titles.add(await page.title());
    descriptions.add(
      (await page.locator('meta[name="description"]').getAttribute("content"))!,
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "article",
    );
    const markup = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const post = markup
      .flatMap((text) => JSON.parse(text)["@graph"])
      .find((item) => item["@type"] === "BlogPosting");
    expect(post.headline).toBe(title);
    expect(post.author.name).toBe("Book My VIP");
    expect(post.datePublished).toBe(
      await page.locator("time").getAttribute("datetime"),
    );
    expect(
      (await page.locator(".story-body p").first().innerText()).length,
    ).toBeGreaterThan(50);
    const anchors = await page
      .locator(".story-contents a")
      .evaluateAll((links) =>
        links.map((a) => a.getAttribute("href")!.slice(1)),
      );
    for (const id of anchors)
      expect(
        await page.evaluate((id) => Boolean(document.getElementById(id)), id),
      ).toBeTruthy();
    for (const value of await page
      .locator("main a,main img")
      .evaluateAll((nodes) =>
        nodes.map((n) => n.getAttribute("href") || n.getAttribute("src")!),
      )) {
      const url = new URL(value, new URL(route, origin));
      if (url.origin === origin) paths.add(url.pathname);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390);
  }
  expect(titles.size).toBe(10);
  expect(descriptions.size).toBe(10);
  for (const path of paths)
    expect((await request.get(path)).status(), path).toBe(200);
  await page.goto("/blog/pattaya-vip-table-cost/");
  await expect(page.locator(".story-body table tbody tr")).toHaveCount(3);
});
