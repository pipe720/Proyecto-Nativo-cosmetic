import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Nativo public store', () => {
  render(<App />);
  expect(screen.getAllByText(/Nativo Cosmetic/i).length).toBeGreaterThan(0);
});
