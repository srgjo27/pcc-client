import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { useLogin } from '../hooks';

// Mock the useLogin custom hook
vi.mock('../hooks', () => ({
  useLogin: vi.fn(),
}));

describe('LoginForm Component', () => {
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLogin as Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
  };

  test('renders all form fields, buttons, and redirect links correctly', () => {
    renderComponent();

    // Check header
    expect(screen.getByText('Masuk ke Akun Anda')).toBeInTheDocument();
    expect(screen.getByText('Silakan masukkan email dan kata sandi Anda untuk masuk.')).toBeInTheDocument();

    // Check input fields by label name
    expect(screen.getByLabelText('Alamat Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Kata Sandi')).toBeInTheDocument();

    // Check submit button
    expect(screen.getByRole('button', { name: /^masuk$/i })).toBeInTheDocument();

    // Check redirect links
    expect(screen.getByText('Lupa Kata Sandi?')).toBeInTheDocument();
    expect(screen.getByText('Belum memiliki akun?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /daftar sekarang/i })).toBeInTheDocument();
  });

  test('displays validation errors when submitting empty form', async () => {
    renderComponent();

    const submitBtn = screen.getByRole('button', { name: /^masuk$/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Email wajib diisi.')).toBeInTheDocument();
      expect(screen.getByText('Kata sandi wajib diisi.')).toBeInTheDocument();
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  test('toggles password visibility when eye button is clicked', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Kata Sandi') as HTMLInputElement;

    // Default type should be password
    expect(passwordInput.type).toBe('password');

    // Click toggle show password
    const toggleButton = screen.getByRole('button', { name: /show password/i });
    await userEvent.click(toggleButton);

    expect(passwordInput.type).toBe('text');

    // Click again to hide
    const toggleHideButton = screen.getByRole('button', { name: /hide password/i });
    await userEvent.click(toggleHideButton);

    expect(passwordInput.type).toBe('password');
  });

  test('submits successfully when input is valid', async () => {
    mockMutateAsync.mockResolvedValueOnce({
      user: { id: '123', name: 'John Doe', email: 'john@example.com' },
      token: 'mock_token',
    });

    renderComponent();

    const emailInput = screen.getByLabelText('Alamat Email');
    const passwordInput = screen.getByLabelText('Kata Sandi');

    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');

    const submitBtn = screen.getByRole('button', { name: /^masuk$/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
      });
    });
  });

  test('displays error message from mutation when login fails', async () => {
    const apiError = new Error('Invalid email or password.');
    mockMutateAsync.mockRejectedValueOnce(apiError);

    renderComponent();

    const emailInput = screen.getByLabelText('Alamat Email');
    const passwordInput = screen.getByLabelText('Kata Sandi');

    await userEvent.type(emailInput, 'wrong@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');

    const submitBtn = screen.getByRole('button', { name: /^masuk$/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
      expect(screen.getByText('Invalid email or password.')).toBeInTheDocument();
    });
  });
});
