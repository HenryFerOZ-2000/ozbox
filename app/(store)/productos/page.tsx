import { Suspense } from "react"
import { ProductsList } from "@/components/products-list"
import { prisma } from "@/lib/prisma"

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  })
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; sort?: string; page?: string }
}) {
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Catálogo de Productos</h1>
      <Suspense fallback={<div>Cargando productos...</div>}>
        <ProductsList
          initialCategory={searchParams.category}
          initialSearch={searchParams.search}
          initialSort={searchParams.sort || "newest"}
          initialPage={parseInt(searchParams.page || "1")}
          categories={categories}
        />
      </Suspense>
    </div>
  )
}


