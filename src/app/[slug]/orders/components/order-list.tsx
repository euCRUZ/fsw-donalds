"use client"

import { Button } from "@/components/ui/button"
import { OrderStatus, Prisma } from "@prisma/client"
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/helpers/format-currency"
import Image from "next/image"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { on } from "events"

interface OrderListProps {
  orders: Array<
    Prisma.OrderGetPayload<{
      include: {
        restaurant: {
          select: {
            name: true
            avatarImageUrl: true
          }
        }
        orderProducts: {
          include: {
            product: true
          }
        }
      }
    }>
  >
}

const getStatusLabel = (status: OrderStatus) => {
  if (status === "FINISHED") return "Finalizado"
  if (status === "IN_PREPARATION") return "Em preparo"
  if (status === "PENDING") return "Pendente"
  return ""
}

const OrderList = ({ orders }: OrderListProps) => {
  const { slug } = useParams<{ slug: string }>()

  // const searchParams = useSearchParams()

  const router = useRouter()
  const handleBackClick = () => router.back()

  return (
    <div className="space-y-6 p-6">
      <Button
        size="icon"
        variant="secondary"
        className="rounded-full"
        onClick={handleBackClick}
      >
        <ChevronLeftIcon />
      </Button>
      <div className="flex items-center gap-3">
        <ScrollTextIcon />
        <h2 className="text-lg font-semibold">Meus Pedidos</h2>
      </div>

      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="space-y-4 p-5">
            <div
              className={`w-fit rounded-full px-2 py-1 text-xs font-semibold text-white ${order.status === OrderStatus.FINISHED ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"} `}
            >
              {getStatusLabel(order.status)}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative h-6 w-6">
                <Image
                  src={order.restaurant.avatarImageUrl}
                  alt={order.restaurant.name}
                  className="rounded-sm"
                  fill
                />
              </div>
              <div>
                <p className="text-sm font-semibold">{order.restaurant.name}</p>
                <p className="text-[0.7rem] font-semibold text-gray-400">
                  {order.createdAt.toLocaleString()}
                </p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              {order.orderProducts.map((orderProduct) => (
                <div key={orderProduct.id} className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white">
                    {orderProduct.quantity}
                  </div>
                  <p className="text-sm">{orderProduct.product.name}</p>
                </div>
              ))}
            </div>
            <Separator />
            <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default OrderList
