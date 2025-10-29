/**
 * Generates a consistent, pseudo-random multiplier for a teacher based on their ID.
 * This creates the appearance of natural variation while ensuring the same teacher
 * always gets the same multiplier.
 *
 * @param teacherId - The unique identifier for the teacher
 * @param minMultiplier - Minimum multiplier value (default: 4)
 * @param maxMultiplier - Maximum multiplier value (default: 10)
 * @returns A consistent multiplier between min and max
 */
export function getTeacherReviewMultiplier(teacherId: string | number, minMultiplier = 4, maxMultiplier = 10): number {
  // Convert teacherId to string for consistent hashing
  const id = String(teacherId)

  // Simple hash function: sum of character codes
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash = hash & hash // Convert to 32-bit integer
  }

  // Convert hash to positive number and normalize to range
  const normalized = Math.abs(hash) % (maxMultiplier - minMultiplier + 1)
  const multiplier = minMultiplier + normalized

  return multiplier
}
