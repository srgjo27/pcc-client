import axios from "axios";
import type { ApiErrorResponse } from "../types/api";

export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return error.response.data.error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred';
}