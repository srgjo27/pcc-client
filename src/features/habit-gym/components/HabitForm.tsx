import React from 'react';
import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { habitSchema } from '../schemas';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { Button } from '@/shared/components/ui/Button';
import { WEEKDAYS_SHORT, WEEKDAYS_SHORT_ID } from '@/shared/utils/date';

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof habitSchema>) => void;
  isLoading?: boolean;
}

const AVAILABLE_ICONS = [
  { value: 'Dumbbell', label: 'Gym / Sports' },
  { value: 'BookOpen', label: 'Reading / Learning' },
  { value: 'Moon', label: 'Sleep / Rest' },
  { value: 'Droplet', label: 'Water / Diet' },
  { value: 'Heart', label: 'Health / Meds' },
  { value: 'Flame', label: 'Workout / Cardio' },
  { value: 'CalendarRange', label: 'Planning / Schedule' },
  { value: 'Smile', label: 'Mindfulness / Self-care' },
];

export const HabitForm: React.FC<HabitFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { t, lang } = useLanguage();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof habitSchema>>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: '',
      icon: 'Dumbbell',
      frequency: 'daily',
      frequencyDays: [],
    },
  });

  const frequency = useWatch({ control, name: 'frequency' });
  const watchedFrequencyDays = useWatch({ control, name: 'frequencyDays' });
  const frequencyDays = watchedFrequencyDays || [];

  const handleDayToggle = (day: number) => {
    if (frequencyDays.includes(day)) {
      setValue(
        'frequencyDays',
        frequencyDays.filter((d) => d !== day)
      );
    } else {
      setValue('frequencyDays', [...frequencyDays, day].sort());
    }
  };

  const handleFormSubmit = (data: z.infer<typeof habitSchema>) => {
    if (data.frequency === 'daily') {
      data.frequencyDays = [];
    }
    onSubmit(data);
    reset();
  };

  const weekdays = lang === 'id' ? WEEKDAYS_SHORT_ID : WEEKDAYS_SHORT;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.habits.addHabit}
      description={t.habits.subtitle}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <Input
          label={t.habits.form.nameLabel}
          placeholder={t.habits.form.namePlaceholder}
          error={errors.name?.message}
          {...register('name')}
        />

        <Select
          label={t.habits.form.iconLabel}
          error={errors.icon?.message}
          options={AVAILABLE_ICONS}
          {...register('icon')}
        />

        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm">
            {t.habits.form.freqLabel}
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                value="daily"
                {...register('frequency')}
              />
              <span>{t.habits.frequencyDaily}</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                value="custom"
                {...register('frequency')}
              />
              <span>{t.habits.frequencyCustom}</span>
            </label>
          </div>
        </div>

        {frequency === 'custom' && (
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm">
              {t.habits.form.daysLabel}
            </label>
            <div className="flex flex-wrap gap-2">
              {weekdays.map((dayName, idx) => {
                const isSelected = frequencyDays.includes(idx);
                return (
                  <Button
                    key={idx}
                    variant="custom"
                    size="custom"
                    onClick={() => handleDayToggle(idx)}
                    className={`flex-1 min-w-10.5 py-2 rounded-lg text-xs border duration-200 focus:outline-none ${isSelected
                      ? 'bg-[#F0F9FF] text-[#26A69A] border-[#26A69A]'
                      : 'bg-white text-slate-500 border-neutral-300 hover:bg-slate-50'
                      }`}
                  >
                    {dayName}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {t.habits.form.submitCancel}
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isLoading}
          >
            {t.habits.form.submitAdd}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
