
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight
} from 'lucide-react'

import StatCard from '../components/StatCard'

const recentDocuments = [
  {
    id: 'DOC-001',
    title: 'Patient Discharge Report',
    department: 'Cardiology',
    date: '30 Oct 2026',
    status: 'Approved'
  },
  {
    id: 'DOC-002',
    title: 'Medical Assessment Report',
    department: 'Cardiology',
    date: '29 Oct 2026',
    status: 'Pending Approval'
  },
  {
    id: 'DOC-003',
    title: 'Employee Policy Document',
    department: 'HR',
    date: '28 Oct 2026',
    status: 'Draft'
  },
  {
    id: 'DOC-004',
    title: 'Clinical Review Report',
    department: 'Cardiology',
    date: '27 Oct 2026',
    status: 'Rejected'
  }
]

function getStatusStyle(status: string) {
  switch (status) {
    case 'Approved':
      return 'bg-green-50 text-green-700'
    case 'Pending Approval':
      return 'bg-amber-50 text-amber-700'
    case 'Rejected':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back, Demo Employee
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening with your documents today.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Documents"
          value={128}
          description="Documents in the system"
          icon={FileText}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Pending Approval"
          value={12}
          description="Awaiting manager review"
          icon={Clock}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Approved"
          value={96}
          description="Successfully approved"
          icon={CheckCircle}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          title="Rejected"
          value={8}
          description="Require further attention"
          icon={XCircle}
          color="bg-red-50 text-red-600"
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h3 className="font-bold text-slate-900">Recent Documents</h3>
            <p className="mt-1 text-xs text-slate-500">
              Latest document activity
            </p>
          </div>
          <button className="flex items-center gap-1 text-sm font-semibold text-blue-600">
            View all <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Document</th>
                <th className="px-5 py-4">Department</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{doc.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{doc.id}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {doc.department}
                  </td>
                  <td className="px-5 py-4 text-slate-500">{doc.date}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
