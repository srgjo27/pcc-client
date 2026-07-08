import { ENDPOINTS } from "@/constants/endpoints";
import { axiosClient } from "@/services/axiosClient";
import type { ApiResponse } from "@/shared/types/api";
import type { Event, EventsParams } from "../types";

export async function fetchEvents(parameters?: EventsParams) {
  const response = await axiosClient.get<ApiResponse<Event[]>>(
    ENDPOINTS.EVENT.EVENTS,
    {
      params: parameters,
    }
  );
  return response.data.data;
}