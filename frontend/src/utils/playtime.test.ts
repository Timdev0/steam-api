import { describe, expect, it } from 'vitest'
import { formatPlaytime } from './playtime'

describe('formatPlaytime', () => {
  it('shows minutes when under one hour', () => {
    expect(formatPlaytime(0)).toBe('0 min')
    expect(formatPlaytime(45)).toBe('45 min')
    expect(formatPlaytime(59)).toBe('59 min')
  })

  it('shows whole hours from one hour onward', () => {
    expect(formatPlaytime(60)).toBe('1h')
    expect(formatPlaytime(119)).toBe('1h')
    expect(formatPlaytime(120)).toBe('2h')
  })

  it('truncates the minutes rather than rounding', () => {
    expect(formatPlaytime(7439)).toBe('123h')
  })
})
