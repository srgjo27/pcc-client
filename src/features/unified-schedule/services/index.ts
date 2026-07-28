import { ENDPOINTS } from "@/constants/endpoints";
import { axiosClient } from "@/services/axiosClient";
import type { ApiResponse } from "@/shared/types/api";
import type { Event, EventPayload, EventsParams } from "../types";

export async function fetchEvents(parameters?: EventsParams) {
  const response = await axiosClient.get<ApiResponse<Event[]>>(
    ENDPOINTS.EVENT.EVENTS,
    {
      params: parameters,
    }
  );
  return response.data.data;
}

export async function createEvent(payload: EventPayload) {
  const response = await axiosClient.post<ApiResponse<string>>(
    ENDPOINTS.EVENT.CREATE,
    payload,
  );
  return response.data.message;
}

export async function deleteEvent(id: string) {
  const response = await axiosClient.delete<ApiResponse<string>>(
    ENDPOINTS.EVENT.REMOVE.replace("{id}", id),
  );
  return response.data.message;
}

export async function getEventInformation(id: string) {
  const response = await axiosClient.get<ApiResponse<Event>>(
    ENDPOINTS.EVENT.VIEW.replace("{id}", id),
  );
  return response.data.data;
}

export async function updateEvent(id: string, payload: EventPayload) {
  const response = await axiosClient.patch<ApiResponse<string>>(
    ENDPOINTS.EVENT.UPDATE.replace("{id}", id),
    payload,
  );
  return response.data.message;
}