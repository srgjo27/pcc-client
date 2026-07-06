import { ENDPOINTS } from "@/constants/endpoints";
import { axiosClient } from "@/services/axiosClient";
import type { ApiResponse } from "@/shared/types/api";
import type { Task, TasksParams } from "../types";

export async function fetchTasks(parameters?: TasksParams) {
    const response = await axiosClient.get<ApiResponse<Task[]>>(
        ENDPOINTS.TASK.TASKS,
        {
            params: parameters,
        },
    );
    return response.data.data;
}

export async function getTaskInformation(id: string) {
    const response = await axiosClient.get<ApiResponse<Task>>(
        ENDPOINTS.TASK.VIEW.replace('{id}', id)
    );
    return response.data.data;
}