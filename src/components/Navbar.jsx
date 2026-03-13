import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { ShoppingCart, LogOut, Settings } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav style={{
      background: 'var(--green)', color: '#fff',
      padding: '0 24px', height: 60,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,.2)'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 24 }}>🌸</span>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Blooms</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {user ? (
          <>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,.8)', marginRight: 4 }}>
              Hi, {user.name.split(' ')[0]}
            </span>
            {isAdmin && (
              <Link to="/admin">
                <button className="btn" style={{ background: 'var(--gold)', color: '#111', padding: '6px 14px', fontSize: 13 }}>
                  <Settings size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  Admin
                </button>
              </Link>
            )}
            {!isAdmin && (
              <>
                <Link to="/orders">
                  <button className="btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', padding: '6px 14px', fontSize: 13 }}>
                    My Orders
                  </button>
                </Link>
                <Link to="/cart" style={{ position: 'relative' }}>
                  <button className="btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', padding: '6px 14px', fontSize: 13 }}>
                    <ShoppingCart size={16} style={{ verticalAlign: 'middle' }} />
                    {itemCount > 0 && (
                      <span style={{
                        position: 'absolute', top: -6, right: -6,
                        background: 'var(--gold)', color: '#111',
                        borderRadius: '50%', width: 20, height: 20,
                        fontSize: 11, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>{itemCount}</span>
                    )}
                  </button>
                </Link>
              </>
            )}
            <button className="btn" onClick={handleLogout}
              style={{ background: 'rgba(255,100,100,.25)', color: '#fff', padding: '6px 12px', fontSize: 13 }}>
              <LogOut size={14} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', padding: '6px 16px', fontSize: 13 }}>
                Sign In
              </button>
            </Link>
            <Link to="/register">
              <button className="btn btn-gold" style={{ padding: '6px 16px', fontSize: 13 }}>
                Register
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}