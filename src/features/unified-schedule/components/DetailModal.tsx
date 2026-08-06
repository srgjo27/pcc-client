import React from 'react';
import { Calendar, MapPin, AlignLeft, RefreshCw, Trash2, Edit } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { useEventInformation, useRemoveEvent } from '../hooks';
import { Loading } from '@/shared/components/ui/Loading';
import { formatStartEndDate } from '@/shared/utils/date';

interface DetailModalProps {
  id: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ id, isOpen, onClose, onEdit }) => {
  const { lang } = useLanguage();
  const { data: event, isLoading } = useEventInformation(id!);
  const { mutate: deleteEvent, isPending: isDeleting } = useRemoveEvent();

  const handleClose = () => {
    onClose();
  };

  const handleDelete = () => {
    if (!id) return;
    const confirmMessage = lang === 'id'
      ? 'Apakah Anda yakin ingin menghapus kegiatan ini?'
      : 'Are you sure you want to delete this event?';

    if (window.confirm(confirmMessage)) {
      deleteEvent(id, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={lang === 'id' ? 'Detail Kegiatan' : 'Event Details'}
      size="md"
    >
      {isLoading && (
        <div className="py-12 flex justify-center items-center">
          <Loading />
        </div>
      )}

      {!isLoading && !event && (
        <div className="py-8 text-center text-slate-500 text-sm">
          {lang === 'id' ? 'Detail kegiatan tidak ditemukan.' : 'Event details not found.'}
        </div>
      )}

      {!isLoading && event && (
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h3 className="text-lg font-semibold">{event.title}</h3>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-xs text-black">
                  {lang === 'id' ? 'Waktu' : 'Time'}
                </p>
                <p className="text-sm text-slate-500">
                  {formatStartEndDate(event.startTime, event.endTime, lang)}
                </p>
              </div>
            </div>

            {event.location && (
              <div className="flex gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-xs text-black">
                    {lang === 'id' ? 'Lokasi' : 'Location'}
                  </p>
                  <p className="text-sm text-slate-500">{event.location}</p>
                </div>
              </div>
            )}
            {event.description && (
              <div className="flex gap-2 text-sm text-slate-500">
                <AlignLeft className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="w-full">
                  <p className="font-medium text-xs text-black">
                    {lang === 'id' ? 'Keterangan' : 'Description'}
                  </p>
                  <p className="text-xs text-slate-500 whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </div>
            )}

            {event.isRecurring && event.recurrence && (
              <div className="flex gap-2 text-sm text-slate-500">
                <RefreshCw className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-xs text-black">
                    {lang === 'id' ? 'Pengulangan' : 'Recurrence'}
                  </p>
                  <p className="text-sm text-slate-500 capitalize">
                    {event.recurrence.frequency.toLowerCase()}
                    {event.recurrence.days && event.recurrence.days.length > 0 && (
                      <span className="normal-case">
                        {` (${lang === 'id' ? 'Setiap hari' : 'Every'} ${event.recurrence.days.join(', ')})`}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="flex items-center gap-2 border-neutral-300"
              >
                <Edit className="h-4 w-4" />
                {lang === 'id' ? 'Ubah' : 'Edit'}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {lang === 'id' ? 'Hapus' : 'Delete'}
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClose}
            >
              {lang === 'id' ? 'Tutup' : 'Close'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DetailModal;