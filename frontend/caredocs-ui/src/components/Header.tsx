
import { Bell, Search, Menu } from 'lucide-react'

interface HeaderProps {
  title: string
  onMenuClick: () => void
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
      <div className="flex items-center gap-3">
        <button className="md:hidden" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="hidden text-xs text-slate-500 sm:block">
            Manage healthcare documents and workflows
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <Search size={20} />
        </button>
        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={20} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
            DE
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold">Demo Employee</p>
            <p className="text-xs text-slate-500">Employee</p>
          </div>
        </div>
      </div>
    </header>
  )
}
