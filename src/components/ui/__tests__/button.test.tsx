import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('should render correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    // It should have some default tailwind classes for the default variant
    expect(button.className).toContain('bg-primary');
  });

  it('should apply the correct variant class', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button.className).toContain('bg-destructive/10');
  });

  it('should apply the correct size class', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button', { name: /large/i });
    expect(button.className).toContain('h-9');
  });

  it('should pass additional props correctly', () => {
    render(<Button data-testid="custom-button" disabled>Disabled</Button>);
    const button = screen.getByTestId('custom-button');
    expect(button).toBeDisabled();
  });
});
