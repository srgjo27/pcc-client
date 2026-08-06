import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EventPayload, EventsParams } from "../types";
import { createEvent, deleteEvent, fetchEvents, getEventInformation, updateEvent } from "../services";

const EVENTS_KEYS = {
  events: (params?: EventsParams) => ['events', 'data', params] as const,
  view: (id: string) => ['events', 'detail', id] as const,
}

export function useEvents(parameters?: EventsParams) {
  return useQuery({
    queryKey: EVENTS_KEYS.events(parameters),
    queryFn: () => fetchEvents(parameters),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation<string, Error, EventPayload>({
    mutationFn: (payload) => createEvent(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['events', 'data'] });
      return res;
    }
  });
}

export function useRemoveEvent() {
  const queryClient = useQueryClient();
  return useMutation<string, Error, string>({
    mutationFn: (id) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'data'] });
    }
  });
}

export function useEventInformation(id: string | null) {
  return useQuery({
    queryKey: EVENTS_KEYS.view(id || ''),
    queryFn: () => getEventInformation(id!),
    enabled: !!id,
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation<string, Error, { id: string; payload: EventPayload }>({
    mutationFn: ({ id, payload }) => updateEvent(id, payload),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', 'data'] });
      queryClient.invalidateQueries({ queryKey: EVENTS_KEYS.view(variables.id) });
      return res;
    }
  });
}