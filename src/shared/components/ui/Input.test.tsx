import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input Component', () => {
  test('renders input with label correctly and associates them', () => {
    render(<Input label="Username" placeholder="Enter username" />);
    
    // Label should be in document
    const label = screen.getByText('Username');
    expect(label).toBeInTheDocument();

    // Input should be associated with the label (by its role/accessible name)
    const input = screen.getByRole('textbox', { name: /username/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Enter username');
  });

  test('allows user to type into the input field', async () => {
    render(<Input label="Email" />);
    
    const input = screen.getByRole('textbox', { name: /email/i });
    await userEvent.type(input, 'user@example.com');
    
    expect(input).toHaveValue('user@example.com');
  });

  test('renders error state correctly and sets aria-invalid', () => {
    render(<Input label="Password" error="Password is required" />);
    
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('aria-invalid', 'true');

    const errorMsg = screen.getByRole('alert');
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg).toHaveTextContent('Password is required');
  });

  test('renders helper text correctly when no error is present', () => {
    render(<Input label="Password" helperText="Must be at least 8 characters" />);
    
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('aria-invalid', 'false');

    const helper = screen.getByText('Must be at least 8 characters');
    expect(helper).toBeInTheDocument();
  });

  test('respects the disabled state and prevents user typing', async () => {
    render(<Input label="Static" disabled />);
    
    const input = screen.getByRole('textbox', { name: /static/i });
    expect(input).toBeDisabled();

    await userEvent.type(input, 'cannot type');
    expect(input).toHaveValue('');
  });

  test('renders rightElement correctly when provided', () => {
    render(
      <Input
        label="Password"
        rightElement={<button data-testid="toggle-btn">Show</button>}
      />
    );
    
    const button = screen.getByTestId('toggle-btn');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Show');
  });
});
