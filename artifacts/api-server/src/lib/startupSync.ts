import { syncEvents } from "./eventSync";

const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

export function scheduleEventSync(): void {
  (async () => {
    try {
      const synced = await syncEvents();
      console.log(`✓ Events synced: ${synced} events from vectorvest.com/eu-events/`);
    } catch (err) {
      console.error("Startup events sync failed; will retry later.", err);
    }
  })();
  setInterval(async () => {
    try {
      const synced = await syncEvents();
      console.log(`✓ Events synced: ${synced} events from vectorvest.com/eu-events/`);
    } catch (err) {
      console.error("Scheduled events sync failed.", err);
    }
  }, SYNC_INTERVAL_MS);
}
