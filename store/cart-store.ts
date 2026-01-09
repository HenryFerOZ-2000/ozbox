import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  name: string
  slug: string
  price: number
  salePrice?: number
  image: string
  quantity: number
  stock: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity) => {
        const items = get().items
        const existingItem = items.find((i) => i.id === item.id)

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) }
                : i
            ),
          })
        } else {
          set({
            items: [...items, { ...item, quantity: Math.min(quantity, item.stock) }],
          })
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },
      updateQuantity: (id, quantity) => {
        const item = get().items.find((i) => i.id === id)
        if (!item) return

        const newQuantity = Math.max(0, Math.min(quantity, item.stock))
        if (newQuantity === 0) {
          get().removeItem(id)
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: newQuantity } : i
            ),
          })
        }
      },
      clearCart: () => {
        set({ items: [] })
      },
      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.salePrice ?? item.price
          return total + price * item.quantity
        }, 0)
      },
      getTotal: () => {
        const subtotal = get().getSubtotal()
        const shipping = parseFloat(process.env.NEXT_PUBLIC_SHIPPING_DEFAULT || "5000")
        return subtotal + shipping
      },
    }),
    {
      name: "ozbox-cart",
    }
  )
)


