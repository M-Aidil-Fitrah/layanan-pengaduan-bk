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

async function openPage(width, height) {
  const page = await browser.newPage({ viewport: { width, height } });

  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(`[${width}px] ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => browserErrors.push(`[${width}px] ${error.message}`));

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator("h1").waitFor();
  await page.waitForTimeout(500);

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  assert.equal(
    dimensions.scrollWidth,
    dimensions.clientWidth,
    `Horizontal overflow detected at ${width}px`,
  );

  const screenshot = join(tmpdir(), `ruang-bk-${width}.png`);
  const formScreenshot = join(tmpdir(), `ruang-bk-form-${width}.png`);
  await page.screenshot({ fullPage: true, path: screenshot });
  await page.locator("#pengaduan").screenshot({ path: formScreenshot });
  viewportResults.push({ formScreenshot, screenshot, width });

  return page;
}

try {
  const mobilePage = await openPage(390, 844);
  const menu = mobilePage.locator("#main-navigation");
  const menuButton = mobilePage.locator(".menu-toggle");

  await menuButton.click();
  await assert.doesNotReject(() => menu.waitFor({ state: "visible" }));
  assert.equal(await menuButton.getAttribute("aria-expanded"), "true");
  await mobilePage.close();

  const tabletPage = await openPage(768, 1024);
  await tabletPage.close();

  const desktopPage = await openPage(1440, 1000);
  let postedPayload;

  desktopPage.on("request", (request) => {
    if (request.method() === "POST" && request.url().endsWith("/api/v1/complaints")) {
      postedPayload = request.postDataJSON();
    }
  });

  await desktopPage.getByRole("button", { name: /Masalah pribadi/ }).click();
  assert.equal(
    await desktopPage.locator('input[name="category"][value="PERSONAL"]').isChecked(),
    true,
  );
  await desktopPage.getByRole("button", { name: /Lanjutkan/ }).click();

  await desktopPage.locator('input[name="audience"][value="STUDENT"]').check();
  await desktopPage.locator('input[name="urgency"][value="CONSULTATION"]').check();
  await desktopPage.locator("#reporter-name").fill("Nama sementara");
  await desktopPage.locator("#reporter-contact").fill("kontak-sementara");
  await desktopPage.getByRole("switch", { name: /Kirim secara anonim/ }).check();
  assert.equal(await desktopPage.locator("#reporter-name").count(), 0);
  assert.equal(await desktopPage.locator("#reporter-contact").count(), 0);
  await desktopPage.getByRole("button", { name: /Lanjutkan/ }).click();

  await desktopPage.locator("#complaint-title").fill("Kesulitan beradaptasi");
  await desktopPage.locator("#complaint-details").fill("Saya merasa kesulitan beradaptasi dengan lingkungan belajar baru.");
  await desktopPage.getByRole("button", { name: /Lanjutkan/ }).click();
  await desktopPage.locator('.consent-card input[type="checkbox"]').check();
  assert.deepEqual(browserErrors, [], `Browser errors detected before submission:\n${browserErrors.join("\n")}`);
  await desktopPage.getByRole("button", { name: /Kirim pengaduan/ }).click();

  if (databaseAvailable) {
    await desktopPage.getByRole("heading", { name: /Terima kasih sudah berani bercerita/ }).waitFor();
    await desktopPage.locator(".tracking-code-box output").waitFor();
  } else {
    await desktopPage.getByText(/Penyimpanan belum tersedia/).waitFor();
  }

  assert.ok(postedPayload, "Complaint request payload was not captured");
  assert.equal(postedPayload.isAnonymous, true);
  assert.equal("name" in postedPayload, false);
  assert.equal("contact" in postedPayload, false);

  await desktopPage.locator("#tracking-code").fill("ABC");
  await desktopPage.getByRole("button", { name: "Periksa status" }).click();
  await desktopPage.getByText(/Masukkan kode pengaduan yang lengkap/).waitFor();
  await desktopPage.close();

  const unexpectedBrowserErrors = browserErrors.filter(
    (message) => databaseAvailable || !message.includes("status of 503 (Service Unavailable)"),
  );
  assert.deepEqual(unexpectedBrowserErrors, [], `Unexpected browser errors detected:\n${unexpectedBrowserErrors.join("\n")}`);
  console.log(JSON.stringify({ browserErrors: unexpectedBrowserErrors, viewportResults }, null, 2));
} finally {
  await browser.close();
}
