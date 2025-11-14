/**
 * Simula delay de API
 * @param {number} ms - Milissegundos de delay
 * @param {string} mode - 'fast' | 'slow' | 'default'
 * @returns {Promise<void>}
 */
export function delay(ms, mode = 'default') {
  let delayMs = ms

  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const delayParam = params.get('delay')
    
    if (delayParam === 'fast') {
      delayMs = Math.min(ms, 200)
    } else if (delayParam === 'slow') {
      delayMs = ms * 2
    }
  }

  return new Promise((resolve) => setTimeout(resolve, delayMs))
}

/**
 * Delay padrão para operações de API mock
 */
export const DEFAULT_DELAY = 600

