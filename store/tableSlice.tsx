import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TableState, TableRow, Column, SortConfig } from '@/types'

// Initial sample data
const initialData: TableRow[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer', department: 'Engineering', location: 'New York' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 34, role: 'Designer', department: 'Design', location: 'San Francisco' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 45, role: 'Manager', department: 'Operations', location: 'Chicago' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', age: 29, role: 'Developer', department: 'Engineering', location: 'Austin' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', age: 52, role: 'Director', department: 'Leadership', location: 'Boston' },
  { id: 6, name: 'Diana Prince', email: 'diana@example.com', age: 31, role: 'Developer', department: 'Engineering', location: 'Seattle' },
  { id: 7, name: 'Ethan Hunt', email: 'ethan@example.com', age: 38, role: 'Analyst', department: 'Analytics', location: 'Denver' },
  { id: 8, name: 'Fiona Apple', email: 'fiona@example.com', age: 27, role: 'Designer', department: 'Design', location: 'Portland' },
  { id: 9, name: 'George Martin', email: 'george@example.com', age: 41, role: 'Manager', department: 'Operations', location: 'Miami' },
  { id: 10, name: 'Hannah Montana', email: 'hannah@example.com', age: 25, role: 'Developer', department: 'Engineering', location: 'Nashville' },
  { id: 11, name: 'Ivan Drago', email: 'ivan@example.com', age: 36, role: 'Engineer', department: 'Engineering', location: 'Moscow' },
  { id: 12, name: 'Julia Roberts', email: 'julia@example.com', age: 43, role: 'Manager', department: 'HR', location: 'Los Angeles' },
]

// Default column configuration
const defaultColumns: Column[] = [
  { id: 'name', label: 'Name', visible: true, order: 0 },
  { id: 'email', label: 'Email', visible: true, order: 1 },
  { id: 'age', label: 'Age', visible: true, order: 2 },
  { id: 'role', label: 'Role', visible: true, order: 3 },
  { id: 'department', label: 'Department', visible: false, order: 4 },
  { id: 'location', label: 'Location', visible: false, order: 5 },
]

// Load columns from localStorage if available
const loadColumnsFromStorage = (): Column[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tableColumns')
    if (saved) {
      try {
        return JSON.parse(saved) as Column[]
      } catch (e) {
        return defaultColumns
      }
    }
  }
  return defaultColumns
}

const initialState: TableState = {
  data: initialData,
  columns: loadColumnsFromStorage(),
  searchQuery: '',
  sortConfig: { key: null, direction: 'asc' },
  page: 0,
  rowsPerPage: 10,
}

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<TableRow[]>) => {
      state.data = action.payload
    },
    addRows: (state, action: PayloadAction<TableRow[]>) => {
      state.data = [...state.data, ...action.payload]
    },
    updateRow: (state, action: PayloadAction<TableRow>) => {
      const index = state.data.findIndex(row => row.id === action.payload.id)
      if (index !== -1) {
        state.data[index] = action.payload
      }
    },
    deleteRow: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter(row => row.id !== action.payload)
    },
    setColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('tableColumns', JSON.stringify(action.payload))
      }
    },
    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns.push(action.payload)
      state.data = state.data.map(row => ({ ...row, [action.payload.id]: '' }))
      if (typeof window !== 'undefined') {
        localStorage.setItem('tableColumns', JSON.stringify(state.columns))
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.page = 0
    },
    setSortConfig: (state, action: PayloadAction<SortConfig>) => {
      state.sortConfig = action.payload
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload
      state.page = 0
    },
  },
})

export const {
  setData,
  addRows,
  updateRow,
  deleteRow,
  setColumns,
  addColumn,
  setSearchQuery,
  setSortConfig,
  setPage,
  setRowsPerPage,
} = tableSlice.actions

export default tableSlice.reducer