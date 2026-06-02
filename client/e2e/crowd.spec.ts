import { test, expect, type Browser } from "@playwright/test";
import { createRoom, joinRoom, castVote, waitForReveal, type Participant } from "./helpers";

// How many people to put in the room. Bump it to stress-test the board layout:
//   PLAYERS=40 npm run e2e:crowd          (bash)
//   $env:PLAYERS=40; npm run e2e:crowd    (PowerShell)
const PLAYERS = Number(process.env.PLAYERS) || 12;
// In --headed mode, how long to sit on the finished board so you can look at it.
const HOLD_MS = Number(process.env.HOLD_MS) || 0;

// A spread of Fibonacci cards so the reveal shows a real distribution chart
// rather than everyone landing on one value.
const VOTE_CYCLE = ["3", "5", "8", "5", "8", "13", "5", "2", "8", "5"];

test("a crowded room votes and the board reveals a distribution", async ({ browser }) => {
  test.slow(); // many contexts + a 3s reveal countdown — give it room.

  const { host, roomId } = await createRoom(browser, {
    teamName: "The Big Team",
    hostName: "Host",
  });

  // Everyone else piles in. Joining a few at a time keeps the server's per-
  // connection handshake from being hammered all at once.
  const joiners: Participant[] = [];
  const BATCH = 5;
  for (let i = 0; i < PLAYERS - 1; i += BATCH) {
    const batch = await Promise.all(
      Array.from({ length: Math.min(BATCH, PLAYERS - 1 - i) }, (_, j) =>
        joinRoom(browser, roomId, `Player ${i + j + 1}`)
      )
    );
    joiners.push(...batch);
  }

  const everyone = [host, ...joiners];
  expect(everyone).toHaveLength(PLAYERS);

  // The host should see a card for every single person in the room.
  await expect(host.page.locator(".players-row .player")).toHaveCount(PLAYERS);

  // Everyone votes. The last vote trips the server's auto-reveal.
  for (let i = 0; i < everyone.length; i++) {
    await castVote(everyone[i].page, VOTE_CYCLE[i % VOTE_CYCLE.length]);
  }

  // The board reveals for everyone, with the average / closest summary.
  await waitForReveal(host.page);
  await expect(host.page.locator(".results-summary .stat-value").first()).not.toBeEmpty();
  // More than one distinct vote was cast, so there must be a multi-bar chart.
  await expect(host.page.locator(".distribution .dist-item").first()).toBeVisible();

  // Capture the crowded board so you can literally see what it looks like.
  await host.page.screenshot({
    path: `e2e/screenshots/crowd-${PLAYERS}.png`,
  });

  if (HOLD_MS > 0) {
    await host.page.waitForTimeout(HOLD_MS);
  }

  // Tidy up every context we opened.
  await Promise.all(everyone.map((p) => p.context.close()));
});
