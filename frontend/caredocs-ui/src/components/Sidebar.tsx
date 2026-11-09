
import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  History,
  Settings,
  HeartPulse,
  ChevronRight,
  X,
  LogOut
} from 'lucide-react'

interface SidebarProps {
  activePage: string
  setActivePage: (page: string) => void
  open: boolean
  onClose: () => void
}

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Documents', icon: FileText },
  { name: 'Approvals', icon: ClipboardCheck, count: 12 },
  { name: 'Audit Logs', icon: History }
]

export default function Sidebar({
  activePage,
  setActivePage,
  open,
  onClose
}: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col
      border-r border-slate-800 bg-slate-950 text-slate-300
      transition-transform duration-200
      ${open ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0`}
    >
      {/* Brand */}
      <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-2.5 text-white shadow-lg shadow-blue-900/30">
            <HeartPulse size={23} strokeWidth={2.2} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              CareDocs <span className="text-blue-400">365</span>
            </h1>
            <p className="text-[11px] tracking-wide text-slate-400">
              HEALTHCARE WORKSPACE
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 md:hidden"
        >
          <X size={19} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-7">
        <div>
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>

          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = activePage === item.name

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActivePage(item.name)
                    onClose()
                  }}
                  className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {active && (
                    <span className="absolute -left-3 h-7 w-1 rounded-r-full bg-blue-400" />
                  )}

                  <Icon
                    size={19}
                    strokeWidth={active ? 2.3 : 1.8}
                  />

                  <span className="flex-1 text-left font-medium">
                    {item.name}
                  </span>

                  {item.count && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-400/15 text-amber-300'
                    }`}>
                      {item.count}
                    </span>
                  )}

                  {active && <ChevronRight size={15} />}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Administration
          </p>

          <button
            onClick={() => {
              setActivePage('Settings')
              onClose()
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
              activePage === 'Settings'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings size={19} />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </nav>

      {/* Workspace info and profile */}
      <div className="space-y-4 border-t border-slate-800 p-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <p className="text-xs font-semibold text-slate-200">
              Demo Workspace
            </p>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Healthcare department
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-300">
            DE
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              Demo Employee
            </p>
            <p className="text-xs text-slate-500">Employee account</p>
          </div>

          <button
            title="Sign out (demo)"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  )
}
