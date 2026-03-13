import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver (needed for framer-motion)
// It must be a class/constructor function
class IntersectionObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// Mock window.scrollTo
window.scrollTo = vi.fn();