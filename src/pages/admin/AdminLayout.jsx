import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, LogOut, Home } from 'lucide-react'

const NAV = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products',   icon: Package,         label: 'Products' },
  { to: '/admin/orders',     icon: ShoppingBag,     label: 'Orders' },
  { to: '/admin/users',      icon: Users,           label: 'Buyers' },
  { to: '/admin/categories', icon: Tag,             label: 'Categories' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 230, background: 'var(--green)', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,.15)' }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>🌸 Blooms</div>
          <div style={{ fontSize: 11, background: 'var(--gold)', color: '#111', padding: '2px 8px', borderRadius: 4, display: 'inline-block', marginTop: 6, fontWeight: 700 }}>ADMIN PANEL</div>
        </div>
        <nav style={{ padding: '10px 0', flex: 1 }}>
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 20px', textDecoration: 'none',
              fontSize: 14, fontWeight: isActive ? 700 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,.75)',
              background: isActive ? 'rgba(255,255,255,.15)' : 'transparent',
              borderLeft: `3px solid ${isActive ? 'var(--gold)' : 'transparent'}`,
            })}>
              <Icon size={16} />{label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,.15)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', marginBottom: 12 }}>{user?.email}</div>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff', padding: '7px 12px', borderRadius: 5, cursor: 'pointer', fontSize: 12, marginBottom: 6, width: '100%' }}>
            <Home size={13} />View Store
          </button>
          <button onClick={() => { logout(); navigate('/login') }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,80,80,.25)', border: 'none', color: '#fff', padding: '7px 12px', borderRadius: 5, cursor: 'pointer', fontSize: 12, width: '100%' }}>
            <LogOut size={13} />Sign Out
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, background: '#f0f2f5', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}