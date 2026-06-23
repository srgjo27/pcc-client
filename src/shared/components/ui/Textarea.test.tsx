import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

describe('Textarea Component', () => {
  test('renders textarea with label correctly and associates them', () => {
    render(<Textarea label="Comments" placeholder="Enter your comments" />);
    
    // Label should be in document
    const label = screen.getByText('Comments');
    expect(label).toBeInTheDocument();

    // Textarea should be associated with the label (by its role/accessible name)
    const textarea = screen.getByRole('textbox', { name: /comments/i });
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('placeholder', 'Enter your comments');
  });

  test('allows user to type into the textarea', async () => {
    render(<Textarea label="Feedback" />);
    
    const textarea = screen.getByRole('textbox', { name: /feedback/i });
    await userEvent.type(textarea, 'Great app!');
    
    expect(textarea).toHaveValue('Great app!');
  });

  test('renders error state correctly and sets aria-invalid', () => {
    render(<Textarea label="Notes" error="Notes field is required" />);
    
    const textarea = screen.getByLabelText('Notes');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');

    const errorMsg = screen.getByRole('alert');
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg).toHaveTextContent('Notes field is required');
  });

  test('renders helper text correctly when no error is present', () => {
    render(<Textarea label="Description" helperText="Add extra details here" />);
    
    const textarea = screen.getByLabelText('Description');
    expect(textarea).toHaveAttribute('aria-invalid', 'false');

    const helper = screen.getByText('Add extra details here');
    expect(helper).toBeInTheDocument();
  });

  test('respects the disabled state and prevents user typing', async () => {
    render(<Textarea label="Static text" disabled />);
    
    const textarea = screen.getByRole('textbox', { name: /static text/i });
    expect(textarea).toBeDisabled();

    await userEvent.type(textarea, 'cannot type');
    expect(textarea).toHaveValue('');
  });
});
