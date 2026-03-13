import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [qty, setQty]         = useState(50)
  const [adding, setAdding]   = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    productAPI.getById(id).then(r => {
      setProduct(r.data)
      setQty(r.data.minOrderQuantity)
    })
  }, [id])

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return }

    // ✅ Stock check BEFORE adding to cart
    if (product.stockQuantity <= 0) {
      toast.error(`${product.name} is out of stock!`)
      return
    }
    if (qty > product.stockQuantity) {
      toast.error(`Only ${product.stockQuantity} stems available!`)
      return
    }
    if (product.minOrderQuantity > product.stockQuantity) {
      toast.error(`Only ${product.stockQuantity} stems available. Min order is ${product.minOrderQuantity} stems.`)
      return
    }

    setAdding(true)
    try {
      await addToCart(product.id, qty)
      toast.success('Added to cart!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add')
    } finally { setAdding(false) }
  }

  if (!product) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '32px auto', padding: '0 24px' }}>
        <button className="btn btn-gray" onClick={() => navigate(-1)} style={{ marginBottom: 20, fontSize: 13 }}>← Back</button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div style={{ borderRadius: 10, overflow: 'hidden', height: 420 }}>
            <img src={product.imageUrl || 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=600'}
              alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => e.target.src = 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=600'} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 6 }}>{product.categoryName}</div>
            <h1 style={{ fontSize: 28, marginBottom: 8 }}>{product.name}</h1>
            <p style={{ color: 'var(--text3)', marginBottom: 20, lineHeight: 1.6 }}>{product.description}</p>

            {/* ✅ Out of stock banner */}
            {product.stockQuantity <= 0 && (
              <div style={{ background: '#fff3f3', border: '1.5px solid #ffb3b3', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#c0392b', fontWeight: 600, fontSize: 14 }}>
                ❌ Out of Stock
              </div>
            )}

            <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 8, padding: 20, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#b12704' }}>₹{product.pricePerStem}</span>
                <span style={{ color: 'var(--text3)' }}>/stem</span>
              </div>
              <label className="form-label">Quantity (min {product.minOrderQuantity})</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <button className="btn btn-outline" style={{ padding: '6px 14px' }}
                  onClick={() => setQty(q => Math.max(product.minOrderQuantity, q - 10))}>−</button>
                <input type="number" className="form-input" style={{ width: 90, textAlign: 'center' }}
                  value={qty} min={product.minOrderQuantity}
                  onChange={e => setQty(Math.max(product.minOrderQuantity, Number(e.target.value)))} />
                <button className="btn btn-outline" style={{ padding: '6px 14px' }}
                  onClick={() => setQty(q => q + 10)}>+</button>
              </div>
              <button
                className="btn btn-primary btn-full btn-lg"
                onClick={handleAdd}
                disabled={adding || product.stockQuantity <= 0}
                style={product.stockQuantity <= 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
              >
                {adding ? 'Adding...' : product.stockQuantity <= 0 ? '❌ Out of Stock' : '🛒 Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}