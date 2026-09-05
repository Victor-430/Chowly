import { Badge } from '@/components/ui/badge'
import type { OrderStatus } from '@/types'

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  switch (status) {
    case 'new':
      return <Badge variant="info">New</Badge>
    case 'assigned':
      return <Badge variant="info">Assigned</Badge>
    case 'preparing':
      return <Badge variant="warning">Preparing</Badge>
    case 'ready':
      return <Badge variant="success">Ready</Badge>
    case 'served':
      return <Badge variant="success">Served</Badge>
    case 'awaiting_payment':
      return <Badge variant="amber">Awaiting Payment</Badge>
    case 'paid':
      return <Badge variant="default">Paid</Badge>
    case 'cancelled':
      return <Badge variant="error">Cancelled</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}
