import { useState, ChangeEvent } from 'react'
import { useAppDispatch } from '../store/hook'
import { addRows } from '../store/tableSlice'
import Papa from 'papaparse'
import { TableRow, Column } from '@/types'

export const useCSVOperations = () => {
  const dispatch = useAppDispatch()
  const [importError, setImportError] = useState<string>('')
  const [importSuccess, setImportSuccess] = useState<string>('')

  const handleImportCSV = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (!file) return

    setImportError('')
    setImportSuccess('')

    Papa.parse<TableRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setImportError(`CSV errors: ${results.errors.map(e => e.message).join(', ')}`)
          return
        }

        const requiredFields = ['name', 'email']
        const hasRequired = results.data.every(row =>
          requiredFields.every(field => field in row)
        )

        if (!hasRequired) {
          setImportError('CSV must contain "name" and "email" columns')
          return
        }

        const newData: TableRow[] = results.data.map((row, index) => ({
          id: Date.now() + index,
          ...row,
          age: row.age ? parseInt(String(row.age)) : undefined
        }))

        dispatch(addRows(newData))
        setImportSuccess(`✓ Imported ${newData.length} rows successfully`)
        setTimeout(() => setImportSuccess(''), 3000)
      },
      error: (error) => {
        setImportError(`Error: ${error.message}`)
      }
    })

    event.target.value = ''
  }

  const handleExportCSV = (sortedData: TableRow[], visibleColumns: Column[]): void => {
    const visibleColumnIds = visibleColumns.map(col => col.id)
    const exportData = sortedData.map(row => {
      const filtered: any = {}
      visibleColumnIds.forEach(colId => {
        filtered[colId] = row[colId]
      })
      return filtered
    })

    const csv = Papa.unparse(exportData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `table-export-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return {
    importError,
    importSuccess,
    setImportError,
    setImportSuccess,
    handleImportCSV,
    handleExportCSV,
  }
}