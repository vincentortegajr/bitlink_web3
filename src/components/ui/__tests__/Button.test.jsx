import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from '../Button';
import matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

describe('Button component', () => {
  it('renders icon when iconName is provided', () => {
    const { container } = render(<Button iconName="ArrowLeft">Back</Button>);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies outline variant classes', () => {
    const { getByRole } = render(<Button variant="outline">Outline</Button>);
    const button = getByRole('button', { name: /outline/i });
    expect(button.className).toMatch(/border-2/);
  });
});
