export const useScroll = () => {
  const scrollToTop = (smooth = false) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto',
    })
  }

  const scrollToElement = (
    element: HTMLElement | Element | null | undefined,
    block: ScrollLogicalPosition = 'start',
    smooth = true
  ) => {
    if (element && 'scrollIntoView' in element && typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block,
      })
    }
  }

  return {
    scrollToTop,
    scrollToElement,
  }
}
