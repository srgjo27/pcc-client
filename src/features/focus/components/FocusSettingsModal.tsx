import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { focusSettingsSchema } from '../schemas';
import { useSaveFocusSettings } from '../hooks';

type SettingsFormValues = z.infer<typeof focusSettingsSchema>;

interface FocusSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: {
    focusDuration: number;
    breakDuration: number;
  };
}

export const FocusSettingsModal: React.FC<FocusSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const { t, lang } = useLanguage();
  const { mutateAsync: saveSettings, isPending: isSavingSettings } = useSaveFocusSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(focusSettingsSchema),
    defaultValues: {
      focusDuration: settings?.focusDuration,
      breakDuration: settings?.breakDuration,
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        focusDuration: settings.focusDuration,
        breakDuration: settings.breakDuration,
      });
    }
  }, [settings, reset]);

  const onSave = async (data: SettingsFormValues) => {
    await saveSettings(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.focus.customizeTimer}
      description={
        lang === 'id'
          ? 'Sesuaikan durasi Pomodoro untuk fokus dan istirahat.'
          : 'Adjust the Pomodoro duration for focus and break.'
      }
    >
      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            label={t.focus.focusDurationLabel}
            error={errors.focusDuration?.message}
            className="text-sm"
            {...register('focusDuration', { valueAsNumber: true })}
          />
          <Input
            type="number"
            label={t.focus.breakDurationLabel}
            error={errors.breakDuration?.message}
            className="text-sm"
            {...register('breakDuration', { valueAsNumber: true })}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            type="button"
            size="sm"
            onClick={onClose}
          >
            {t.focus.cancelBtn}
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isSavingSettings}
          >
            {t.focus.saveSettings}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
