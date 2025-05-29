
export interface PaginatedResponse<T> {
    count: number;
    items: T[];
    page: number;
    pageSize: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors: any | null;
}