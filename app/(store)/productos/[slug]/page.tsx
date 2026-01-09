import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProductDetail } from "@/components/product-detail"

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      images: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!product || product.status !== "ACTIVO") {
    notFound()
  }

  // Convertir null a undefined para salePrice
  const productForComponent = {
    ...product,
    salePrice: product.salePrice ?? undefined,
  }

  return <ProductDetail product={productForComponent} />
}


