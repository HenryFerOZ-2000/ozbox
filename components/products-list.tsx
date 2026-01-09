"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  salePrice?: number
  stock: number
  category: { name: string }
  images: { url: string; order: number }[]
}

interface ProductsListProps {
  initialCategory?: string
  initialSearch?: string
  initialSort?: string
  initialPage?: number
  categories: { id: string; name: string }[]
}

export function ProductsList({
  initialCategory,
  initialSearch,
  initialSort = "newest",
  initialPage = 1,
  categories,
}: ProductsListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(initialSearch || "")
  const [category, setCategory] = useState(initialCategory || "")
  const [sort, setSort] = useState(initialSort)
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [category, sort, page, initialSearch])

  const fetchProducts = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (initialSearch) params.set("search", initialSearch)
    if (sort) params.set("sort", sort)
    params.set("page", page.toString())

    const res = await fetch(`/api/products?${params}`)
    const data = await res.json()

    if (res.ok) {
      setProducts(data.products)
      setTotalPages(data.pagination.totalPages)
    }
    setLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search) params.set("search", search)
    else params.delete("search")
    params.delete("page")
    router.push(`/productos?${params}`)
  }

  const handleCategoryChange = (value: string) => {
    const actualValue = value === "all" ? "" : value
    setCategory(actualValue)
    const params = new URLSearchParams(searchParams.toString())
    if (actualValue) params.set("category", actualValue)
    else params.delete("category")
    params.delete("page")
    router.push(`/productos?${params}`)
  }

  const handleSortChange = (value: string) => {
    setSort(value)
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    params.delete("page")
    router.push(`/productos?${params}`)
  }

  if (loading) {
    return <div className="text-center py-12">Cargando productos...</div>
  }

  return (
    <div>
      {/* Filtros */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Buscar</Button>
        </form>

        <div className="flex flex-wrap gap-4">
          <Select value={category || "all"} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Más nuevos</SelectItem>
              <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
              <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid de productos */}
      {products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No se encontraron productos
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                      <CardTitle className="hover:text-primary line-clamp-2">
                        {product.name}
                      </CardTitle>
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

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => {
                  setPage(page - 1)
                  const params = new URLSearchParams(searchParams.toString())
                  params.set("page", (page - 1).toString())
                  router.push(`/productos?${params}`)
                }}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => {
                  setPage(page + 1)
                  const params = new URLSearchParams(searchParams.toString())
                  params.set("page", (page + 1).toString())
                  router.push(`/productos?${params}`)
                }}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}


