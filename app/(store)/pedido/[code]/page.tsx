import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const statusLabels: Record<string, string> = {
  PENDIENTE: "Pendiente",
  PAGADO: "Pagado",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
}

const statusColors: Record<string, string> = {
  PENDIENTE: "bg-yellow-500",
  PAGADO: "bg-blue-500",
  ENVIADO: "bg-purple-500",
  ENTREGADO: "bg-green-500",
  CANCELADO: "bg-red-500",
}

export default async function OrderPage({
  params,
}: {
  params: { code: string }
}) {
  const order = await prisma.order.findUnique({
    where: { code: params.code },
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
    },
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mx-auto max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
          <h1 className="mb-2 text-3xl font-bold">¡Pedido Creado Exitosamente!</h1>
          <p className="mb-6 text-muted-foreground">
            Tu pedido ha sido registrado con el código:
          </p>
          <p className="mb-8 text-2xl font-bold text-primary">{order.code}</p>
        </CardContent>
      </Card>

      <Card className="mx-auto mt-8 max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Detalle del Pedido</CardTitle>
            <Badge className={statusColors[order.status]}>
              {statusLabels[order.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">Información de Contacto</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Nombre:</strong> {order.customerName}</p>
              <p><strong>Teléfono:</strong> {order.phone}</p>
              <p><strong>Dirección:</strong> {order.address}</p>
              <p><strong>Ciudad:</strong> {order.city}</p>
              {order.notes && (
                <p><strong>Notas:</strong> {order.notes}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Productos</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.nameSnapshot} x{item.quantity}
                  </span>
                  <span>{formatPrice(item.priceSnapshot * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span className="font-semibold">{formatPrice(order.shipping)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/productos" className="flex-1">
              <Button variant="outline" className="w-full">
                Seguir Comprando
              </Button>
            </Link>
            <Link href="/pedidos" className="flex-1">
              <Button className="w-full">
                Ver Mis Pedidos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


