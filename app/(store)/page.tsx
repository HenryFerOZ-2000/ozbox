import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, Search } from "lucide-react"

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVO" },
    include: {
      category: true,
      images: {
        orderBy: { order: "asc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  })
  return products
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: "asc" },
  })
  return categories
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner */}
      <div className="mb-12 rounded-lg bg-gradient-to-r from-primary to-primary/80 p-12 text-center text-white">
        <h1 className="mb-4 text-5xl font-bold">OZBOX</h1>
        <p className="text-xl">Tu tienda online de confianza</p>
      </div>

      {/* Buscador */}
      <div className="mb-8">
        <form action="/productos" method="get" className="flex gap-2">
          <input
            type="text"
            name="search"
            placeholder="Buscar productos..."
            className="flex-1 rounded-md border border-input bg-background px-4 py-2"
          />
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </form>
      </div>

      {/* Categorías destacadas */}
      {categories.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold">Categorías</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/productos?category=${category.id}`}>
                <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>
                      {category._count.products} productos
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Productos destacados */}
      <section>
        <h2 className="mb-6 text-3xl font-bold">Productos Destacados</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const price = product.salePrice ?? product.price
            const imageUrl = product.images[0]?.url || "/placeholder-product.jpg"

            return (
              <Card key={product.id} className="overflow-hidden">
                <Link href={`/productos/${product.slug}`}>
                  <div className="relative aspect-square w-full">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                <CardHeader>
                  <Link href={`/productos/${product.slug}`}>
                    <CardTitle className="hover:text-primary">{product.name}</CardTitle>
                  </Link>
                  <CardDescription>{product.category.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(price)}
                    </span>
                    {product.salePrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  {product.stock === 0 && (
                    <p className="mt-2 text-sm text-destructive">Sin stock</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href={`/productos/${product.slug}`} className="w-full">
                    <Button className="w-full" disabled={product.stock === 0}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Ver Detalle
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}


