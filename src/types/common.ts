export interface PaginatedResponse<T> {
    items: T[];
    totalPages: number;
    currentPage: number;
    pageSize: number;
    count: number;
    }