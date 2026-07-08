import { useQuery } from "@tanstack/react-query";
import type { EventsParams } from "../types";
import { fetchEvents } from "../services";

const EVENTS_KEYS = {
  events: (params?: EventsParams) => ['events', 'data', params] as const,
}

export function useEvents(parameters?: EventsParams) {
  return useQuery({
    queryKey: EVENTS_KEYS.events(parameters),
    queryFn: () => fetchEvents(parameters),
  });
}