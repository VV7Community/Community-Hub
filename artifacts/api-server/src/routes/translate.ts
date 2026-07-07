import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, messageTranslationsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

const SUPPORTED_PAIRS = new Set(["nl-fr", "fr-nl", "nl-en", "fr-en", "en-nl", "en-fr"]);

interface MyMemoryResponse {
  responseData?: {
    translatedText?: string;
    match?: number;
  };
  quotaFinished?: boolean;
  responseStatus?: number;
}

async function translateWithMyMemory(text: string, source: string, target: string): Promise<string> {
  const pair = `${source}|${target}`;
  const encodedText = encodeURIComponent(text);
  const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${pair}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`MyMemory request failed: ${res.status}`);
  }
  const data = (await res.json()) as MyMemoryResponse;
  if (data.quotaFinished) {
    throw new Error("Translation quota exceeded");
  }
  if (!data.responseData?.translatedText) {
    throw new Error("Empty translation response");
  }
  return data.responseData.translatedText
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

router.post("/translate", requireAuth, async (req, res): Promise<void> => {
  const { text, targetLanguage } = req.body as { text?: string; targetLanguage?: string };

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    res.status(400).json({ error: "Text is required" });
    return;
  }
  if (!targetLanguage || (targetLanguage !== "nl" && targetLanguage !== "fr")) {
    res.status(400).json({ error: "targetLanguage must be nl or fr" });
    return;
  }
  if (text.length > 4000) {
    res.status(400).json({ error: "Text too long" });
    return;
  }

  // Detect source language: assume the text is the other language if not matching target
  // A simple heuristic: if target is nl, assume fr; if target is fr, assume nl.
  const sourceLanguage = targetLanguage === "nl" ? "fr" : "nl";
  const pair = `${sourceLanguage}-${targetLanguage}`;
  if (!SUPPORTED_PAIRS.has(pair)) {
    res.status(400).json({ error: "Unsupported language pair" });
    return;
  }

  try {
    const translated = await translateWithMyMemory(text, sourceLanguage, targetLanguage);
    res.json({ translatedText: translated });
  } catch (err) {
    console.error("Translation failed", err);
    res.status(429).json({ error: "Translation service unavailable or quota exceeded" });
  }
});

export default router;

// Optional helper: fetch or create a cached translation for a message
export async function getCachedTranslation(messageId: number, language: string): Promise<string | null> {
  const [cached] = await db
    .select()
    .from(messageTranslationsTable)
    .where(and(eq(messageTranslationsTable.messageId, messageId), eq(messageTranslationsTable.language, language)));
  return cached?.content ?? null;
}

export async function saveTranslation(
  messageId: number,
  language: string,
  content: string,
): Promise<void> {
  await db
    .insert(messageTranslationsTable)
    .values({ messageId, language, content })
    .onConflictDoUpdate({
      target: [messageTranslationsTable.messageId, messageTranslationsTable.language],
      set: { content, createdAt: new Date() },
    });
}
