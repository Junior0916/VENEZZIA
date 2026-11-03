import { nextTick } from 'vue'

/**
 * Dynamically computes current sticky header height across all screen sizes (mobile & desktop).
 */
export function getHeaderHeight() {
  if (typeof document === 'undefined') return 140
  const header = document.getElementById('site-header') || document.querySelector('header')
  if (!header) return 140
  const rect = header.getBoundingClientRect()
  return Math.round(rect.height || header.offsetHeight || 140)
}

/**
 * Smoothly scrolls to target element accounting for the sticky navigation header.
 * Guarantees that section titles, badges, and filter tabs are never cut off.
 *
 * @param {string|HTMLElement} target - Element ID or DOM node
 * @param {Object} [options]
 * @param {number} [options.offset=0] - Additional offset in pixels (0 aligns section top flush with navbar bottom)
 * @param {ScrollBehavior} [options.behavior='smooth'] - 'smooth' or 'auto'
 */
export function scrollToSection(target, options = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const { offset = 0, behavior = 'smooth' } = options

  // Special case: Scroll to top
  if (target === 'inicio') {
    window.scrollTo({ top: 0, behavior })
    return
  }

  const el = typeof target === 'string' ? document.getElementById(target) : target
  if (!el) return

  const headerHeight = getHeaderHeight()
  const elementRect = el.getBoundingClientRect()
  const elementTop = elementRect.top + window.pageYOffset
  const targetY = Math.max(0, Math.round(elementTop - headerHeight + offset))

  window.scrollTo({
    top: targetY,
    behavior
  })
}

/**
 * Defers scroll execution until Vue completes reactive DOM patching and layout reflow.
 * Essential when switching campaigns or routing so measurements reflect new rendered heights.
 */
export async function scrollToSectionDeferred(target, options = {}) {
  await nextTick()
  if (typeof window !== 'undefined') {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        scrollToSection(target, options)
      })
    })
  }
}
