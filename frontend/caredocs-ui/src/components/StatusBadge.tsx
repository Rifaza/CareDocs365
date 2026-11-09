
interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    Approved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    Rejected: 'bg-red-50 text-red-700 ring-red-600/20',
    Draft: 'bg-slate-100 text-slate-600 ring-slate-500/20',
    'Pending Approval': 'bg-amber-50 text-amber-700 ring-amber-600/20'
  }

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
      styles[status] ?? styles.Draft
    }`}>
      {status}
    </span>
  )
}
