import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('hasSessionCookie', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns true when has_session cookie exists', async () => {
    vi.stubGlobal('document', {
      cookie: 'foo=bar; has_session=1; theme=dark',
    })

    const { hasSessionCookie } = await import('./api')

    expect(hasSessionCookie()).toBe(true)
  })

  it('returns false when has_session cookie does not exist', async () => {
    vi.stubGlobal('document', {
      cookie: 'foo=bar; theme=dark',
    })

    const { hasSessionCookie } = await import('./api')

    expect(hasSessionCookie()).toBe(false)
  })

  it('returns false when document is unavailable', async () => {
    vi.stubGlobal('document', undefined)

    const { hasSessionCookie } = await import('./api')

    expect(hasSessionCookie()).toBe(false)
  })
})

describe('refreshAccessToken', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns false and skips fetch when has_session cookie is missing', async () => {
    const fetchSpy = vi.fn()

    vi.stubGlobal('document', {
      cookie: 'foo=bar',
    })
    vi.stubGlobal('fetch', fetchSpy)

    const { refreshAccessToken } = await import('./api')

    await expect(refreshAccessToken()).resolves.toBe(false)
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
