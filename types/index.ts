
// Row data structure
export interface TableRow {
  id: number
  name: string
  email: string
  age?: number
  role?: string
  department?: string
  location?: string
  [key: string]: any // Allow dynamic properties
}

// Column configuration
export interface Column {
  id: string
  label: string
  visible: boolean
  order: number
}

// Sort configuration
export interface SortConfig {
  key: string | null
  direction: 'asc' | 'desc'
}

// Redux table state
export interface TableState {
  data: TableRow[]
  columns: Column[]
  searchQuery: string
  sortConfig: SortConfig
  page: number
  rowsPerPage: number
}

// Delete dialog state
export interface DeleteDialogState {
  open: boolean
  id: number | null
  name: string
}

// Editing rows state (key is row id, value is boolean)
export interface EditingRowsState {
  [key: number]: boolean
}

// Modified rows state (key is row id, value is the modified row)
export interface ModifiedRowsState {
  [key: number]: TableRow
}

// CSV validation result
export interface CSVValidationResult {
  valid: boolean
  errors: string[]
}

// Component Props Types
export interface DeleteConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
}

export interface ManageColumnsModalProps {
  open: boolean
  onClose: () => void
  columns: Column[]
  onColumnsChange: (columns: Column[]) => void
  onAddColumn: (column: Column) => void
}

// Theme mode type
export type ThemeMode = 'light' | 'dark'