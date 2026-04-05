import { useEffect, useRef, useState } from 'react'

export default function useCountUp(endValue, duration = 2000, threshold = 0.1) {
  const ref = useRef(null)
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [display, setDisplay] = useState(prefersReduced ? endValue : 0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          observer.unobserve(el)
          const start = performance.now()
          const easeOutQuart = t => 1 - Math.pow(1 - t, 4)
          const step = now => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            setDisplay(Math.round(easeOutQuart(progress) * endValue))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [endValue, duration, threshold, prefersReduced])

  return [ref, display]
}
