# End-to-end tests (Playwright)

These drive the **real** app — the Socket.IO server (`../server`, port 3000) and
the Vite dev server (port 8080). Playwright starts both automatically and reuses
them if they're already running.

Each simulated person gets their **own browser context**, so they each get a
distinct `userId` in localStorage — exactly like separate people on separate
machines (one context = one player).

## Running

```bash
cd client
npm run e2e            # all tests, headless
npm run e2e:headed     # watch it happen in real browser windows
npm run e2e:crowd      # the "lots of people" test, headed
npm run e2e:report     # open the HTML report from the last run
```

## Knobs (env vars)

| var       | default | what it does                                                       |
|-----------|---------|--------------------------------------------------------------------|
| `PLAYERS` | `12`    | how many people to put in the crowd test                           |
| `HOLD_MS` | `0`     | in `--headed`, linger N ms on the final board so you can watch it  |
| `SLOW_MO` | `0`     | slow every action by N ms (nice with `--headed`)                   |

```powershell
# PowerShell — a packed 40-person room you can sit and watch
$env:PLAYERS=40; $env:HOLD_MS=10000; npm run e2e:crowd
```

```bash
# bash
PLAYERS=40 HOLD_MS=10000 npm run e2e:crowd
```

The crowd test saves a full-page screenshot of the host's board to
`e2e/screenshots/crowd-<PLAYERS>.png` every run.

## Files

- `helpers.ts` — `createRoom`, `joinRoom`, `castVote`, `waitForReveal`.
- `room.spec.ts` — fast 2-player sanity check of the core loop.
- `crowd.spec.ts` — the configurable many-people test.
