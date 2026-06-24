import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const mockOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

describe('Select Component', () => {
  test('renders select with options and associates label correctly', () => {
    render(<Select label="Choose Fruit" options={mockOptions} />);
    
    // Label should be in document
    const label = screen.getByText('Choose Fruit');
    expect(label).toBeInTheDocument();

    // Select should be associated with the label (by its role/accessible name)
    const select = screen.getByRole('combobox', { name: /choose fruit/i });
    expect(select).toBeInTheDocument();
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveValue('apple');
  });

  test('allows selection of different options', async () => {
    render(<Select label="Fruit Select" options={mockOptions} defaultValue="apple" />);
    
    const select = screen.getByRole('combobox', { name: /fruit select/i }) as HTMLSelectElement;
    expect(select.value).toBe('apple');
    
    await userEvent.selectOptions(select, 'banana');
    expect(select.value).toBe('banana');
  });

  test('renders error state correctly and sets aria-invalid', () => {
    render(<Select label="Fruit Select" options={mockOptions} error="Selection is required" />);
    
    const select = screen.getByLabelText('Fruit Select');
    expect(select).toHaveAttribute('aria-invalid', 'true');

    const errorMsg = screen.getByRole('alert');
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg).toHaveTextContent('Selection is required');
  });

  test('renders helper text correctly when no error is present', () => {
    render(<Select label="Fruit Select" options={mockOptions} helperText="Choose your favorite fruit" />);
    
    const select = screen.getByLabelText('Fruit Select');
    expect(select).toHaveAttribute('aria-invalid', 'false');

    const helper = screen.getByText('Choose your favorite fruit');
    expect(helper).toBeInTheDocument();
  });

  test('respects the disabled state and prevents selection change', async () => {
    render(<Select label="Fruit Select" options={mockOptions} disabled defaultValue="apple" />);
    
    const select = screen.getByRole('combobox', { name: /fruit select/i });
    expect(select).toBeDisabled();
  });
});
