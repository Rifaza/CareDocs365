
export type DocumentStatus = 1 | 2 | 3 | 4


export interface DocumentItem {
  id: number
  title: string
  category: string
  department: string
  createdBy: string
  createdAt: string
  status: string
}

export interface Department {
  id: number
  name: string
  description?: string
}

export interface CreateDocumentRequest {
  title: string
  category: string
  description: string
  departmentId: number
  createdById: number
}

export interface DashboardSummary {
  totalDocuments: number
  draftDocuments: number
  pendingApprovals: number
  approvedDocuments: number
  rejectedDocuments: number
}
