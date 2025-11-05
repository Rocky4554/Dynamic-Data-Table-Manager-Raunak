import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  IconButton,
  Chip,
} from '@mui/material'
import { Settings, Close, DragIndicator } from '@mui/icons-material'
import { ManageColumnsModalProps, Column } from '@/types'

const ManageColumnsModal: React.FC<ManageColumnsModalProps> = ({
  open,
  onClose,
  columns,
  onColumnsChange,
  onAddColumn
}) => {
  const [newColumnName, setNewColumnName] = useState<string>('')

  const handleToggleColumn = (columnId: string): void => {
    const updated = columns.map(col =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    )
    onColumnsChange(updated)
  }

  const handleAddColumn = (): void => {
    if (newColumnName.trim()) {
      const columnId = newColumnName.toLowerCase().replace(/\s+/g, '_')
      const newColumn: Column = {
        id: columnId,
        label: newColumnName,
        visible: true,
        order: columns.length
      }
      onAddColumn(newColumn)
      setNewColumnName('')
    }
  }

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (index: number): void => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault() 
  }

  const handleDrop = (dropIndex: number): void => {
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const updatedColumns = [...columns]
    const [draggedColumn] = updatedColumns.splice(draggedIndex, 1)
    updatedColumns.splice(dropIndex, 0, draggedColumn)

    const reorderedColumns = updatedColumns.map((col, index) => ({
      ...col,
      order: index
    }))

    onColumnsChange(reorderedColumns)
    setDraggedIndex(null)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Settings /> Manage Columns
        </span>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-2">
          <div className="border-b pb-4">
            <Typography variant="subtitle2" className="mb-2 font-semibold">
              Add New Column
            </Typography>
            <div className="flex gap-2">
              <TextField
                size="small"
                fullWidth
                placeholder="Column name (e.g., Department)"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddColumn()}
              />
              <Button variant="contained" onClick={handleAddColumn}>
                Add
              </Button>
            </div>
          </div>

          <div>
            <Typography variant="subtitle2" className="mb-2 font-semibold">
              Show/Hide & Reorder Columns
            </Typography>
            <Typography variant="caption" className="text-gray-500 mb-2 block">
              💡 Drag columns to reorder them
            </Typography>
            <div className="space-y-1">
              {columns.map((column, index) => (
                <div
                  key={column.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  className={`
                    flex items-center gap-2 p-3 border rounded 
                    cursor-move hover:bg-gray-50 transition-all
                    ${draggedIndex === index ? 'opacity-50 bg-blue-50' : ''}
                  `}
                >
                  <DragIndicator className="text-gray-400" />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={column.visible}
                        onChange={() => handleToggleColumn(column.id)}
                      />
                    }
                    label={column.label}
                    className="flex-1 m-0"
                  />
                  <Chip 
                    label={`#${column.order + 1}`} 
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ManageColumnsModal