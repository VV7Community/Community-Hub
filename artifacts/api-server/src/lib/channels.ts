export const CHANNELS = [
  {
    id: "welcome",
    name: "welcome",
    description: "Welcome to the VectorVest Investor Community!",
    category: "WELCOME" as const,
    writable: false,
    icon: "👋",
  },
  {
    id: "main-chat",
    name: "main-chat",
    description: "Discuss everything related to investing and Vectorvest",
    category: "COMMUNITY" as const,
    writable: true,
    icon: "💬",
  },
  {
    id: "strategies",
    name: "strategies",
    description: "Share and discuss investment strategies",
    category: "COMMUNITY" as const,
    writable: true,
    icon: "📊",
  },
  {
    id: "q-a",
    name: "q-a",
    description: "Ask questions and get answers from the community",
    category: "COMMUNITY" as const,
    writable: true,
    icon: "❓",
  },
  {
    id: "stocks",
    name: "stocks",
    description: "Stock picks, watchlists and market analysis",
    category: "COMMUNITY" as const,
    writable: true,
    icon: "📈",
  },
  {
    id: "tutorials",
    name: "tutorials",
    description: "Step-by-step guides to mastering VectorVest",
    category: "RESOURCES" as const,
    writable: false,
    icon: "🎓",
  },
  {
    id: "important-news",
    name: "important-news",
    description: "Critical market news and platform announcements",
    category: "RESOURCES" as const,
    writable: false,
    icon: "🔔",
  },
  {
    id: "calendar",
    name: "calendar",
    description: "Upcoming webinars, sessions and community events",
    category: "RESOURCES" as const,
    writable: false,
    icon: "📅",
  },
  {
    id: "rules",
    name: "rules",
    description: "Community guidelines and rules of engagement",
    category: "RESOURCES" as const,
    writable: false,
    icon: "📋",
  },
];

export type Channel = (typeof CHANNELS)[number];

export function getChannel(channelId: string): Channel | undefined {
  return CHANNELS.find((c) => c.id === channelId);
}
