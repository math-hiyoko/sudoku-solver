import '@testing-library/jest-dom'

// ResizeObserver mock for jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}