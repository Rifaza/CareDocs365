
import { useState } from 'react'

import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Documents from './pages/Documents'

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />

      case 'Documents':
        return <Documents />

      default:
        return (
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="text-xl font-bold text-slate-900">
              {activePage}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              This module is under development.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="min-h-screen md:ml-64">
        <Header
          title={activePage}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-5 md:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
