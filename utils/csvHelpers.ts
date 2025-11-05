import Papa from 'papaparse'
import { TableRow, CSVValidationResult } from '../types/index'

export const validateCSVData = (
  data: any[],
  requiredFields: string[] = ['name', 'email']
): CSVValidationResult => {
  const errors: string[] = []

  if (!data || !Array.isArray(data) || data.length === 0) {
    errors.push('CSV file is empty or invalid')
    return { valid: false, errors }
  }

  const firstRow = data[0]
  const missingFields = requiredFields.filter(field => !(field in firstRow))

  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`)
  }

  data.forEach((row, index) => {
    if (row.email && !isValidEmail(row.email)) {
      errors.push(`Row ${index + 1}: Invalid email format - ${row.email}`)
    }
    if (row.age && isNaN(row.age)) {
      errors.push(`Row ${index + 1}: Age must be a number - ${row.age}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}


export const parseCSVFile = <T = any>(
  file: File,
  options: Papa.ParseConfig<T> = {}
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<T>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      ...options,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(results.errors)
        } else {
          resolve(results.data)
        }
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}

export const exportToCSV = (data: any[], filename: string = 'export.csv'): void => {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export const filterObjectKeys = <T extends Record<string, any>>(
  obj: T,
  keys: string[]
): Partial<T> => {
  return keys.reduce((acc, key) => {
    if (key in obj) {
      acc[key] = obj[key]
    }
    return acc
  }, {} as any)
}

export const prepareExportData = (
  data: TableRow[],
  visibleColumns: string[]
): Partial<TableRow>[] => {
  return data.map(row => filterObjectKeys(row, visibleColumns))
}