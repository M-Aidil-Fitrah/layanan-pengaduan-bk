import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { chromium } from "playwright-core";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const databaseAvailable = process.env.EXPECT_DATABASE_AVAILABLE === "true";
const browser = await chromium.launch({
  args: ["--disable-extensions"],
  executablePath: "/usr/bin/google-chrome",
  headless: true,
});

const browserErrors = [];
const viewportResults = [];

async function openPage(path, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });

  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(`[${path} ${width}px] ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => browserErrors.push(`[${path} ${width}px] ${error.message}`));

  await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
  await page.locator("h1").waitFor();
  await page.waitForTimeout(300);

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  assert.equal(dimensions.scrollWidth, dimensions.clientWidth, `Horizontal overflow at ${path} ${width}px`);
  return page;
}

try {
  for (const { height, width } of [
    { height: 844, width: 390 },
    { height: 1024, width: 768 },
    { height: 1000, width: 1440 },
  ]) {
    for (const path of ["/", "/pengaduan", "/lacak"]) {
      const page = await openPage(path, width, height);
      viewportResults.push({ path, width });

      if (path === "/") {
        await page.screenshot({ path: join(tmpdir(), `ruang-bk-home-${width}.png`) });
      }
      if (path === "/pengaduan") {
        await page.screenshot({ fullPage: true, path: join(tmpdir(), `ruang-bk-form-${width}.png`) });
      }

      await page.close();
    }
  }

  const mobilePage = await openPage("/", 390, 844);
  const menu = mobilePage.locator("#main-navigation");
  const menuButton = mobilePage.locator(".menu-toggle");

  await menuButton.click();
  await menu.waitFor({ state: "visible" });
  assert.equal(await menuButton.getAttribute("aria-expanded"), "true");
  await mobilePage.close();

  const categoryPage = await openPage("/", 1440, 1000);
  const personalCategory = categoryPage.getByRole("link", { name: /Masalah pribadi/ });
  assert.match(await personalCategory.getAttribute("href"), /^\/pengaduan\?category=PERSONAL$/);
  await personalCategory.click();
  await categoryPage.waitForURL(/\/pengaduan\?category=PERSONAL$/);
  assert.equal(await categoryPage.locator('input[name="category"][value="PERSONAL"]').isChecked(), true);
  await categoryPage.close();

  const formPage = await openPage("/pengaduan?category=PERSONAL", 1440, 1000);
  let postedPayload;

  formPage.on("request", (request) => {
    if (request.method() === "POST" && request.url().endsWith("/api/v1/complaints")) {
      postedPayload = request.postDataJSON();
    }
  });

  await formPage.getByRole("button", { name: /Lanjutkan/ }).click();
  await formPage.locator('input[name="audience"][value="STUDENT"]').check();
  await formPage.locator('input[name="urgency"][value="CONSULTATION"]').check();
  await formPage.locator("#reporter-name").fill("Nama sementara");
  await formPage.locator("#reporter-contact").fill("kontak-sementara");
  await formPage.getByRole("switch", { name: /Kirim secara anonim/ }).check();
  assert.equal(await formPage.locator("#reporter-name").count(), 0);
  assert.equal(await formPage.locator("#reporter-contact").count(), 0);
  await formPage.getByRole("button", { name: /Lanjutkan/ }).click();
  await formPage.locator("#complaint-title").fill("Kesulitan beradaptasi");
  await formPage.locator("#complaint-details").fill("Saya merasa kesulitan beradaptasi dengan lingkungan belajar baru.");
  await formPage.getByRole("button", { name: /Lanjutkan/ }).click();
  await formPage.locator('.consent-card input[type="checkbox"]').check();
  assert.deepEqual(browserErrors, [], `Browser errors before submission:\n${browserErrors.join("\n")}`);
  await formPage.getByRole("button", { name: /Kirim pengaduan/ }).click();

  if (databaseAvailable) {
    await formPage.getByRole("heading", { name: /Terima kasih sudah berani bercerita/ }).waitFor();
    await formPage.locator(".tracking-code-box output").waitFor();
  } else {
    await formPage.getByText(/Penyimpanan belum tersedia/).waitFor();
  }

  assert.ok(postedPayload, "Complaint request payload was not captured");
  assert.equal(postedPayload.isAnonymous, true);
  assert.equal("name" in postedPayload, false);
  assert.equal("contact" in postedPayload, false);
  await formPage.close();

  const trackingPage = await openPage("/lacak", 1440, 1000);
  await trackingPage.locator("#tracking-code").fill("ABC");
  await trackingPage.getByRole("button", { name: "Periksa status" }).click();
  await trackingPage.getByText(/Masukkan kode pengaduan yang lengkap/).waitFor();
  await trackingPage.close();

  const unexpectedBrowserErrors = browserErrors.filter(
    (message) => databaseAvailable || !message.includes("status of 503 (Service Unavailable)"),
  );
  assert.deepEqual(unexpectedBrowserErrors, [], `Unexpected browser errors:\n${unexpectedBrowserErrors.join("\n")}`);
  console.log(JSON.stringify({ browserErrors: unexpectedBrowserErrors, viewportResults }, null, 2));
} finally {
  await browser.close();
}
