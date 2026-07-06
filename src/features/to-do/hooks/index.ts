import { useQuery } from "@tanstack/react-query";
import type { TasksParams } from "../types";
import { fetchTasks, getTaskInformation } from "../services";

const TASKS_KEYS = {
    tasks: (params?: TasksParams) =>
        ['tasks', 'data', params] as const,
    view: (id: string) => ['tasks', 'detail', id] as const
}

export function useTasks(parameters?: TasksParams) {
    return useQuery({
        queryKey: TASKS_KEYS.tasks(parameters),
        queryFn: () => fetchTasks(parameters)
    });
}

export function useTaskInformation(id: string) {
    return useQuery({
        queryKey: TASKS_KEYS.view(id),
        queryFn: () => getTaskInformation(id)
    });
}