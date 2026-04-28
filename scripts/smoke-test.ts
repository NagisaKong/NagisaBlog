/**
 * Smoke test: hit critical pages and assert HTTP 200.
 * Used in CI after `next start` to verify the build actually serves traffic.
 */
const BASE_URL = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

const ROUTES = [
  "/",
  "/blog",
  "/projects",
  "/about",
];

async function waitForServer(url: string, timeoutMs = 60_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.status < 500) return;
    } catch {
      // connection refused; keep waiting
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`);
}

async function main() {
  console.log(`[smoke] waiting for ${BASE_URL}`);
  await waitForServer(BASE_URL);

  const failures: string[] = [];
  for (const route of ROUTES) {
    const url = `${BASE_URL}${route}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        failures.push(`${route} → ${res.status}`);
        console.error(`[smoke] FAIL ${route} → ${res.status}`);
      } else {
        console.log(`[smoke] OK   ${route} → ${res.status}`);
      }
    } catch (err) {
      failures.push(`${route} → ${(err as Error).message}`);
      console.error(`[smoke] FAIL ${route} → ${(err as Error).message}`);
    }
  }

  if (failures.length > 0) {
    console.error(`\n[smoke] ${failures.length} route(s) failed`);
    process.exit(1);
  }
  console.log(`\n[smoke] all ${ROUTES.length} routes OK`);
}

main();
