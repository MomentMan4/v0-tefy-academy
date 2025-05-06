"use client"

import { useMemo } from "react"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

interface Column {
  key: string
  header: string
  cell?: (row: any) => React.ReactNode
  sortable?: boolean
}

interface PaginationOptions {
  pageSize: number
}

interface TableProps {
  data: any[] | Record<string, any>
  columns: Column[]
  pagination?: PaginationOptions
  searchable?: boolean
  title?: string
  emptyState?: React.ReactNode
}

export default function Table({
  data = [],
  columns = [],
  pagination = { pageSize: 10 },
  searchable = true,
  title,
  emptyState,
}: TableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [paginatedData, setPaginatedData] = useState<any[]>([])

  // Convert data to array if it's an object or handle empty data
  const normalizedData = useMemo(() => {
    if (Array.isArray(data)) {
      return data
    }

    if (data && typeof data === "object" && Object.keys(data).length > 0) {
      // Convert object to array if possible
      return Object.values(data)
    }

    // Default to empty array for any other case
    return []
  }, [data])

  // Filter and sort data when dependencies change
  useEffect(() => {
    // Filter data based on search query
    let result = normalizedData
    if (searchable && searchQuery) {
      result = normalizedData.filter((row) =>
        columns.some((column) => {
          const value = row[column.key]
          return (
            value !== undefined && value !== null && String(value).toLowerCase().includes(searchQuery.toLowerCase())
          )
        }),
      )
    }

    // Sort data if sort config exists
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        if (!a || !b) return 0

        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        // Handle undefined or null values
        if (aValue === undefined || aValue === null) return sortConfig.direction === "asc" ? -1 : 1
        if (bValue === undefined || bValue === null) return sortConfig.direction === "asc" ? 1 : -1

        // Compare values based on type
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
        }

        // Default string comparison
        const aString = String(aValue).toLowerCase()
        const bString = String(bValue).toLowerCase()

        return sortConfig.direction === "asc" ? aString.localeCompare(bString) : bString.localeCompare(aString)
      })
    }

    setFilteredData(result)

    // Reset to first page when filtered data changes
    setCurrentPage(1)
  }, [normalizedData, searchQuery, sortConfig, columns, searchable])

  // Update paginated data when filtered data or current page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * pagination.pageSize
    setPaginatedData(filteredData.slice(startIndex, startIndex + pagination.pageSize))
  }, [filteredData, currentPage, pagination.pageSize])

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Handle sort
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc"
    }

    setSortConfig({ key, direction })
  }

  // Handle export
  const handleExport = () => {
    try {
      // Default CSV export
      const headers = columns.map((col) => col.header).join(",")
      const rows = filteredData
        .map((row) =>
          columns
            .map((col) => {
              const value = row[col.key]
              // Handle commas and quotes in CSV
              if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`
              }
              return value !== undefined && value !== null ? value : ""
            })
            .join(","),
        )
        .join("\n")

      const csv = `${headers}\n${rows}`

      // Create and download file
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `data-export-${format(new Date(), "yyyy-MM-dd")}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting data:", error)
      alert("Failed to export data. Please try again.")
    }
  }

  // Calculate page count
  const pageCount = Math.ceil(filteredData.length / pagination.pageSize)

  // Render empty state
  if (filteredData.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex items-center justify-center h-64">
          {emptyState || (
            <div className="text-center">
              <p className="text-muted-foreground">No data available</p>
              {!Array.isArray(data) && typeof data === "object" && Object.keys(data).length === 0 && (
                <p className="text-sm text-red-500 mt-2">
                  Warning: Data provided is an empty object instead of an array
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {title && <h3 className="text-lg font-medium">{title}</h3>}

        <div className="flex gap-2 ml-auto">
          {searchable && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          <Button variant="outline" size="sm" onClick={handleExport} className="h-10">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <UITable>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.sortable ? "cursor-pointer" : undefined}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="group">
                  {columns.map((column) => (
                    <TableCell key={`${rowIndex}-${column.key}`}>
                      {column.cell ? column.cell(row) : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </UITable>
      </div>

      {pageCount > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(currentPage * pagination.pageSize, filteredData.length)} of {filteredData.length} entries
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {currentPage} of {pageCount}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
