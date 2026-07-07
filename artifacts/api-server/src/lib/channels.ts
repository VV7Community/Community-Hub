export type ChannelCategory = "INFO" | "COMMUNITY";
export type PostPermission = "all" | "admin";

export const CHANNELS = [
  {
    id: "aankondigingen",
    name: "aankondigingen",
    description: "Officiële aankondigingen van VectorVest België & Nederland",
    category: "INFO" as ChannelCategory,
    postPermission: "admin" as PostPermission,
    icon: "📢",
  },
  {
    id: "regels",
    name: "regels",
    description: "Community richtlijnen — dit kanaal verandert nooit",
    category: "INFO" as ChannelCategory,
    postPermission: "admin" as PostPermission,
    icon: "📋",
  },
  {
    id: "disclaimer",
    name: "disclaimer",
    description: "Juridische disclaimer",
    category: "INFO" as ChannelCategory,
    postPermission: "admin" as PostPermission,
    icon: "⚖️",
  },
  {
    id: "chat",
    name: "chat",
    description: "Vrij algemeen gesprek",
    category: "COMMUNITY" as ChannelCategory,
    postPermission: "all" as PostPermission,
    icon: "💬",
  },
  {
    id: "vraag-maar-raak",
    name: "vraag-maar-raak",
    description: "Platformvragen, how-to's en vragen over signalen",
    category: "COMMUNITY" as ChannelCategory,
    postPermission: "all" as PostPermission,
    icon: "❓",
  },
  {
    id: "vv7-daily",
    name: "VV7 - Daily",
    description: "Dagelijkse marktpost: ColorGuard, MTI en Primary Wave. Reageren kan, nieuwe topics niet.",
    category: "COMMUNITY" as ChannelCategory,
    postPermission: "admin" as PostPermission,
    icon: "📊",
  },
  {
    id: "aandelen-bespreken",
    name: "aandelen-bespreken",
    description: "Deel aandelenkeuzes met VST/RV/RS-scores en een korte onderbouwing",
    category: "COMMUNITY" as ChannelCategory,
    postPermission: "all" as PostPermission,
    icon: "📈",
  },
  {
    id: "unisearch",
    name: "unisearch",
    description: "Deel werkende UniSearch-opzetjes en -filters. ProTrader-filters krijgen een 🔷 tag.",
    category: "COMMUNITY" as ChannelCategory,
    postPermission: "all" as PostPermission,
    icon: "🔍",
  },
];

export type Channel = (typeof CHANNELS)[number];

export function getChannel(channelId: string): Channel | undefined {
  return CHANNELS.find((c) => c.id === channelId);
}

export function canPostInChannel(channel: Channel, role: string): boolean {
  return channel.postPermission === "all" || role === "admin";
}
