import { useState } from 'react'
import { useAppDispatch } from '../store/hook'
import { updateRow } from '../store/tableSlice'
import { 
  TableRow, 
  EditingRowsState, 
  ModifiedRowsState 
} from '@/types'

export const useTableEdit = (data: TableRow[]) => {
  const dispatch = useAppDispatch()
  const [editingRows, setEditingRows] = useState<EditingRowsState>({})
  const [modifiedRows, setModifiedRows] = useState<ModifiedRowsState>({})


  const handleRowDoubleClick = (rowId: number): void => {
    const row = data.find(r => r.id === rowId)
    if (row) {
      setEditingRows(prev => ({ ...prev, [rowId]: true }))
      setModifiedRows(prev => ({ ...prev, [rowId]: { ...row } }))
    }
  }


  const handleFieldChange = (rowId: number, field: string, value: string): void => {
    setModifiedRows(prev => ({
      ...prev,
      [rowId]: { ...prev[rowId], [field]: value }
    }))
  }


  const validateRow = (row: TableRow): string | null => {
    if (row.age && isNaN(Number(row.age))) {
      return 'Age must be a number'
    }
    if (row.email && !row.email.includes('@')) {
      return 'Please enter a valid email'
    }
    return null
  }


  const handleSaveRow = (rowId: number): void => {
    const modifiedRow = modifiedRows[rowId]
    const error = validateRow(modifiedRow)
    
    if (error) {
      alert(error)
      return
    }

    dispatch(updateRow(modifiedRow))
    setEditingRows(prev => ({ ...prev, [rowId]: false }))
    const newModified = { ...modifiedRows }
    delete newModified[rowId]
    setModifiedRows(newModified)
  }


  const handleCancelRow = (rowId: number): void => {
    setEditingRows(prev => ({ ...prev, [rowId]: false }))
    const newModified = { ...modifiedRows }
    delete newModified[rowId]
    setModifiedRows(newModified)
  }

  const handleSaveAll = (): void => {
    // Validate all modified rows
    for (const [rowId, modifiedRow] of Object.entries(modifiedRows)) {
      const error = validateRow(modifiedRow)
      if (error) {
        alert(`Row ${rowId}: ${error}`)
        return
      }
    }


    Object.values(modifiedRows).forEach(row => {
      dispatch(updateRow(row))
    })
    setEditingRows({})
    setModifiedRows({})
  }

  const handleCancelAll = (): void => {
    setEditingRows({})
    setModifiedRows({})
  }

  const hasEditingRows = Object.keys(editingRows).some(key => editingRows[Number(key)])

  return {
    editingRows,
    modifiedRows,
    hasEditingRows,
    handleRowDoubleClick,
    handleFieldChange,
    handleSaveRow,
    handleCancelRow,
    handleSaveAll,
    handleCancelAll,
  }
}