"use client"

import { useCartStore } from "@/store/cart-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const getSubtotal = useCartStore((state) => state.getSubtotal)
  const getTotal = useCartStore((state) => state.getTotal)

  const subtotal = getSubtotal()
  const shipping = parseFloat(process.env.NEXT_PUBLIC_SHIPPING_DEFAULT || "5000")
  const total = getTotal()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-semibold">Tu carrito está vacío</h2>
            <p className="mb-6 text-muted-foreground">
              Agrega productos para comenzar
            </p>
            <Link href="/productos">
              <Button>Ver Productos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Carrito de Compras</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = item.salePrice ?? item.price

            return (
              <Card key={item.id}>
                <CardContent className="flex gap-4 p-6">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="font-semibold">
                          {formatPrice(price * item.quantity)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="font-semibold">{formatPrice(shipping)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => router.push("/checkout")}
              >
                Proceder al Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


