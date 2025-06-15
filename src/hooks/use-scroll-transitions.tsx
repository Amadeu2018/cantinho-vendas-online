
import { useEffect, useState, useRef } from "react"

interface UseScrollTransitionsOptions {
  threshold?: number
  rootMargin?: string
  enableFadeTransitions?: boolean
}

export const useScrollTransitions = (options: UseScrollTransitionsOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    enableFadeTransitions = true
  } = options

  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)
  const itemRefs = useRef<Map<string, Element>>(new Map())

  useEffect(() => {
    if (!enableFadeTransitions) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const itemId = entry.target.getAttribute('data-scroll-item')
          if (!itemId) return

          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, itemId]))
            entry.target.classList.add('animate-fade-in', 'animate-scale-in')
            entry.target.classList.remove('opacity-0', 'translate-y-4')
          } else {
            setVisibleItems(prev => {
              const newSet = new Set(prev)
              newSet.delete(itemId)
              return newSet
            })
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    // Observe all existing items
    itemRefs.current.forEach((element) => {
      observerRef.current?.observe(element)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [threshold, rootMargin, enableFadeTransitions])

  const registerItem = (id: string, element: Element | null) => {
    if (!element || !enableFadeTransitions) return

    // Add initial classes for smooth entry
    element.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-500', 'ease-out')
    element.setAttribute('data-scroll-item', id)
    
    itemRefs.current.set(id, element)
    observerRef.current?.observe(element)
  }

  const unregisterItem = (id: string) => {
    const element = itemRefs.current.get(id)
    if (element) {
      observerRef.current?.unobserve(element)
      itemRefs.current.delete(id)
    }
  }

  return {
    visibleItems,
    registerItem,
    unregisterItem,
    isVisible: (id: string) => visibleItems.has(id)
  }
}

export const useScrollToTop = () => {
  const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top: 0,
      behavior
    })
  }

  const scrollToElement = (elementId: string, behavior: ScrollBehavior = 'smooth') => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({
        behavior,
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  return { scrollToTop, scrollToElement }
}
