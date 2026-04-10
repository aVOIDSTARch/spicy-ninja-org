/**
 * tests/auth.test.ts
 *
 * Tests for src/lib/auth.ts — sha256, token write/read/clear/expiry.
 * localStorage is mocked in-process since vite-plus interferes with jsdom.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { sha256, writeAuthToken, clearAuthToken, isAuthenticated } from '../src/lib/auth'

// ── Mock localStorage ─────────────────────────────────────────────────────────
// vite-plus injects --localstorage-file which breaks jsdom's localStorage.
// Provide a clean in-memory mock instead.

const store: Record<string, string> = {}
const localStorageMock = {
  getItem:    (k: string) => store[k] ?? null,
  setItem:    (k: string, v: string) => { store[k] = v },
  removeItem: (k: string) => { delete store[k] },
  clear:      () => { Object.keys(store).forEach(k => delete store[k]) },
}
vi.stubGlobal('localStorage', localStorageMock)

// ── sha256 ────────────────────────────────────────────────────────────────────

describe('sha256', () => {
  it('returns a 64-character lowercase hex string', async () => {
    const h = await sha256('test')
    expect(h).toHaveLength(64)
    expect(h).toMatch(/^[0-9a-f]{64}$/)
  })

  it('is deterministic for the same input', async () => {
    const a = await sha256('spicyninja')
    const b = await sha256('spicyninja')
    expect(a).toBe(b)
  })

  it('produces different output for different inputs', async () => {
    const a = await sha256('abc')
    const b = await sha256('abd')
    expect(a).not.toBe(b)
  })

  it('matches known SHA-256 vector for empty string', async () => {
    const h = await sha256('')
    expect(h).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
  })

  it('matches known SHA-256 vector for "abc"', async () => {
    const h = await sha256('abc')
    expect(h).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  })
})

// ── token lifecycle ───────────────────────────────────────────────────────────

describe('token lifecycle', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('starts unauthenticated with empty storage', () => {
    expect(isAuthenticated()).toBe(false)
  })

  it('returns false for missing key', () => {
    localStorageMock.removeItem('sn-auth')
    expect(isAuthenticated()).toBe(false)
  })

  it('authenticates after writeAuthToken', () => {
    writeAuthToken()
    expect(isAuthenticated()).toBe(true)
  })

  it('writes a valid base64-encoded JSON token', () => {
    writeAuthToken()
    const raw = localStorageMock.getItem('sn-auth')
    expect(raw).not.toBeNull()
    const token = JSON.parse(atob(raw!))
    expect(token.v).toBe(1)
    expect(typeof token.issued).toBe('number')
    expect(typeof token.expires).toBe('number')
    expect(token.expires).toBeGreaterThan(token.issued)
  })

  it('token TTL is 30 days', () => {
    writeAuthToken()
    const raw = localStorageMock.getItem('sn-auth')!
    const token = JSON.parse(atob(raw))
    const thirtyDaysMs = 1000 * 60 * 60 * 24 * 30
    expect(token.expires - token.issued).toBeCloseTo(thirtyDaysMs, -3)
  })

  it('clears token on clearAuthToken', () => {
    writeAuthToken()
    expect(isAuthenticated()).toBe(true)
    clearAuthToken()
    expect(isAuthenticated()).toBe(false)
    expect(localStorageMock.getItem('sn-auth')).toBeNull()
  })

  it('returns false for expired token', () => {
    const expired = { v: 1, issued: Date.now() - 1e9, expires: Date.now() - 1000 }
    localStorageMock.setItem('sn-auth', btoa(JSON.stringify(expired)))
    expect(isAuthenticated()).toBe(false)
  })

  it('returns false for wrong token version', () => {
    const wrong = { v: 99, issued: Date.now(), expires: Date.now() + 1e9 }
    localStorageMock.setItem('sn-auth', btoa(JSON.stringify(wrong)))
    expect(isAuthenticated()).toBe(false)
  })

  it('returns false for corrupted base64', () => {
    localStorageMock.setItem('sn-auth', '!!!not-base64!!!')
    expect(isAuthenticated()).toBe(false)
  })

  it('returns false for valid base64 but invalid JSON', () => {
    localStorageMock.setItem('sn-auth', btoa('not json at all'))
    expect(isAuthenticated()).toBe(false)
  })

  it('writeAuthToken is idempotent — second write still authenticates', () => {
    writeAuthToken()
    writeAuthToken()
    expect(isAuthenticated()).toBe(true)
  })
})
