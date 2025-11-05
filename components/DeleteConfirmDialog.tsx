import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'
import { Delete, Close, Error as ErrorIcon } from '@mui/icons-material'
import { DeleteConfirmDialogProps } from '@/types'

const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  itemName,
}: DeleteConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="flex items-center gap-2">
        <ErrorIcon className="text-red-500" />
        Confirm Delete
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{itemName}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<Close />}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          startIcon={<Delete />}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmDialog;
