
import api from './api'

import type {
  DocumentItem,
  Department,
  CreateDocumentRequest
} from '../types'

export interface DocumentFilters {
  search?: string
  category?: string
  departmentId?: number
  status?: number
  page?: number
  pageSize?: number
}

// Matches the backend DocumentResponseDto
export interface DocumentApiDto {
  id: number
  title: string
  category: string
  description: string
  departmentName: string
  createdByName: string
  status: number
  createdAt: string
}
export interface DocumentListResponse {
  totalRecords: number
  page: number
  pageSize: number
  totalPages: number
  data: DocumentApiDto[]
}

export const getDocuments = async (
  filters: DocumentFilters = {}
): Promise<DocumentListResponse> => {
  const response = await api.get<DocumentListResponse>('/Documents', {
    params: filters
  })

  return response.data
}

export const getDocumentById = async (
  id: number
): Promise<DocumentItem> => {
  const response = await api.get(`/documents/${id}`)
  return response.data
}

export const createDocument = async (
  data: CreateDocumentRequest
): Promise<DocumentItem> => {
  const response = await api.post('/documents', data)
  return response.data
}

export const updateDocument = async (
  id: number,
  data: Partial<CreateDocumentRequest>
) => {
  const response = await api.put(`/documents/${id}`, data)
  return response.data
}

export const deleteDocument = async (id: number) => {
  const response = await api.delete(`/documents/${id}`)
  return response.data
}

export const uploadDocumentFile = async (
  documentId: number,
  file: File
) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post(
    `/documents/${documentId}/upload`,
    formData
  )

  return response.data
}

export const downloadDocumentFile = async (
  documentId: number
) => {
  const response = await api.get(
    `/documents/${documentId}/file`,
    { responseType: 'blob' }
  )

  return response.data
}

export const getDepartments = async (): Promise<Department[]> => {
  const response = await api.get('/departments')
  return response.data
}
