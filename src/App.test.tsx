import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders version text', () => {
  render(<App />);
  const linkElement = screen.getByText(/I am version/i);
  // expect(linkElement).toBeInTheDocument();
});
