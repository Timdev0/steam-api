import { describe, expect, it } from 'vitest'
import { formatPlaytime, formatPlaytimeFull } from './playtime'

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

describe('formatPlaytimeFull', () => {
  it('shows all-zero breakdown for no playtime', () => {
    expect(formatPlaytimeFull(0)).toBe('0 years, 0 days, 0 hours and 0 minutes')
  })

  it('pluralizes each unit based on its own value', () => {
    expect(formatPlaytimeFull(60 + 1)).toBe('0 years, 0 days, 1 hour and 1 minute')
  })

  it('breaks down minutes into years, days, hours and minutes', () => {
    // 1 year + 22 days + 11 hours + 55 minutes
    const minutes = 1 * 365 * 24 * 60 + 22 * 24 * 60 + 11 * 60 + 55
    expect(formatPlaytimeFull(minutes)).toBe('1 year, 22 days, 11 hours and 55 minutes')
  })

  it('shows only hours and minutes when under a day', () => {
    expect(formatPlaytimeFull(23 * 60 + 5)).toBe('0 years, 0 days, 23 hours and 5 minutes')
  })

  it('truncates fractional minutes rather than rounding', () => {
    expect(formatPlaytimeFull(1.9)).toBe('0 years, 0 days, 0 hours and 1 minute')
  })
})
