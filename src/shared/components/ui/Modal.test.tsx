import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal Component', () => {
  test('renders modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal" description="Test Description">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  test('does not render modal when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: /tutup dialog/i });
    await userEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when overlay is clicked and closeOnOverlayClick is true', async () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick={true}>
        <div>Modal Content</div>
      </Modal>
    );

    // The overlay is the root wrapper having role="presentation"
    const overlay = screen.getByRole('presentation');
    await userEvent.click(overlay);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when modal content is clicked', async () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div data-testid="content">Modal Content</div>
      </Modal>
    );

    const content = screen.getByTestId('content');
    await userEvent.click(content);

    expect(handleClose).not.toHaveBeenCalled();
  });

  test('calls onClose when Escape key is pressed', async () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEsc={true}>
        <div>Modal Content</div>
      </Modal>
    );

    await userEvent.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
