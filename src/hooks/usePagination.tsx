'use client'

import { useState, useMemo } from "react"

interface UsePaginationProps {
  total?: number
  initialPage?: number
  initialPerPage?: number
  perPageOptions?: number[]
}

export function usePagination({
  total: totalRecords = 0,
  initialPage = 1,
  initialPerPage = 10,
  perPageOptions = [10, 25, 50, 100],
}: UsePaginationProps) {
  const [page, setPage] = useState(initialPage)
  const [total, setTotal] = useState(totalRecords)
  const [perPage, setPerPage] = useState(initialPerPage)

  const totalPages = useMemo(() => Math.ceil(total / perPage), [total, perPage])

  const from = total === 0 ? 0 : (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)

  const isFirstPage = page === 1
  const isLastPage = page >= totalPages || total === 0

  const goToFirstPage = () => setPage(1)
  const goToLastPage = () => setPage(totalPages)
  const goToNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages))
  const goToPreviousPage = () => setPage((prev) => Math.max(prev - 1, 1))
  const updatePage = (page: number) => {
    if (page < 0 || page > totalPages) return;
    setPage(page);
  }

  const changePerPage = (newPerPage: number) => {
    if (!perPageOptions.includes(newPerPage)) return;
    setPerPage(newPerPage)
    setPage(1)
  }

  const updateTotal = (newTotal: number) => setTotal(newTotal);

  return {
    page,
    perPage,
    from,
    to,
    total,
    totalPages,
    isFirstPage,
    isLastPage,
    perPageOptions,
    actions: {
      updateTotal,
      setPerPage: changePerPage,
      goToFirstPage,
      goToLastPage,
      goToNextPage,
      goToPreviousPage,
      setPage: updatePage,
    }
  }
}
