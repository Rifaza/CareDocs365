import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Search,
  Plus,
  FileText,
  Download,
  Eye,
  Upload,
  X,
  SlidersHorizontal
} from 'lucide-react'

import StatusBadge from '../components/StatusBadge'

import {
  getDocuments,
  createDocument,
  uploadDocumentFile,
} from '../services/documentService'

interface DocumentItem {
  id: number
  title: string
  category: string
  department: string
  createdBy: string
  createdAt: string
  status: string
}

const getStatusName = (status: number) => {
  const statuses: Record<number, string> = {
    1: 'Draft',
    2: 'Pending Approval',
    3: 'Approved',
    4: 'Rejected'
  }

  return statuses[status] ?? 'Draft'
}

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentItem[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [showUpload, setShowUpload] = useState(false)

// Add upload form state
  const [title, setTitle] = useState('')
    const [category, setCategory] = useState('Medical Report')
    const [description, setDescription] = useState('')
    const [departmentId, setDepartmentId] = useState(1)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState('')

    const refreshDocuments = async () => {
  const response = await getDocuments({ page: 1, pageSize: 10 })

  const mappedDocuments: DocumentItem[] = response.data.map((doc) => ({
    id: doc.id,
    title: doc.title,
    category: doc.category,
    department: doc.departmentName,
    createdBy: doc.createdByName,
    createdAt: new Date(doc.createdAt).toLocaleDateString(),
    status: getStatusName(doc.status),
  }))

  setDocuments(mappedDocuments)
}

useEffect(() => {
  const loadDocuments = async () => {
    try {
      setLoading(true)
      setError('')
      await refreshDocuments()
    } catch (err: unknown) {
      console.error('Failed to load documents:', err)

      if (axios.isAxiosError(err)) {
        setError(
          err.response
            ? `API Error: ${err.response.status}`
            : `Connection error: ${err.message}`
        )
      } else {
        setError('Unable to load documents.')
      }
    } finally {
      setLoading(false)
    }
  }

  loadDocuments()
}, [])
//   useEffect(() => {
//     const loadDocuments = async () => {
//         try {
//         setLoading(true)
//         setError('')

//         const response = await getDocuments()

//         const mappedDocuments: DocumentItem[] = response.data.map((doc) => ({
//             id: doc.id,
//             title: doc.title,
//             category: doc.category,
//             department: doc.departmentName,
//             createdBy: doc.createdByName,
//             createdAt: new Date(doc.createdAt).toLocaleDateString(),
//             status: getStatusName(doc.status)
//         }))

//         setDocuments(mappedDocuments)

//         } catch (err) {
//         console.error('Failed to load documents:', err)
//             console.error('Failed to load documents:', err)

//   if (axios.isAxiosError(err)) {
//     console.error('Request URL:', err.config?.baseURL, err.config?.url)
//     console.error('HTTP status:', err.response?.status)
//     console.error('Backend response:', err.response?.data)

//     if (err.response) {
//       setError(`API Error: ${err.response.status}`)
//     } else {
//       setError(`Connection error: ${err.message}`)
//     }
//   } else if (err instanceof Error) {
//     console.error('Application error:', err.message)
//     setError(err.message)
//   } else {
//     setError('An unexpected error occurred.')
//   }
//         } finally {
//         setLoading(false)
//         }
//     }

//     loadDocuments()
//     }, [])


  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.category.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'All' || doc.status === statusFilter

      const matchesDepartment =
        departmentFilter === 'All' ||
        doc.department === departmentFilter

      return matchesSearch && matchesStatus && matchesDepartment
    })
  }, [documents, search, statusFilter, departmentFilter])

