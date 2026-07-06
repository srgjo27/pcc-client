import { ENDPOINTS } from "@/constants/endpoints";
import { axiosClient } from "@/services/axiosClient";
import type { ApiResponse } from "@/shared/types/api";
import type { Task, TaskPayload, TasksParams } from "../types";

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

export async function createTask(payload: TaskPayload) {
    const response = await axiosClient.post<ApiResponse<string>>(
        ENDPOINTS.TASK.CREATE,
        payload,
    );
    return response.data.message;
}

export async function deleteTask(id: string) {
    const response = await axiosClient.delete<ApiResponse<string>>(
        ENDPOINTS.TASK.REMOVE.replace('{id}', id)
    );
    return response.data.message;
}