import { useMemo } from 'react'
import { useAppSelector } from '../store/hook'

export const useTableData = () => {
  const { data, columns, searchQuery, sortConfig, page, rowsPerPage } = useAppSelector(
    state => state.table
  )

  // ✅ Filter only visible columns for display
  const visibleColumns = useMemo(() => {
    return columns.filter(col => col.visible).sort((a, b) => a.order - b.order)
  }, [columns])

  const filteredData = useMemo(() => {
    if (!searchQuery) return data
    return data.filter(row => {
      return Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [data, searchQuery])

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key!]
      const bValue = b[sortConfig.key!]
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
    return sorted
  }, [filteredData, sortConfig])

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage
    return sortedData.slice(start, start + rowsPerPage)
  }, [sortedData, page, rowsPerPage])

  return {
    data,
    columns,         
    visibleColumns,
    filteredData,
    sortedData,
    paginatedData,
    page,
    rowsPerPage,
  }
}
