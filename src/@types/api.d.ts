interface ApiResponse<T>{
  data: T;
  success: boolean;
  message?: string;
  error?: any
}

interface PaginatedApiResponse<T>{
  data: {
    count: number;
    items: T[];
  };
  success: boolean;
  message?: string;
  error?: any
}

interface PaginatedQuery {
  page: number;
  pageSize: number;
}