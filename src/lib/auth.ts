/**
 * auth.ts — Client-side auth utilities for spicyninja.org
 *
 * Auth model:
 * - Passphrase hash lives in import.meta.env.AUTH_PASSPHRASE_HASH (baked at build)
 * - User enters passphrase → SHA-256 hashed in browser → compared to baked hash
 * - Match → JWT-like token written to localStorage (key: sn-auth)
 * - Token is checked on each page load; if present and valid, auth state = true
 *
 * The token is a simple base64-encoded JSON with expiry.
 * No server, no OAuth. You are the only user.
 */

const STORAGE_KEY = 'sn-auth'
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 30  // 30 days

interface AuthToken {
  issued: number
  expires: number
  v: number
}

/** SHA-256 hash a string using the Web Crypto API */
export async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/** Verify a passphrase against the baked hash */
export async function verifyPassphrase(input: string): Promise<boolean> {
  const expected = import.meta.env.AUTH_PASSPHRASE_HASH as string | undefined
  if (!expected || expected === 'REPLACE_WITH_YOUR_HASH') return false
  const hashed = await sha256(input.trim())
  return hashed === expected.toLowerCase()
}

/** Write a 30-day auth token to localStorage */
export function writeAuthToken(): void {
  const now = Date.now()
  const token: AuthToken = { issued: now, expires: now + TOKEN_TTL_MS, v: 1 }
  localStorage.setItem(STORAGE_KEY, btoa(JSON.stringify(token)))
}

/** Clear auth token (logout) */
export function clearAuthToken(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/** Check if a valid (non-expired) token exists */
export function isAuthenticated(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const token = JSON.parse(atob(raw)) as AuthToken
    return token.v === 1 && Date.now() < token.expires
  } catch {
    return false
  }
}
