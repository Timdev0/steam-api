import { describe, expect, it } from 'vitest'
import { formatLastPlayed } from './lastPlayed'

describe('formatLastPlayed', () => {
  it("returns 'Never played' when the timestamp is 0", () => {
    expect(formatLastPlayed(0)).toBe('Never played')
  })

  it('formats a Unix timestamp (seconds) into a readable date', () => {
    // 1710504000 s = March 15, 2024 12:00 UTC (wide margin against timezone shifts)
    expect(formatLastPlayed(1710504000)).toBe('15 March 2024')
  })
})
