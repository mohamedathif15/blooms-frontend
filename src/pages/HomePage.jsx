import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'
import { Search, ShoppingCart } from 'lucide-react'

export default function HomePage() {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [activeCat, setActiveCat]   = useState(null)
  const [adding, setAdding]         = useState(null)
  const { addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    productAPI.getCategories().then(r => setCategories(r.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    productAPI.getAll({ search: search || undefined, categoryId: activeCat || undefined })
      .then(r => setProducts(r.data))
      .finally(() => setLoading(false))
  }, [search, activeCat])

 const handleAdd = async (e, product) => {
  e.preventDefault()
  if (!user) { window.location.href = '/login'; return }
  if (product.stockQuantity <= 0) {
    toast.error(`${product.name} is out of stock!`)
    return
  }
  if (product.minOrderQuantity > product.stockQuantity) {
    toast.error(`Only ${product.stockQuantity} stems available. Min order is ${product.minOrderQuantity} stems.`)
    return
  }
  setAdding(product.id)
  try {
    await addToCart(product.id, product.minOrderQuantity)
    toast.success(`${product.name} added to cart! 🛒`)
  } catch (err) {
    toast.error(err.response?.data?.error || 'Failed to add to cart')
  } finally { setAdding(null) }
}

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: 'var(--green)', color: '#fff', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🌸</div>
        <h1 style={{ fontSize: 36, marginBottom: 8 }}>Blooms Wholesale</h1>
        <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 16, marginBottom: 28 }}>
          Premium B2B flowers — direct from farm to your business
        </p>
        <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
          <input
            style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 8, border: 'none', fontSize: 15, outline: 'none' }}
            placeholder="Search roses, lilies, orchids..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ padding: '20px 24px 0', display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 1200, margin: '0 auto' }}>
        <button onClick={() => setActiveCat(null)} className="btn"
          style={{ background: activeCat === null ? 'var(--green)' : '#fff', color: activeCat === null ? '#fff' : 'var(--text)', border: '1.5px solid var(--border)', padding: '6px 18px', fontSize: 13 }}>
          All Flowers
        </button>
        {categories.map(c => (
          <button key={c.id} onClick={() => setActiveCat(activeCat === c.id ? null : c.id)} className="btn"
            style={{ background: activeCat === c.id ? 'var(--green)' : '#fff', color: activeCat === c.id ? '#fff' : 'var(--text)', border: '1.5px solid var(--border)', padding: '6px 18px', fontSize: 13 }}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text3)' }}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <p style={{ marginTop: 12, fontSize: 16 }}>No flowers found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {products.map(p => (
              <Link to={`/products/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
                <div className="card card-hover" style={{ overflow: 'hidden' }}>
                  <div style={{ height: 200, overflow: 'hidden', background: '#f0ede6', position: 'relative' }}>
                    <img src={p.imageUrl || 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=400'}
                      alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => e.target.src = 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=400'} />
                    {p.isFeatured && (
                      <span style={{ position: 'absolute', top: 10, left: 10, background: '#e8491a', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
                        ⭐ BESTSELLER
                      </span>
                    )}
                  </div>
                  <div style={{ padding: 14 }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 4 }}>{p.categoryName}</div>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>{p.color} · {p.originCountry}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                      <span style={{ fontSize: 22, fontWeight: 700, color: '#b12704' }}>₹{p.pricePerStem}</span>
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>/stem</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 12 }}>
                      Min {p.minOrderQuantity} stems
                    </div>
                    <button className="btn btn-primary btn-full" disabled={adding === p.id}
                      onClick={e => handleAdd(e, p)} style={{ fontSize: 13 }}>
                      <ShoppingCart size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                      {adding === p.id ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}