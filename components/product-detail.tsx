"use client"

import { useState } from "react"
import Image from "next/image"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, Minus, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProductDetailProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    salePrice?: number | null
    stock: number
    category: { name: string }
    images: { url: string; order: number }[]
  }
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const price = (product.salePrice ?? undefined) ?? product.price
  const images = product.images.length > 0 ? product.images : [{ url: "/placeholder-product.jpg", order: 0 }]

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast({
        title: "Sin stock",
        description: "Este producto no está disponible",
        variant: "destructive",
      })
      return
    }

    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.id,
        price: product.price,
        salePrice: product.salePrice ?? undefined,
        image: images[0].url,
        stock: product.stock,
      },
      quantity
    )

    toast({
      title: "Agregado al carrito",
      description: `${product.name} (${quantity})`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Galería de imágenes */}
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
            <Image
              src={images[selectedImage].url}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div>
          <Card>
            <CardHeader>
              <CardDescription>{product.category.name}</CardDescription>
              <CardTitle className="text-3xl">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-primary">
                    {formatPrice(price)}
                  </span>
                  {(product.salePrice ?? undefined) && (
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Stock disponible: {product.stock}</p>
                {product.stock === 0 && (
                  <p className="text-sm font-semibold text-destructive">Sin stock</p>
                )}
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Descripción</h3>
                <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
              </div>

              {/* Selector de cantidad */}
              <div>
                <label className="mb-2 block text-sm font-semibold">Cantidad</label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Agregar al Carrito
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


