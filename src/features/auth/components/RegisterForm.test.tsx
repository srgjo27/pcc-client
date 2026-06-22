import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RegisterForm } from './RegisterForm';
import { useRegister } from '../hooks';

// Mock the useRegister custom hook
vi.mock('../hooks', () => ({
  useRegister: vi.fn(),
}));

describe('RegisterForm Component', () => {
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRegister as Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );
  };

  test('renders all form fields, buttons, and redirect links correctly', () => {
    renderComponent();

    // Check header
    expect(screen.getByText('Daftar Akun Baru')).toBeInTheDocument();
    expect(screen.getByText('Silakan isi data diri Anda untuk membuat akun baru.')).toBeInTheDocument();

    // Check input fields by label name
    expect(screen.getByLabelText('Nama Lengkap')).toBeInTheDocument();
    expect(screen.getByLabelText('Alamat Email')).toBeInTheDocument();
    
    // There are two "Kata Sandi" labels technically or label text matches:
    // "Kata Sandi" and "Konfirmasi Kata Sandi"
    expect(screen.getByLabelText('Kata Sandi')).toBeInTheDocument();
    expect(screen.getByLabelText('Konfirmasi Kata Sandi')).toBeInTheDocument();

    // Check checkbox
    expect(screen.getByLabelText('Saya menyetujui Syarat dan Ketentuan')).toBeInTheDocument();

    // Check submit button
    expect(screen.getByRole('button', { name: /^daftar$/i })).toBeInTheDocument();

    // Check login redirect link
    expect(screen.getByText('Sudah memiliki akun?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /masuk di sini/i })).toBeInTheDocument();
  });

  test('displays validation errors when submitting empty form', async () => {
    renderComponent();

    const submitBtn = screen.getByRole('button', { name: /^daftar$/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Nama lengkap wajib diisi.')).toBeInTheDocument();
      expect(screen.getByText('Email wajib diisi.')).toBeInTheDocument();
      expect(screen.getByText('Kata sandi wajib diisi.')).toBeInTheDocument();
      expect(screen.getByText('Konfirmasi kata sandi wajib diisi.')).toBeInTheDocument();
      expect(screen.getByText('Anda harus menyetujui Syarat dan Ketentuan.')).toBeInTheDocument();
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  test('displays error when passwords do not match', async () => {
    renderComponent();

    await userEvent.type(screen.getByLabelText('Nama Lengkap'), 'Jane Doe');
    await userEvent.type(screen.getByLabelText('Alamat Email'), 'jane@example.com');
    await userEvent.type(screen.getByLabelText('Kata Sandi'), 'password123');
    await userEvent.type(screen.getByLabelText('Konfirmasi Kata Sandi'), 'differentpassword');
    await userEvent.click(screen.getByLabelText('Saya menyetujui Syarat dan Ketentuan'));

    const submitBtn = screen.getByRole('button', { name: /^daftar$/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Kata sandi tidak cocok.')).toBeInTheDocument();
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  test('toggles password and confirm password fields visibility when eye buttons are clicked', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Kata Sandi') as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText('Konfirmasi Kata Sandi') as HTMLInputElement;

    // Default type should be password
    expect(passwordInput.type).toBe('password');
    expect(confirmPasswordInput.type).toBe('password');

    // Click toggle show password
    const toggleButtons = screen.getAllByRole('button', { name: /show/i });
    
    // Toggle first eye button (password)
    await userEvent.click(toggleButtons[0]);
    expect(passwordInput.type).toBe('text');
    expect(confirmPasswordInput.type).toBe('password');

    // Toggle second eye button (confirm password)
    await userEvent.click(toggleButtons[1]);
    expect(passwordInput.type).toBe('text');
    expect(confirmPasswordInput.type).toBe('text');
  });

  test('submits successfully and resets form when input is valid', async () => {
    mockMutateAsync.mockResolvedValueOnce({
      user: { id: '1', name: 'Jane Doe', email: 'jane@example.com' },
      token: 'jwt_token',
    });

    renderComponent();

    const nameInput = screen.getByLabelText('Nama Lengkap');
    const emailInput = screen.getByLabelText('Alamat Email');
    const passwordInput = screen.getByLabelText('Kata Sandi');
    const confirmPasswordInput = screen.getByLabelText('Konfirmasi Kata Sandi');
    const termsCheckbox = screen.getByLabelText('Saya menyetujui Syarat dan Ketentuan');

    await userEvent.type(nameInput, 'Jane Doe');
    await userEvent.type(emailInput, 'jane@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    await userEvent.click(termsCheckbox);

    const submitBtn = screen.getByRole('button', { name: /^daftar$/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        acceptTerms: true,
      });
    });

    // Form should be reset
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');
    expect(confirmPasswordInput).toHaveValue('');
    expect(termsCheckbox).not.toBeChecked();
  });

  test('displays error message from mutation when registration fails', async () => {
    const apiError = new Error('Email already taken.');
    mockMutateAsync.mockRejectedValueOnce(apiError);

    renderComponent();

    await userEvent.type(screen.getByLabelText('Nama Lengkap'), 'Jane Doe');
    await userEvent.type(screen.getByLabelText('Alamat Email'), 'jane@example.com');
    await userEvent.type(screen.getByLabelText('Kata Sandi'), 'password123');
    await userEvent.type(screen.getByLabelText('Konfirmasi Kata Sandi'), 'password123');
    await userEvent.click(screen.getByLabelText('Saya menyetujui Syarat dan Ketentuan'));

    const submitBtn = screen.getByRole('button', { name: /^daftar$/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
      expect(screen.getByText('Email already taken.')).toBeInTheDocument();
    });
  });
});
