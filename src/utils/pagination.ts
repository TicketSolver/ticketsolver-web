export function getPagination(pagination: PaginatedQuery){
  return `page=${pagination.page || 1}&pageSize=${pagination.pageSize || 10}`;
}