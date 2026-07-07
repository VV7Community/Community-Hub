import { eq, inArray, sql } from "drizzle-orm";
import { db, eventsTable } from "@workspace/db";
import { scrapeVectorVestEuEvents, parseEventDate } from "./scrapeEvents";

export async function syncEvents(): Promise<number> {
  const scraped = await scrapeVectorVestEuEvents();
  const now = new Date();

  type EventInsert = {
    title: string;
    description: string;
    date: Date;
    location: string;
    type: "webinar" | "workshop" | "seminar" | "event";
    sourceUrl: string;
    externalId: string;
    lastSyncedAt: Date;
  };
  const parsedEvents = scraped
    .map((e) => ({
      title: e.title,
      description: e.title,
      date: parseEventDate(e.dateText),
      location: e.location,
      type: e.type,
      sourceUrl: e.url,
      externalId: e.url,
      lastSyncedAt: now,
    }))
    .filter((e): e is EventInsert => e.date !== null); // only keep events with a concrete date

  if (parsedEvents.length === 0) {
    throw new Error("No events with a valid date were found on the scraped page; keeping existing events.");
  }

  const externalIds = parsedEvents.map((e) => e.externalId);

  await db.transaction(async (tx) => {
    // Remove events that no longer appear on the upstream page
    await tx.delete(eventsTable).where(
      sql`${eventsTable.externalId} IS NOT NULL AND ${eventsTable.externalId} NOT IN ${externalIds}`,
    );

    // Upsert the scraped events by their externalId
    for (const event of parsedEvents) {
      await tx
        .insert(eventsTable)
        .values(event)
        .onConflictDoUpdate({
          target: [eventsTable.externalId],
          set: {
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
            type: event.type,
            sourceUrl: event.sourceUrl,
            lastSyncedAt: event.lastSyncedAt,
          },
        });
    }
  });

  return parsedEvents.length;
}
