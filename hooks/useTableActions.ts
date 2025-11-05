import { useState } from 'react'
import { useAppDispatch } from '../store/hook'
import { 
  setSortConfig, 
  setPage, 
  setRowsPerPage, 
  setSearchQuery,
  setColumns,
  addColumn,
  deleteRow 
} from '../store/tableSlice'
import { DeleteDialogState, Column, TableRow } from '../types/index'

export const useTableActions = (sortConfig: any) => {
  const dispatch = useAppDispatch()
  const [manageColumnsOpen, setManageColumnsOpen] = useState<boolean>(false)
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    id: null,
    name: ''
  })


  const handleSort = (columnId: string): void => {
    dispatch(setSortConfig({
      key: columnId,
      direction: sortConfig.key === columnId && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    }))
  }


  const handleSearch = (query: string): void => {
    dispatch(setSearchQuery(query))
  }


  const handlePageChange = (newPage: number): void => {
    dispatch(setPage(newPage))
  }

  const handleRowsPerPageChange = (value: number): void => {
    dispatch(setRowsPerPage(value))
  }


  const handleColumnsChange = (newColumns: Column[]): void => {
    dispatch(setColumns(newColumns))
  }

  const handleAddColumn = (newColumn: Column): void => {
    dispatch(addColumn(newColumn))
  }

  const handleDeleteClick = (row: TableRow): void => {
    setDeleteDialog({ open: true, id: row.id, name: row.name })
  }

  const handleDeleteConfirm = (): void => {
    if (deleteDialog.id !== null) {
      dispatch(deleteRow(deleteDialog.id))
      setDeleteDialog({ open: false, id: null, name: '' })
    }
  }

  const handleDeleteCancel = (): void => {
    setDeleteDialog({ open: false, id: null, name: '' })
  }

  return {
    manageColumnsOpen,
    setManageColumnsOpen,
    deleteDialog,
    handleSort,
    handleSearch,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnsChange,
    handleAddColumn,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
  }
}