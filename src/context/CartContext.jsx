import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartAPI } from '../services/api'
import { useAuth } from './AuthContext'

const Ctx = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState([])

  const fetchCart = useCallback(async () => {
    if (!user) { setCart([]); return }
    const { data } = await cartAPI.get()
    setCart(data)
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart  = async (pid, qty) => { await cartAPI.add(pid, qty);   await fetchCart() }
  const updateQty  = async (id, qty)  => { await cartAPI.update(id, qty); await fetchCart() }
  const removeItem = async id         => { await cartAPI.remove(id);       await fetchCart() }

  const subtotal  = cart.reduce((s, i) => s + Number(i.lineTotal), 0)
  const gst       = subtotal * 0.18
  const total     = subtotal + gst
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <Ctx.Provider value={{
      cart, addToCart, updateQty, removeItem,
      fetchCart, subtotal, gst, total, itemCount
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useCart = () => useContext(Ctx)