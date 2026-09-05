# Chowly backend model

Chowly models the dine-in workflow rather than the delivery-oriented draft. Dispatch, rider, GPS and delivery-detail entities are intentionally excluded. `OrderItem` is the only source of truth for ordered menu items and snapshots each price at checkout.

## Entities and relationships

`Restaurant -> RestaurantTable -> Order -> OrderItem -> MenuItem`

`Customer -> Order`, `Restaurant -> Staff`, and `Order -> Staff` through a direct waiter relationship plus `OrderAssignment` records for chefs and bartenders. An order also has one `OrderTracking` record, payments, and optional rating/complaints.

`Staff` is consolidated rather than split into three nearly identical tables. Its controlled `role` enum keeps waiter, chef and bartender validation explicit while avoiding duplicated columns and relationships.

## Constraints

- A table number is unique within its restaurant.
- Menu items, staff and orders are indexed by their common restaurant/query fields.
- One chef and one bartender assignment are allowed per order; reassignment updates that record.
- One rating is allowed per order.
- Monetary values use PostgreSQL decimals. The service calculates all totals from stored menu prices.
- Order state changes are validated in the service layer; clients cannot set arbitrary transitions.

No seed script is included yet, per the current project direction.
