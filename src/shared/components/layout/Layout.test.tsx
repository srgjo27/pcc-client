import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Layout from './Layout';

describe('Layout Component', () => {
  test('renders children content correctly inside layout page wrapper', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div data-testid="child-content">Dashboard Content Test</div>
        </Layout>
      </MemoryRouter>
    );

    expect(screen.getByTestId('child-content')).toHaveTextContent('Dashboard Content Test');
  });

  test('toggles sidebar collapse state when the toggle button is clicked', async () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );

    // Initial state: Sidebar has expand/collapse button
    const hideMenuButton = screen.getByRole('button', { name: /collapse sidebar/i });
    expect(hideMenuButton).toBeInTheDocument();

    // Click collapse
    await userEvent.click(hideMenuButton);

    // The button action label should switch to "Expand Sidebar"
    const expandMenuButton = screen.getByRole('button', { name: /expand sidebar/i });
    expect(expandMenuButton).toBeInTheDocument();

    // Click expand
    await userEvent.click(expandMenuButton);
    expect(screen.getByRole('button', { name: /collapse sidebar/i })).toBeInTheDocument();
  });

  test('renders navigation link with correct attributes', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );

    const dashboardLinks = screen.getAllByRole('link', { name: /dashboard/i });
    expect(dashboardLinks.length).toBeGreaterThan(0);
    expect(dashboardLinks[0]).toHaveAttribute('href', '/dashboard');
  });
});
