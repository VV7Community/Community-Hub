import * as cheerio from "cheerio";

export interface ScrapedEvent {
  title: string;
  dateText: string;
  location: string;
  url: string;
  type: "webinar" | "workshop" | "seminar" | "event";
}

export async function scrapeVectorVestEuEvents(): Promise<ScrapedEvent[]> {
  const res = await fetch("https://www.vectorvest.com/eu-events/", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch events page: ${res.status} ${res.statusText}`);
  }
  const html = await res.text();
  if (html.length < 1000) {
    throw new Error("Events page returned unexpectedly short HTML; aborting sync to avoid data loss.");
  }
  const $ = cheerio.load(html);
  const events: ScrapedEvent[] = [];

  $("tr.upcomingeventrow").each((_i, row) => {
    const $row = $(row);
    const titleEl = $row.find("td.title-column a");
    const title = titleEl.text().trim();
    const url = titleEl.attr("href")?.trim() ?? "";
    const dateText = $row.find("td.date-column").text().trim();
    const location = $row.find("td.location-column").text().trim();

    if (!title) return;

    const date = parseEventDate(dateText);
    if (!date) return; // skip on-demand/replays without a concrete date

    let type: ScrapedEvent["type"] = "event";
    const lower = `${title} ${location}`.toLowerCase();
    if (lower.includes("webinar") || lower.includes("livestream") || lower.includes("video series") || lower.includes("replay")) {
      type = "webinar";
    } else if (lower.includes("seminar")) {
      type = "seminar";
    } else if (lower.includes("workshop")) {
      type = "workshop";
    }

    events.push({ title, dateText, location, url, type });
  });

  return events;
}

const DUTCH_MONTHS: Record<string, number> = {
  januari: 0, februari: 1, maart: 2, april: 3, mei: 4, juni: 5,
  juli: 6, augustus: 7, september: 8, oktober: 9, november: 10, december: 11,
};

const FRENCH_MONTHS: Record<string, number> = {
  janvier: 0, février: 1, fevrier: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, août: 7, aout: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11, decembre: 11,
};

const ENGLISH_MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

const MONTHS = { ...DUTCH_MONTHS, ...FRENCH_MONTHS, ...ENGLISH_MONTHS };

export function parseEventDate(dateText: string): Date | null {
  if (!dateText || dateText.toLowerCase() === "registration open" || dateText.toLowerCase() === "op aanvraag") {
    return null;
  }

  const normalized = dateText.toLowerCase().replace(/[\u00A0]/g, " ");

  // e.g. "Maandag 12 oktober 2026" or "11 mai 2026"
  const match = normalized.match(/(\d{1,2})\s+([a-zéû]+)\s+(\d{4})/);
  if (match) {
    const day = parseInt(match[1], 10);
    const monthName = match[2];
    const year = parseInt(match[3], 10);
    const month = MONTHS[monthName];
    if (month !== undefined) {
      return new Date(Date.UTC(year, month, day, 12, 0, 0));
    }
  }

  return null;
}
