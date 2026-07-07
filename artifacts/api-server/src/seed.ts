/**
 * Seed script — run once to populate initial data.
 * Run with: npx tsx src/seed.ts
 */
import { db, messagesTable, webinarsTable, eventsTable, coursesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database…");

  // ── Webinars ────────────────────────────────────────────────────────────────
  const webinarCount = await db.$count(webinarsTable);
  if (webinarCount === 0) {
    await db.insert(webinarsTable).values([
      {
        title: "Mes premiers pas avec VectorVest",
        description:
          "Découvrez les fondamentaux de VectorVest et apprenez à lire les signaux de marché comme un pro.",
        hostName: "Marc Leblanc",
        scheduledAt: new Date("2026-07-10T18:00:00Z"),
        status: "upcoming",
        sessionNumber: 1,
      },
      {
        title: "Stratégies momentum avec VectorVest",
        description:
          "Apprenez à exploiter les tendances de momentum pour saisir les meilleures opportunités.",
        hostName: "Sophie Durand",
        scheduledAt: new Date("2026-07-17T18:00:00Z"),
        status: "upcoming",
        sessionNumber: 2,
      },
      {
        title: "Gestion du risque et position sizing",
        description:
          "Maîtrisez les principes de gestion du risque pour protéger votre capital en toutes circonstances.",
        hostName: "Marc Leblanc",
        scheduledAt: new Date("2026-06-26T18:00:00Z"),
        status: "past",
        sessionNumber: 12,
      },
      {
        title: "Analyse sectorielle avancée",
        description:
          "Plongez dans l'analyse des secteurs pour anticiper les rotations et allouer votre portefeuille intelligemment.",
        hostName: "Thomas Renard",
        scheduledAt: new Date("2026-07-07T10:00:00Z"),
        status: "live",
        sessionNumber: 13,
      },
    ]);
    console.log("✓ Webinars seeded");
  }

  // ── Events ──────────────────────────────────────────────────────────────────
  const eventCount = await db.$count(eventsTable);
  if (eventCount === 0) {
    await db.insert(eventsTable).values([
      {
        title: "VectorVest Community Meetup — Paris",
        description:
          "Rejoignez-nous pour une soirée networking avec des investisseurs passionnés. Échangez stratégies, idées et retours d'expérience.",
        date: new Date("2026-08-15T18:30:00Z"),
        location: "Paris, France",
        type: "meetup",
      },
      {
        title: "Masterclass: Investir dans la tech européenne",
        description:
          "Session intensive sur les opportunités dans le secteur technologique européen, avec analyse live de titres.",
        date: new Date("2026-07-22T17:00:00Z"),
        location: "En ligne",
        type: "masterclass",
      },
      {
        title: "Webinaire mensuel — Revue de marché juillet",
        description:
          "Bilan mensuel des marchés, des secteurs en vue et des signaux VectorVest à surveiller pour le mois prochain.",
        date: new Date("2026-07-31T18:00:00Z"),
        location: "En ligne",
        type: "webinar",
      },
      {
        title: "Q&A live avec nos experts",
        description:
          "Posez vos questions directement à notre équipe d'analystes. Inscrivez-vous et soumettez vos questions à l'avance.",
        date: new Date("2026-07-14T19:00:00Z"),
        location: "En ligne",
        type: "q-a",
      },
    ]);
    console.log("✓ Events seeded");
  }

  // ── Courses ─────────────────────────────────────────────────────────────────
  const courseCount = await db.$count(coursesTable);
  if (courseCount === 0) {
    await db.insert(coursesTable).values([
      {
        title: "Introduction à VectorVest",
        description:
          "Apprenez les bases de la plateforme VectorVest et comprenez les trois indicateurs fondamentaux : VST, GRT et RV.",
        instructor: "Marc Leblanc",
        duration: "2h 30m",
        level: "beginner",
        isLocked: false,
      },
      {
        title: "Lire les signaux du marché",
        description:
          "Comprendre les Market Timing Indicators de VectorVest pour savoir quand acheter, vendre ou rester en cash.",
        instructor: "Sophie Durand",
        duration: "1h 45m",
        level: "beginner",
        isLocked: false,
      },
      {
        title: "Screener avancé et sélection de titres",
        description:
          "Maîtrisez le screener de VectorVest pour filtrer des centaines de titres et identifier les meilleures opportunités.",
        instructor: "Thomas Renard",
        duration: "3h 00m",
        level: "intermediate",
        isLocked: false,
      },
      {
        title: "Construction de portefeuille avec VectorVest",
        description:
          "Apprenez à construire un portefeuille diversifié et équilibré en suivant les recommandations VectorVest.",
        instructor: "Marc Leblanc",
        duration: "2h 15m",
        level: "intermediate",
        isLocked: true,
      },
      {
        title: "Stratégies momentum et trend following",
        description:
          "Exploitez les tendances de marché à court et moyen terme avec des stratégies momentum éprouvées.",
        instructor: "Sophie Durand",
        duration: "4h 00m",
        level: "advanced",
        isLocked: true,
      },
      {
        title: "Analyse des options avec VectorVest",
        description:
          "Utilisez VectorVest pour améliorer vos décisions sur les options : timing, sélection de titres, gestion du risque.",
        instructor: "Thomas Renard",
        duration: "5h 30m",
        level: "advanced",
        isLocked: true,
      },
    ]);
    console.log("✓ Courses seeded");
  }

  // ── Welcome message ──────────────────────────────────────────────────────────
  const welcomeMessages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.channelId, "welcome"));

  if (welcomeMessages.length === 0) {
    await db.insert(messagesTable).values([
      {
        channelId: "welcome",
        userId: "system",
        username: "VectorVest Team",
        avatarUrl: null,
        content:
          "Bienvenue dans la communauté VectorVest Europe ! 🎉 Nous sommes ravis de vous accueillir. Explorez les canaux, posez vos questions et partagez vos stratégies. Ensemble, investissons mieux.",
        isPinned: true,
      },
    ]);
    console.log("✓ Welcome message seeded");
  }

  // ── Sample messages in main-chat ─────────────────────────────────────────────
  const mainChatMessages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.channelId, "main-chat"));

  if (mainChatMessages.length === 0) {
    const pinned = await db.insert(messagesTable).values({
      channelId: "main-chat",
      userId: "system",
      username: "VectorVest Team",
      avatarUrl: null,
      content:
        "📌 Règle du canal : respectez les autres membres, partagez des analyses constructives et ne faites jamais de recommandations financières directes. Bon trading à tous !",
      isPinned: true,
    }).returning();

    await db.insert(messagesTable).values([
      {
        channelId: "main-chat",
        userId: "sample_user_1",
        username: "InvestisseurPro",
        avatarUrl: null,
        content:
          "Bonjour à tous ! Le marché est particulièrement agité ce matin. Les techs européennes rebondissent après la correction de la semaine dernière.",
        isPinned: false,
      },
      {
        channelId: "main-chat",
        userId: "sample_user_2",
        username: "TradeurActif",
        avatarUrl: null,
        content:
          "Oui, j'ai vu ça. VectorVest donne un signal 'Buy' sur plusieurs valeurs du CAC40. Quelqu'un d'autre a des positions ouvertes ?",
        isPinned: false,
      },
      {
        channelId: "main-chat",
        userId: "sample_user_3",
        username: "AnalysteMarché",
        avatarUrl: null,
        content:
          "Je suis rentré sur Schneider Electric hier. RV > 1.0, GRT solide et le secteur de l'énergie est en pleine rotation haussière selon VectorVest.",
        isPinned: false,
      },
    ]);
    console.log("✓ Main-chat messages seeded");
  }

  console.log("✅ Database seeding complete");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
