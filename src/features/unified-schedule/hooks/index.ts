import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EventPayload, EventsParams } from "../types";
import { createEvent, fetchEvents } from "../services";

const EVENTS_KEYS = {
  events: (params?: EventsParams) => ['events', 'data', params] as const,
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
      queryClient.invalidateQueries({ queryKey: ['events'] });
      return res;
    }
  });
}