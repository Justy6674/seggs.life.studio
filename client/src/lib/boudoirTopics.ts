export const BOUDOIR_TOPICS = [
  "Naughty Texts",
  "Naughty Pictures", 
  "Naughty Game Ideas",
  "I Had a Fantasy…",
  "Roleplay Scenarios",
  "Massage & Touch",
  "Toys & Accessories",
  "Adventure Ideas",
  "Morning Rituals",
  "Evening Activities",
  "Weekend Escapes",
  "Surprise Elements",
  "Connection Exercises",
  "Celebration Ideas",
  "Sensory Experiences",
  "Communication Starters",
  "Boundary Exploration",
  "Intimacy Challenges",
  "Date Night Ideas",
  "Custom Scenarios"
] as const;

export type BoudoirTopic = typeof BOUDOIR_TOPICS[number];

export const SPICINESS_LEVELS = [
  { level: 1, label: "Safe", description: "Playful, lighthearted" },
  { level: 2, label: "Flirty", description: "Suggestive, sweet" },
  { level: 3, label: "Cheeky", description: "Bold, romantic" },
  { level: 4, label: "Sensual", description: "Physical, intense" },
  { level: 5, label: "Erotic", description: "Daring, elegant" }
] as const;

export const BLUEPRINT_TYPES = [
  "Energetic",
  "Sensual", 
  "Sexual",
  "Kinky",
  "Shapeshifter"
] as const;

export type BlueprintType = typeof BLUEPRINT_TYPES[number];