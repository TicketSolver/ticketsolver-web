'use client'

import { useMemo } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import React from "react"
import { Button } from "./button"

interface TablePaginationProps {
  count: number
  page: number
  perPage: number
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
  perPageOptions?: number[]
}

export function TablePagination({
  count,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 25, 50, 100],
}: TablePaginationProps) {
  const totalPages = Math.ceil(count / perPage)

  const from = useMemo(() => (count === 0 ? 0 : (page - 1) * perPage + 1), [page, perPage, count])
  const to = useMemo(() => Math.min(page * perPage, count), [page, perPage, count])

  const isFirstPage = page === 1
  const isLastPage = page === totalPages || count === 0

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
      {/* 🎛️ Seletor de itens por página */}
      <select
        className="w-full max-w-[140px] border-2 rounded-md px-3 py-2"
        value={String(perPage)}
        onChange={(e) => onPerPageChange(+e.target.value)}
      >
        {perPageOptions.map((opt) => (
          <option key={opt} value={String(opt)}>
            {opt} / página
          </option>
        ))}
      </select>

      {/* 🧾 Label de info */}
      <div>
        {count > 0
          ? `Exibindo ${from}–${to} de ${count} registros`
          : "Nenhum registro encontrado"}
      </div>

      {/* 📦 Controles de paginação */}
      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={isFirstPage}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="px-2">
          Página <strong>{page}</strong> de <strong>{totalPages || 1}</strong>
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={isLastPage}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={isLastPage}
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