const handleUpload = async () => {
  setUploadError('')

  if (!title.trim()) {
    setUploadError('Please enter a document title.')
    return
  }

  if (!departmentId) {
    setUploadError('Please select a department.')
    return
  }

  if (!selectedFile) {
    setUploadError('Please select a document file.')
    return
  }

  const allowedExtensions = ['pdf', 'docx', 'xlsx']
  const extension = selectedFile.name.split('.').pop()?.toLowerCase()

  if (!extension || !allowedExtensions.includes(extension)) {
    setUploadError('Only PDF, DOCX and XLSX files are allowed.')
    return
  }

  if (selectedFile.size > 10 * 1024 * 1024) {
    setUploadError('File size must not exceed 10 MB.')
    return
  }

  try {
    setIsUploading(true)

    // 1. Create the document record
    const createdDocument = await createDocument({
      title: title.trim(),
      category,
      description,
      departmentId,
      createdById: 1,
    })

    // 2. Upload the selected file
    await uploadDocumentFile(createdDocument.id, selectedFile)

    // 3. Refresh the document table
    await refreshDocuments()

    // 4. Reset and close the dialog
    setTitle('')
    setCategory('Medical Report')
    setDescription('')
    setDepartmentId(1)
    setSelectedFile(null)
    setShowUpload(false)

  } catch (err: unknown) {
    console.error('Document upload failed:', err)

    if (axios.isAxiosError(err)) {
      setUploadError(
        err.response?.data?.message ||
        err.response?.data?.title ||
        `Upload failed (${err.response?.status ?? 'Network error'}).`
      )
    } else if (err instanceof Error) {
      setUploadError(err.message)
    } else {
      setUploadError('Unable to upload document. Please try again.')
    }
  } finally {
    setIsUploading(false)
  }
}
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Document Library
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage, organize and track your healthcare documents.
          </p>
        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Upload Document
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Total documents</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {documents.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {documents.filter(d => d.status === 'Approved').length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Awaiting approval</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {documents.filter(d => d.status === 'Pending Approval').length}
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents by title or category..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="HR">HR</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All statuses</option>
              <option value="Draft">Draft</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </section>
    
{loading ? (
  <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
    <p className="text-sm text-slate-500">
      Loading documents...
    </p>
  </div>
) : error ? (
  <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
    <p className="text-sm text-red-600">{error}</p>

    <button
      onClick={() => window.location.reload()}
      className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
    >
      Retry
    </button>
  </div>
) : (
  <>
    {/* Document table */}
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="font-bold text-slate-900">All Documents</h3>
          <p className="mt-1 text-xs text-slate-500">
            {filteredDocuments.length} documents displayed
          </p>
        </div>
        <SlidersHorizontal size={19} className="text-slate-400" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4">Document</th>
              <th className="px-5 py-4">Department</th>
              <th className="px-5 py-4">Created By</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredDocuments.map((doc) => (
              <tr key={doc.id} className="transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                      <FileText size={19} />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        {doc.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {doc.category} · DOC-{String(doc.id).padStart(3, '0')}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {doc.department}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {doc.createdBy}
                </td>

                <td className="px-5 py-4 text-slate-500">
                  {doc.createdAt}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={doc.status} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      title="View document"
                      className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      title="Download document"
                      className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Download size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredDocuments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <FileText
                    className="mx-auto mb-3 text-slate-300"
                    size={32}
                  />
                  <p className="font-semibold text-slate-700">
                    No documents found
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or filters.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  </>
)}




      {/* Upload dialog */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Upload Document
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Select a document for the library.
                </p>
              </div>
              <button
                onClick={() => setShowUpload(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

        <div className="space-y-4 p-5">

        {/* Document title */}
        <label className="block text-sm font-medium text-slate-700">
            Document title

            <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
        </label>

        {/* Category */}
        <label className="block text-sm font-medium text-slate-700">
            Category

            <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
            <option value="Medical Report">Medical Report</option>
            <option value="Patient Record">Patient Record</option>
            <option value="Policy">Policy</option>
            <option value="HR Document">HR Document</option>
            </select>
        </label>

        {/* Department */}
        <label className="block text-sm font-medium text-slate-700">
            Department

            <select
            value={departmentId}
            onChange={(e) => setDepartmentId(Number(e.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
            <option value={1}>Cardiology</option>
            <option value={2}>HR</option>
            </select>
        </label>

        {/* Description */}
        <label className="block text-sm font-medium text-slate-700">
            Description

            <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter document description"
            rows={3}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
        </label>

        {/* File selection */}
        <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50/30">

            <Upload size={28} className="mb-3 text-blue-600" />

            <span className="text-sm font-semibold text-slate-700">
            {selectedFile?.name ?? 'Choose a document'}
            </span>

            <span className="mt-1 text-xs text-slate-400">
            PDF, DOCX or XLSX · Maximum 10 MB
            </span>

            <input
            type="file"
            accept=".pdf,.docx,.xlsx"
            className="hidden"
            onChange={(e) => {
                setSelectedFile(e.target.files?.[0] ?? null)
                setUploadError('')
            }}
            />
        </label>

        {/* Error message */}
        {uploadError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">
                {uploadError}
            </p>
            </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">

            <button
            type="button"
            disabled={isUploading}
            onClick={() => {
                setShowUpload(false)
                setUploadError('')
            }}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
            Cancel
            </button>

            <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
            {isUploading ? 'Uploading...' : 'Upload Document'}
            </button>

        </div>
        </div>
          </div>
        </div>
      )}
    </div>
  )
}
