import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Testing Setup', () => {
  it('should verify testing environment works', () => {
    render(<div data-testid="test-element">Test Content</div>);
    expect(screen.getByTestId('test-element')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should have jest-dom matchers available', () => {
    render(<div data-testid="dom-test">DOM Element</div>);
    const element = screen.getByTestId('dom-test');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('DOM Element');
  });
});
