import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Select } from '@/shared/components/ui/Select';
import { formatToDatetimeLocal, formatToDateLocal } from '@/shared/utils/date';
import { getEventSchema, type EventFormPayload } from '../schemas';
import type { ScheduleEvent, EventContext } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormPayload) => Promise<void>;
  onDelete?: () => Promise<void>;
  event?: ScheduleEvent | null;
  isLoading?: boolean;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 0, label: 'Sun' },
];

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  event,
  isLoading = false,
}) => {
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EventFormPayload>({
    resolver: zodResolver(getEventSchema(t)),
    defaultValues: {
      title: '',
      description: '',
      context: 'personal',
      startDate: '',
      endDate: '',
      isRecurring: false,
      recurringDays: [],
      recurringEndDate: '',
    },
  });

  const isRecurring = watch('isRecurring');

  // Reset form when event changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (event) {
        reset({
          title: event.title,
          description: event.description || '',
          context: event.context,
          startDate: formatToDatetimeLocal(event.startDate),
          endDate: formatToDatetimeLocal(event.endDate),
          isRecurring: event.isRecurring,
          recurringDays: event.recurringDays || [],
          recurringEndDate: event.recurringEndDate ? formatToDateLocal(event.recurringEndDate) : '',
        });
      } else {
        const now = new Date();
        const start = new Date(now);
        start.setMinutes(0, 0, 0); // round to current hour
        const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

        reset({
          title: '',
          description: '',
          context: 'personal',
          startDate: formatToDatetimeLocal(start.toISOString()),
          endDate: formatToDatetimeLocal(end.toISOString()),
          isRecurring: false,
          recurringDays: [],
          recurringEndDate: '',
        });
      }
    }
  }, [isOpen, event, reset]);

  const handleFormSubmit = async (data: EventFormPayload) => {
    // Format recurring dates properly if recurring
    const formattedData: EventFormPayload = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      recurringEndDate: data.recurringEndDate && data.isRecurring
        ? new Date(data.recurringEndDate + 'T23:59:59').toISOString()
        : undefined,
      recurringDays: data.isRecurring ? data.recurringDays : undefined,
    };
    await onSubmit(formattedData);
    onClose();
  };

  const contexts: { value: EventContext; label: string }[] = [
    { value: 'college', label: t.todo.aside.contexts.college },
    { value: 'work', label: t.todo.aside.contexts.work },
    { value: 'business', label: t.todo.aside.contexts.business },
    { value: 'personal', label: t.todo.aside.contexts.personal },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? t.schedule.editEvent : t.schedule.addEvent}
      description={t.schedule.eventDetails}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
        {/* Title */}
        <Input
          type="text"
          label={t.schedule.form.titleLabel}
          placeholder={t.schedule.form.titlePlaceholder}
          error={errors.title?.message}
          disabled={isLoading}
          {...register('title')}
        />

        {/* Description */}
        <Textarea
          id="event-description"
          label={t.schedule.form.descriptionLabel}
          placeholder={t.schedule.form.descriptionPlaceholder}
          error={errors.description?.message}
          disabled={isLoading}
          {...register('description')}
        />

        {/* Category Context & Colors */}
        <Select
          id="event-context"
          label={t.schedule.form.contextLabel}
          error={errors.context?.message}
          disabled={isLoading}
          options={contexts}
          {...register('context')}
        />

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="datetime-local"
            label={t.schedule.form.startDateLabel}
            error={errors.startDate?.message}
            disabled={isLoading}
            {...register('startDate')}
          />
          <Input
            type="datetime-local"
            label={t.schedule.form.endDateLabel}
            error={errors.endDate?.message}
            disabled={isLoading}
            {...register('endDate')}
          />
        </div>

        {/* Recurrence Toggle */}
        <div className="flex items-center gap-3 py-2 mt-2">
          <input
            id="event-isRecurring"
            type="checkbox"
            disabled={isLoading}
            className="h-4.5 w-4.5 rounded border-neutral-300 accent-[#FFB300] cursor-pointer"
            {...register('isRecurring')}
          />
          <label
            htmlFor="event-isRecurring"
            className="text-sm font-medium text-slate-700 cursor-pointer select-none"
          >
            {t.schedule.form.isRecurringLabel}
          </label>
        </div>

        {/* Recurrence Pattern Configuration */}
        {isRecurring && (
          <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-neutral-300 animate-fadeIn">
            {/* Days of week selection */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t.schedule.form.recurringDaysLabel}
              </span>
              <Controller
                control={control}
                name="recurringDays"
                render={({ field }) => {
                  const currentDays = field.value || [];
                  const toggleDay = (day: number) => {
                    const next = currentDays.includes(day)
                      ? currentDays.filter((d) => d !== day)
                      : [...currentDays, day];
                    setValue('recurringDays', next, { shouldValidate: true });
                  };

                  return (
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day) => {
                        const isSelected = currentDays.includes(day.value);
                        return (
                          <button
                            key={day.value}
                            type="button"
                            disabled={isLoading}
                            onClick={() => toggleDay(day.value)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${isSelected
                              ? 'bg-[#29B6F6] text-white'
                              : 'bg-white text-slate-600 border-neutral-300 hover:bg-slate-50'
                              }`}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  );
                }}
              />
            </div>

            {/* Recurrence End Date */}
            <Input
              type="date"
              label={t.schedule.form.recurringEndDateLabel}
              error={errors.recurringEndDate?.message}
              disabled={isLoading}
              {...register('recurringEndDate')}
            />
          </div>
        )}

        {/* Submit & Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
          <div>
            {event && onDelete && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={isLoading}
                onClick={onDelete}
                className="w-full sm:w-auto"
              >
                {t.schedule.deleteEvent}
              </Button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              {t.todo.cancelButton}
            </Button>
            <Button
              type="submit"
              variant="custom"
              size="sm"
              isLoading={isLoading}
              className="w-full sm:w-auto bg-[#26A69A] hover:bg-[#23968b] text-white"
            >
              {t.todo.saveButton}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
export default EventModal;
