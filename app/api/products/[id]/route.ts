import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { slugify } from "@/lib/utils"

const productSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  salePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0).optional(),
  status: z.enum(["ACTIVO", "BORRADOR"]).optional(),
  categoryId: z.string().optional(),
  images: z.array(z.object({ url: z.string(), publicId: z.string().optional(), order: z.number() })).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Error al obtener producto" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const data = productSchema.parse(body)

    const updateData: Record<string, unknown> = { ...data }
    if (data.name && !body.slug) {
      updateData.slug = slugify(data.name)
    }

    // Si hay imágenes, eliminar las antiguas y crear las nuevas
    if (data.images) {
      await prisma.productImage.deleteMany({
        where: { productId: params.id },
      })
      updateData.images = {
        create: data.images,
      }
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
      },
    })

    // Log de admin
    await prisma.adminLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "Product",
        entityId: params.id,
        metadata: { name: product.name },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    await prisma.product.delete({
      where: { id: params.id },
    })

    // Log de admin
    await prisma.adminLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entity: "Product",
        entityId: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    )
  }
}


