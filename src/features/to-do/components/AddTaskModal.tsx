import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import Textarea from '@/shared/components/ui/Textarea';
import { Select } from '@/shared/components/ui/Select';
import { useCreateTask } from '../hooks';
import type { TaskPayload } from '../types';
import { createTaskSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const { t, lang } = useLanguage();
  const { mutate, isPending } = useCreateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskPayload>({
    resolver: zodResolver(createTaskSchema),
  });

  const onSubmit = (data: TaskPayload) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.todo.addButton}
      description={t.todo.modalDescription}
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label={t.todo.form.titleLabel}
          placeholder={t.todo.form.titlePlaceholder}
          isRequired
          error={errors.title?.message}
          {...register('title')}
        />

        <Textarea
          label={t.todo.form.descriptionLabel}
          placeholder={t.todo.form.descriptionPlaceholder}
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label={t.todo.aside.contextTitle}
            error={errors.context?.message}
            isRequired
            options={[
              { value: '', label: `${lang === 'id' ? 'Pilih konteks' : 'Select context'}` },
              { value: 'LECTURE', label: t.todo.aside.contexts.lecture },
              { value: 'WORK', label: t.todo.aside.contexts.work },
              { value: 'BUSINESS', label: t.todo.aside.contexts.business },
              { value: 'PERSONAL', label: t.todo.aside.contexts.personal }
            ]}
            {...register('context')}
          />
          <Select
            label={t.todo.aside.priorityTitle}
            error={errors.priority?.message}
            isRequired
            options={[
              { value: '', label: `${lang === 'id' ? 'Pilih prioritas' : 'Select priority'}` },
              { value: 'LOW', label: t.todo.aside.priorities.low },
              { value: 'MEDIUM', label: t.todo.aside.priorities.medium },
              { value: 'HIGH', label: t.todo.aside.priorities.high },
              { value: 'URGENT', label: t.todo.aside.priorities.urgent }
            ]}
            {...register('priority')}
          />
          <Select
            label={t.todo.form.statusLabel}
            error={errors.status?.message}
            isRequired
            options={[
              { value: '', label: `${lang === 'id' ? 'Pilih status' : 'Select status'}` },
              { value: 'TODO', label: t.todo.aside.status.todo },
              { value: 'IN_PROGRESS', label: t.todo.aside.status.inProgress },
              { value: 'DONE', label: t.todo.aside.status.done },
              { value: 'CANCELLED', label: t.todo.aside.status.cancelled }
            ]}
            {...register('status')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t.todo.form.dueDateLabel}
            type="date"
            error={errors.dueDate?.message}
            {...register('dueDate')}
          />
          <Input
            label={t.todo.form.dueTimeLabel}
            type="time"
            error={errors.dueTime?.message}
            {...register('dueTime')}
          />
        </div>

        <Input
          label={t.todo.form.tagsLabel}
          placeholder={t.todo.form.tagsPlaceholder}
          error={errors.tags?.message}
          {...register('tags')}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            size="sm"
          >
            {lang === 'id' ? 'Tutup' : 'Close'}
          </Button>
          <Button
            type="submit"
            size="sm"
            className="font-semibold"
            isLoading={isPending}
          >
            {!isPending && (lang === 'id' ? 'Simpan' : 'Save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
