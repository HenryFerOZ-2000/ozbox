import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { generateOrderCode } from "@/lib/utils"

const orderSchema = z.object({
  customerName: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  notes: z.string().optional(),
  paymentMethod: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const where: { status?: string; userId?: string } = {}
    if (status) {
      where.status = status
    }

    // Si es admin, ver todos. Si es cliente, solo los suyos
    if (!session || session.user.role !== "ADMIN") {
      if (session) {
        where.userId = session.user.id
      } else {
        return NextResponse.json({ orders: [] })
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { order: "asc" },
                  take: 1,
                },
              },
            },
          },
        },
        user: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Error al obtener pedidos" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = orderSchema.parse(body)

    // Verificar stock y calcular totales
    let subtotal = 0
    const orderItems = []

    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return NextResponse.json(
          { error: `Producto ${item.productId} no encontrado` },
          { status: 400 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${product.name}` },
          { status: 400 }
        )
      }

      const price = product.salePrice ?? product.price
      subtotal += price * item.quantity

      orderItems.push({
        productId: product.id,
        nameSnapshot: product.name,
        priceSnapshot: price,
        quantity: item.quantity,
      })
    }

    const shipping = parseFloat(process.env.SHIPPING_DEFAULT || "5000")
    const total = subtotal + shipping

    const session = await getServerSession(authOptions)

    // Crear pedido
    const order = await prisma.order.create({
      data: {
        code: generateOrderCode(),
        userId: session?.user.id,
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        notes: data.notes,
        subtotal,
        shipping,
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    })

    // Descontar stock
    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Error al crear pedido" },
      { status: 500 }
    )
  }
}


