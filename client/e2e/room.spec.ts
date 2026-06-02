import { test, expect } from "@playwright/test";
import { createRoom, joinRoom, castVote, waitForReveal } from "./helpers";

// A small, fast end-to-end sanity check of the core loop: create a room, a
// second person joins, both vote, and the room auto-reveals with consensus.
test("two players vote and reach consensus", async ({ browser }) => {
  const { host, roomId } = await createRoom(browser, {
    teamName: "Pair",
    hostName: "Ada",
  });

  const guest = await joinRoom(browser, roomId, "Grace");

  // Both screens should now show both people.
  await expect(host.page.locator(".players-row .player")).toHaveCount(2);
  await expect(guest.page.locator(".players-row .player")).toHaveCount(2);

  // Both pick the same card → consensus on reveal.
  await castVote(host.page, "5");
  await castVote(guest.page, "5");

  await waitForReveal(host.page);
  await expect(host.page.locator(".consensus")).toHaveText(/Consensus/);
  await expect(host.page.locator(".results-summary .stat-value").first()).toHaveText("5");

  await host.context.close();
  await guest.context.close();
});
