import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';

describe('Card Component Family', () => {
  test('renders all Card components correctly with custom classes and content', () => {
    render(
      <Card data-testid="card" className="custom-card">
        <CardHeader data-testid="header" className="custom-header">
          <CardTitle className="custom-title">Card Title</CardTitle>
          <CardDescription className="custom-desc">Card Description</CardDescription>
        </CardHeader>
        <CardContent data-testid="content" className="custom-content">
          <p>Main content body</p>
        </CardContent>
        <CardFooter data-testid="footer" className="custom-footer">
          <button>Action</button>
        </CardFooter>
      </Card>
    );

    // Verify main Card container
    const cardEl = screen.getByTestId('card');
    expect(cardEl).toBeInTheDocument();
    expect(cardEl).toHaveClass('custom-card');

    // Verify CardHeader
    const headerEl = screen.getByTestId('header');
    expect(headerEl).toBeInTheDocument();
    expect(headerEl).toHaveClass('custom-header');

    // Verify CardTitle
    const titleEl = screen.getByRole('heading', { level: 3, name: 'Card Title' });
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveClass('custom-title');

    // Verify CardDescription
    const descEl = screen.getByText('Card Description');
    expect(descEl).toBeInTheDocument();
    expect(descEl).toHaveClass('custom-desc');

    // Verify CardContent
    const contentEl = screen.getByTestId('content');
    expect(contentEl).toBeInTheDocument();
    expect(contentEl).toHaveClass('custom-content');
    expect(contentEl).toHaveTextContent('Main content body');

    // Verify CardFooter
    const footerEl = screen.getByTestId('footer');
    expect(footerEl).toBeInTheDocument();
    expect(footerEl).toHaveClass('custom-footer');
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
