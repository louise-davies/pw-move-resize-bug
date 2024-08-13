import { test, expect } from "@playwright/test";

test("can move and resize a popup window", async ({ page }) => {
  await page.goto("https://www.example.com/");

  await page.setContent(
    `<html><body><button onclick='window.open("","","innerWidth=500,innerHeight=500,top=100,left=100")'>Click</button></body></html>`
  );

  const [popup] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("button").click(),
  ]);

  const popupDimsInitial = await popup.evaluate(() => {
    return {
      screenX: window.screenX,
      screenY: window.screenY,
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
    };
  });
  expect(popupDimsInitial).toEqual({
    screenX: 100,
    screenY: 100,
    innerHeight: 500,
    innerWidth: 500,
  });

  await popup.evaluate(() => {
    window.moveTo(200, 200);
    window.resizeTo(
      600 + (window.outerWidth - window.innerWidth),
      600 + (window.outerHeight - window.innerHeight)
    );
  });
  // This works around resizeTo not working in Chromium
  // popup.setViewportSize({ width: 600, height: 600 });

  const popupDimsAfter = await popup.evaluate(() => {
    return {
      screenX: window.screenX,
      screenY: window.screenY,
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
    };
  });

  expect(popupDimsAfter).toEqual({
    screenX: 200,
    screenY: 200,
    innerHeight: 600,
    innerWidth: 600,
  });
});
