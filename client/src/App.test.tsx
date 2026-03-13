import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import App from './App';
import Header from './components/Header';

describe('Initial Smoke Tests', () => {
  it('App renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });

  it('Header Renders without crashing', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <Header />
        </CartProvider>
      </BrowserRouter>
    );
  });
});
