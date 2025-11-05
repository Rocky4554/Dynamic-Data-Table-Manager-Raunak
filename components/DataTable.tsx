'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Button,
  IconButton,
  Alert,
  Typography,
  Tooltip,
  ThemeProvider,
  CssBaseline,
} from '@mui/material'
import {
  Delete,
  Edit,
  Save,
  Cancel,
  Upload,
  Download,
  Settings,
  Brightness4,
  Brightness7,
  Check,
  Close,
} from '@mui/icons-material'
import ManageColumnsModal from './ManageColumnsModal'
import DeleteConfirmDialog from './DeleteConfirmDialog'

// Import custom hooks
import { useTheme } from '../hooks/useTheme'
import { useTableData } from '../hooks/useTableData'
import { useTableEdit } from '../hooks/useTableEdit'
import { useCSVOperations } from '../hooks/useCSVOperations'
import { useTableActions } from '../hooks/useTableActions'

const DataTable: React.FC = () => {

  const { theme, darkMode, toggleTheme } = useTheme()


  const {
    data,
    visibleColumns,
     columns, 
    sortedData,
    paginatedData,
    page,
    rowsPerPage,
  } = useTableData()

  
  const {
    editingRows,
    modifiedRows,
    hasEditingRows,
    handleRowDoubleClick,
    handleFieldChange,
    handleSaveRow,
    handleCancelRow,
    handleSaveAll,
    handleCancelAll,
  } = useTableEdit(data)

 
  const {
    importError,
    importSuccess,
    setImportError,
    setImportSuccess,
    handleImportCSV,
    handleExportCSV,
  } = useCSVOperations()

  
  const {
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
  } = useTableActions({ key: null, direction: 'asc' })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
        
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white text-center">
                  Dynamic Data Table Manager
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Manage, edit, import and export your data with ease
                </p>
              </div>
               
            <Typography variant="body2" className="text-gray-900 dark:text-gray-400">
              💡 <strong>Tips:</strong> Double-click any row to edit inline • 
              Click column headers to sort • 
              Drag columns in "Manage Columns" to reorder • 
              Use the theme toggle for dark mode
            </Typography>
         
             <div className="flex justify-end">
              <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                <IconButton onClick={toggleTheme} color="primary" className="h-12 w-12">
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Tooltip>
            </div>
            </div>

          
            {importError && (
              <Alert severity="error" onClose={() => setImportError('')} className="mb-4">
                {importError}
              </Alert>
            )}
            {importSuccess && (
              <Alert severity="success" onClose={() => setImportSuccess('')} className="mb-4">
                {importSuccess}
              </Alert>
            )}
          </div>

        
          <Paper className="p-4 shadow-md">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <TextField
                placeholder="🔍 Search all fields..."
                variant="outlined"
                size="small"
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full lg:w-96"
              />

              <div className="flex flex-wrap gap-2">
                <Button variant="outlined" component="label" startIcon={<Upload />}>
                  Import CSV
                  <input type="file" hidden accept=".csv" onChange={handleImportCSV} />
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => handleExportCSV(sortedData, visibleColumns)}
                >
                  Export CSV
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Settings />}
                  onClick={() => setManageColumnsOpen(true)}
                >
                  Manage Columns
                </Button>
              </div>
            </div>

            {/* Saveand Cancel All */}
            {hasEditingRows && (
              <div className="mt-4 flex flex-col sm:flex-row gap-2 p-3 bg-blue-50 dark:bg-blue-900 rounded items-center">
                <Typography variant="body2" className="flex-1">
                  ⚠️ You have unsaved changes
                </Typography>
                <div className="flex gap-2">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    onClick={handleSaveAll}
                  >
                    Save All
                  </Button>
                  <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancelAll}>
                    Cancel All
                  </Button>
                </div>
              </div>
            )}
          </Paper>

               <TablePagination
              component="div"
              count={sortedData.length}
              page={page}
              onPageChange={(e, newPage) => handlePageChange(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => handleRowsPerPageChange(parseInt(e.target.value, 10))}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />

          {/* Table */}
          <TableContainer component={Paper} className="mb-4 shadow-lg overflow-x-auto">
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {visibleColumns.map(column => (
                    <TableCell
                      key={column.id}
                      className="font-bold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => handleSort(column.id)}
                    >
                      <div className="flex items-center gap-1">
                        {column.label}
                        <span className="text-sm font-bold">↕</span>
                      </div>
                    </TableCell>
                  ))}
                  <TableCell className="font-bold">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map(row => {
                  const isEditing = editingRows[row.id]
                  const displayRow = isEditing ? modifiedRows[row.id] : row

                  return (
                    <TableRow
                      key={row.id}
                      hover
                      onDoubleClick={() => !isEditing && handleRowDoubleClick(row.id)}
                      className={isEditing ? 'bg-yellow-50 dark:bg-yellow-900' : ''}
                    >
                      {visibleColumns.map(column => (
                        <TableCell key={column.id}>
                          {isEditing ? (
                            <TextField
                              size="small"
                              fullWidth
                              value={displayRow[column.id] || ''}
                              onChange={(e) => handleFieldChange(row.id, column.id, e.target.value)}
                              error={column.id === 'age' && displayRow[column.id] && isNaN(Number(displayRow[column.id]))}
                              helperText={
                                column.id === 'age' && displayRow[column.id] && isNaN(Number(displayRow[column.id]))
                                  ? 'Must be a number'
                                  : ''
                              }
                            />
                          ) : (
                            displayRow[column.id]
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-1">
                          {isEditing ? (
                            <>
                              <Tooltip title="Save">
                                <IconButton size="small" color="primary" onClick={() => handleSaveRow(row.id)}>
                                  <Check />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancel">
                                <IconButton size="small" onClick={() => handleCancelRow(row.id)}>
                                  <Close />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Tooltip title="Edit">
                                <IconButton size="small" color="primary" onClick={() => handleRowDoubleClick(row.id)}>
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" color="error" onClick={() => handleDeleteClick(row)}>
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

    
         
        </div>

        {/* Modals */}
        <ManageColumnsModal
          open={manageColumnsOpen}
          onClose={() => setManageColumnsOpen(false)}
          columns={columns} 
          onColumnsChange={handleColumnsChange}
          onAddColumn={handleAddColumn}
        />

        <DeleteConfirmDialog
          open={deleteDialog.open}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          itemName={deleteDialog.name}
        />
      </div>
    </ThemeProvider>
  )
}

export default DataTable;

