import { ExperienceLevel } from "@/drizzle/schema"

export function formatExperienceLevel(level: ExperienceLevel) {
  switch (level) {
    case "beginner":
      return "Beginner"
    case "intermediate":
      return "Intermediate"
    case "advanced":
      return "Advanced"
    default:
      throw new Error(`Unknown experience level: ${level satisfies never}`)
  }
}
