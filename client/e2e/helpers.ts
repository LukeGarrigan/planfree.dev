import { type Browser, type BrowserContext, type Page, expect } from "@playwright/test";

// A single simulated participant: their own browser context (so they get their
// own localStorage userId, exactly like a separate person on a separate
// machine) and the page showing the board.
export interface Participant {
  context: BrowserContext;
  page: Page;
  name: string;
}

// Pull the room id out of a `/#/game/:id` hash URL.
export function roomIdFromUrl(url: string): string {
  const match = url.match(/#\/game\/([^/?]+)/);
  if (!match) throw new Error(`Could not find a room id in URL: ${url}`);
  return match[1];
}

// Fill in the "Choose your display name" modal (id is shared by both modals,
// but only one is ever mounted at a time) and wait for the board to appear.
async function enterName(page: Page, name: string): Promise<void> {
  const input = page.locator("#selectNameInput");
  await input.waitFor({ state: "visible" });
  await input.fill(name);
  await input.press("Enter");
  // The board is up once the name modal has gone and our own card is rendered.
  await expect(page.locator(".modal-overlay")).toBeHidden();
}

// Create a brand-new room as the host. Returns the room id so others can join.
export async function createRoom(
  browser: Browser,
  opts: { teamName: string; hostName: string }
): Promise<{ host: Participant; roomId: string }> {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("/");
  // CreateRoomModal: name the team, then start.
  await page.locator("#selectNameInput").fill(opts.teamName);
  await page.getByRole("button", { name: "Start planning" }).click();

  // The server hands back a room id and the client routes us to it.
  await page.waitForURL(/#\/game\//, { timeout: 30_000 });
  const roomId = roomIdFromUrl(page.url());

  // Now the display-name modal on the game screen.
  await enterName(page, opts.hostName);

  return { host: { context, page, name: opts.hostName }, roomId };
}

// Join an existing room as another person, in a fresh isolated context.
export async function joinRoom(
  browser: Browser,
  roomId: string,
  name: string
): Promise<Participant> {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`/#/game/${roomId}`);
  await enterName(page, name);
  return { context, page, name };
}

// Tap a voting card by its face value. Anchored exact match so "1" doesn't also
// match "13".
export async function castVote(page: Page, value: string): Promise<void> {
  await page
    .locator(".fib-button")
    .filter({ hasText: new RegExp(`^${value}$`) })
    .first()
    .click();
}

// Wait for the server's auto-reveal: votes shown, the 3-2-1 countdown finished,
// and the results card on screen.
export async function waitForReveal(page: Page): Promise<void> {
  await expect(page.locator(".results-card")).toBeVisible({ timeout: 30_000 });
}
