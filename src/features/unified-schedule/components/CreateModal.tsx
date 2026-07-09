import React, { useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Select } from '@/shared/components/ui/Select';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatToDatetimeLocal } from '@/shared/utils/date';
import { createEventSchema } from '../schemas';
import type { EventPayload } from '../types';
import { useCreateEvent } from '../hooks';

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DAYS_OF_WEEK = (lang: string) => [
    { value: 'MONDAY', label: lang === 'id' ? 'Senin' : 'Monday' },
    { value: 'TUESDAY', label: lang === 'id' ? 'Selasa' : 'Tuesday' },
    { value: 'WEDNESDAY', label: lang === 'id' ? 'Rabu' : 'Wednesday' },
    { value: 'THURSDAY', label: lang === 'id' ? 'Kamis' : 'Thursday' },
    { value: 'FRIDAY', label: lang === 'id' ? 'Jumat' : 'Friday' },
    { value: 'SATURDAY', label: lang === 'id' ? 'Sabtu' : 'Saturday' },
    { value: 'SUNDAY', label: lang === 'id' ? 'Minggu' : 'Sunday' },
];

export const CreateModal: React.FC<CreateModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { t, lang } = useLanguage();
    const { mutate, isPending } = useCreateEvent();

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<EventPayload>({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            title: '',
            description: '',
            context: 'PERSONAL',
            startTime: new Date(),
            endTime: new Date(),
            isRecurring: false,
            recurrence: {
                frequency: 'WEEKLY',
                days: [],
            },
            location: '',
            color: '#26A69A',
        },
    });

    const isRecurring = useWatch({
        control,
        name: 'isRecurring',
    });

    const onSubmit = async (data: EventPayload) => {
        const payload: EventPayload = {
            ...data,
            recurrence: data.isRecurring
                ? {
                    frequency: data.recurrence?.frequency || 'WEEKLY',
                    days: data.recurrence?.days || [],
                }
                : null,
        };

        mutate(payload, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    useEffect(() => {
        if (isOpen) {
            const now = new Date();
            const start = new Date(now);
            start.setMinutes(0, 0, 0);
            const end = new Date(start.getTime() + 60 * 60 * 1000);

            reset({
                title: '',
                description: '',
                context: 'PERSONAL',
                startTime: formatToDatetimeLocal(start.toISOString()),
                endTime: formatToDatetimeLocal(end.toISOString()),
                isRecurring: false,
                recurrence: {
                    frequency: 'WEEKLY',
                    days: [],
                },
                location: '',
                color: '#26A69A',
            });
        }
    }, [isOpen, reset]);

    const contexts: { value: string; label: string }[] = [
        { value: 'LECTURE', label: lang === 'id' ? 'Kuliah' : 'Lecture' },
        { value: 'WORK', label: lang === 'id' ? 'Kerja' : 'Work' },
        { value: 'BUSINESS', label: lang === 'id' ? 'Bisnis' : 'Business' },
        { value: 'PERSONAL', label: lang === 'id' ? 'Pribadi' : 'Personal' },
        { value: 'GYM', label: lang === 'id' ? 'Gym' : 'Gym' },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={lang === 'id' ? 'Tambah Jadwal Baru' : 'Add New Event'}
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <Input
                    label={t.schedule.form.titleLabel}
                    placeholder={t.schedule.form.titlePlaceholder}
                    isRequired
                    error={errors.title?.message}
                    disabled={isPending}
                    {...register('title')}
                />

                <Textarea
                    label={t.schedule.form.descriptionLabel}
                    placeholder={t.schedule.form.descriptionPlaceholder}
                    error={errors.description?.message}
                    disabled={isPending}
                    {...register('description')}
                />

                <Select
                    label={t.schedule.form.contextLabel}
                    error={errors.context?.message}
                    disabled={isPending}
                    options={contexts}
                    {...register('context')}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        type="datetime-local"
                        label={t.schedule.form.startDateLabel}
                        error={errors.startTime?.message}
                        disabled={isPending}
                        {...register('startTime')}
                    />
                    <Input
                        type="datetime-local"
                        label={t.schedule.form.endDateLabel}
                        error={errors.endTime?.message}
                        disabled={isPending}
                        {...register('endTime')}
                    />
                </div>

                <Input
                    label={t.schedule.form.locationLabel}
                    placeholder={t.schedule.form.locationPlaceholder}
                    error={errors.location?.message}
                    disabled={isPending}
                    {...register('location')}
                />

                <div className="flex items-center gap-3 py-2 mt-2">
                    <input
                        id="event-isRecurring"
                        type="checkbox"
                        disabled={isPending}
                        className="h-4.5 w-4.5 accent-[#FFB300] cursor-pointer"
                        {...register('isRecurring')}
                    />
                    <label
                        htmlFor="event-isRecurring"
                        className="text-sm font-medium cursor-pointer select-none"
                    >
                        {t.schedule.form.isRecurringLabel}
                    </label>
                </div>

                {isRecurring && (
                    <div className="space-y-4 p-4 rounded-lg bg-slate-50 border border-neutral-300 animate-fadeIn">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold text-slate-500 capitalize tracking-wider">
                                {t.schedule.form.recurringDaysLabel}
                            </span>
                            <Controller
                                control={control}
                                name="recurrence.days"
                                render={({ field }) => {
                                    const currentDays = field.value || [];
                                    const toggleDay = (dayVal: string) => {
                                        const next = currentDays.includes(dayVal)
                                            ? currentDays.filter((d) => d !== dayVal)
                                            : [...currentDays, dayVal];
                                        setValue('recurrence.days', next, { shouldValidate: true });
                                    };

                                    return (
                                        <div className="flex flex-wrap gap-2">
                                            {DAYS_OF_WEEK(lang).map((day) => {
                                                const isSelected = currentDays.includes(day.value);
                                                return (
                                                    <button
                                                        key={day.value}
                                                        type="button"
                                                        disabled={isPending}
                                                        onClick={() => toggleDay(day.value)}
                                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-300 ${isSelected
                                                            ? 'bg-[#29B6F6] text-white'
                                                            : 'bg-white text-slate-500 border-neutral-300 hover:bg-slate-50'
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
                    </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={onClose}
                        className="sm:w-auto"
                    >
                        {lang === 'id' ? "Kembali" : "Close"}
                    </Button>
                    <Button
                        type="submit"
                        size="sm"
                        isLoading={isPending}
                        className="sm:w-auto font-semibold"
                    >
                        {!isPending && (lang === 'id' ? "Kirim" : "Submit")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateModal;