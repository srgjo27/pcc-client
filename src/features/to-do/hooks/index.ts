import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TaskPayload, TasksParams } from "../types";
import { createTask, deleteTask, fetchTasks, getTaskInformation } from "../services";

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

export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation<string, Error, TaskPayload>({
        mutationFn: (payload) => createTask(payload),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            return res;
        }
    });
}

export function useRemoveTask() {
    const queryClient = useQueryClient();
    return useMutation<string, Error, string>({
        mutationFn: (id) => deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    })
}