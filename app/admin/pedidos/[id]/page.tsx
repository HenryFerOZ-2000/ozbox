import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

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

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
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
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="p-8">
      <h1 className="mb-8 text-4xl font-bold">Detalle del Pedido</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pedido {order.code}</CardTitle>
              <Badge className={statusColors[order.status]}>
                {statusLabels[order.status]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información Adicional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                <strong>Fecha de creación:</strong>{" "}
                {new Date(order.createdAt).toLocaleString("es-ES")}
              </p>
            </div>
            {order.user && (
              <div>
                <p className="text-sm text-muted-foreground">
                  <strong>Usuario:</strong> {order.user.email}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


