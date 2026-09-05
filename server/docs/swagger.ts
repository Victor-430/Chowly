export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Chowly API Documentation',
    version: '1.0.0',
    description:
      'REST API documentation for Chowly — digital dine-in restaurant ordering, staff coordination, and payments.',
    contact: {
      name: 'Chowly Engineering Team',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  tags: [
    { name: 'Health', description: 'System health & diagnostic endpoints' },
    { name: 'Restaurants', description: 'Restaurant profiles and table configurations' },
    { name: 'Menu', description: 'Menu items and categorized food/drinks' },
    { name: 'Staff', description: 'Restaurant staff (waiters, chefs, bartenders)' },
    { name: 'Orders', description: 'Order placement, status tracking, and fulfillment' },
    { name: 'Payments', description: 'Order billing and payment settlement' },
    { name: 'Feedback', description: 'Customer ratings and service complaints' },
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Server health check',
        description: 'Returns the current server status and timestamp.',
        responses: {
          200: {
            description: 'Server is running normally',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    service: { type: 'string', example: 'chowly-server' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/api/restaurants': {
      get: {
        tags: ['Restaurants'],
        summary: 'List all restaurants',
        description: 'Returns a list of all active restaurant locations.',
        responses: {
          200: {
            description: 'List of restaurants',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RestaurantListResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/restaurants/{id}': {
      get: {
        tags: ['Restaurants'],
        summary: 'Get restaurant details',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Restaurant unique identifier',
            schema: { type: 'string', example: 'the-grill-house' },
          },
        ],
        responses: {
          200: {
            description: 'Restaurant details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RestaurantResponse',
                },
              },
            },
          },
          404: {
            description: 'Restaurant not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/api/restaurants/{id}/tables': {
      get: {
        tags: ['Restaurants'],
        summary: 'List dining tables for a restaurant',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Restaurant ID',
            schema: { type: 'string', example: 'the-grill-house' },
          },
        ],
        responses: {
          200: {
            description: 'List of tables',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TableListResponse',
                },
              },
            },
          },
          404: {
            description: 'Restaurant not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/api/restaurants/{restaurantId}/menu': {
      get: {
        tags: ['Menu'],
        summary: 'List menu items for a restaurant',
        description: 'Returns all available menu items, optionally filtered by category (food, drinks, desserts).',
        parameters: [
          {
            name: 'restaurantId',
            in: 'path',
            required: true,
            description: 'Restaurant ID',
            schema: { type: 'string', example: 'the-grill-house' },
          },
          {
            name: 'category',
            in: 'query',
            required: false,
            description: 'Filter category name',
            schema: {
              type: 'string',
              enum: ['all', 'food', 'drinks', 'desserts'],
              example: 'food',
            },
          },
        ],
        responses: {
          200: {
            description: 'List of menu items',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MenuItemListResponse',
                },
              },
            },
          },
          404: {
            description: 'Restaurant not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/api/menu/{id}': {
      get: {
        tags: ['Menu'],
        summary: 'Get single menu item',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Menu item ID',
            schema: { type: 'string', example: 'menu-001' },
          },
        ],
        responses: {
          200: {
            description: 'Menu item details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MenuItemResponse',
                },
              },
            },
          },
          404: {
            description: 'Menu item not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/api/restaurants/{restaurantId}/staff': {
      get: {
        tags: ['Staff'],
        summary: 'List restaurant staff',
        description: 'Retrieve staff members (waiters, chefs, bartenders) assigned to a restaurant.',
        parameters: [
          {
            name: 'restaurantId',
            in: 'path',
            required: true,
            description: 'Restaurant ID',
            schema: { type: 'string', example: 'the-grill-house' },
          },
          {
            name: 'role',
            in: 'query',
            required: false,
            description: 'Filter by staff role',
            schema: {
              type: 'string',
              enum: ['waiter', 'chef', 'bartender'],
              example: 'chef',
            },
          },
        ],
        responses: {
          200: {
            description: 'List of staff members',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StaffListResponse',
                },
              },
            },
          },
          404: {
            description: 'Restaurant not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/api/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Place a new dine-in order',
        description: 'Creates a new order with server-validated prices, calculates totals and estimated wait time, and marks the table as occupied.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateOrderRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Order placed successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderResponse' },
              },
            },
          },
          404: {
            description: 'Restaurant, customer, or table not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          409: {
            description: 'Restaurant is closed',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          422: {
            description: 'Validation error (e.g. invalid item, table mismatch)',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
      get: {
        tags: ['Orders'],
        summary: 'List orders with optional filters',
        parameters: [
          {
            name: 'restaurantId',
            in: 'query',
            required: false,
            description: 'Filter orders by restaurant',
            schema: { type: 'string', example: 'the-grill-house' },
          },
          {
            name: 'customerId',
            in: 'query',
            required: false,
            description: 'Filter orders by customer',
            schema: { type: 'string', example: 'cust-001' },
          },
          {
            name: 'page',
            in: 'query',
            required: false,
            description: 'Page number for pagination',
            schema: { type: 'integer', default: 1, example: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            description: 'Number of orders per page',
            schema: { type: 'integer', default: 20, example: 20 },
          },
        ],
        responses: {
          200: {
            description: 'Paginated list of orders',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderPaginatedResponse' },
              },
            },
          },
        },
      },
    },

    '/api/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Get order details by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Order ID',
            schema: { type: 'string', example: 'cm7order123' },
          },
        ],
        responses: {
          200: {
            description: 'Order details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderResponse' },
              },
            },
          },
          404: {
            description: 'Order not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
    },

    '/api/orders/{id}/status': {
      patch: {
        tags: ['Orders'],
        summary: 'Advance order status',
        description:
          'Valid status transitions: NEW → ASSIGNED/CANCELLED → PREPARING/CANCELLED → READY → SERVED → AWAITING_PAYMENT → PAID.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Order ID',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: {
                    type: 'string',
                    enum: [
                      'new',
                      'assigned',
                      'preparing',
                      'ready',
                      'served',
                      'awaiting_payment',
                      'paid',
                      'cancelled',
                    ],
                    example: 'preparing',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Order status updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderResponse' },
              },
            },
          },
          404: {
            description: 'Order not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          409: {
            description: 'Invalid status transition',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
    },

    '/api/orders/{id}/waiter': {
      patch: {
        tags: ['Orders'],
        summary: 'Assign a waiter to an order',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Order ID',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['waiterId'],
                properties: {
                  waiterId: { type: 'string', example: 'staff-001' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Waiter assigned successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderResponse' },
              },
            },
          },
          404: {
            description: 'Order not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          422: {
            description: 'Invalid waiter or waiter not from this restaurant',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
    },

    '/api/orders/{id}/assign': {
      patch: {
        tags: ['Orders'],
        summary: 'Assign preparation staff (chef or bartender)',
        description: 'Assigns a chef or bartender to prepare the order items.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Order ID',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['staffId', 'role'],
                properties: {
                  staffId: { type: 'string', example: 'staff-003' },
                  role: {
                    type: 'string',
                    enum: ['CHEF', 'BARTENDER'],
                    example: 'CHEF',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Staff assigned successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderResponse' },
              },
            },
          },
          404: {
            description: 'Order not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          422: {
            description: 'Staff member does not match role or restaurant',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
    },

    '/api/orders/{orderId}/payments': {
      post: {
        tags: ['Payments'],
        summary: 'Process payment for an order',
        description: 'Settles an order currently in AWAITING_PAYMENT status and updates order to PAID.',
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            description: 'Order ID',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['paymentType'],
                properties: {
                  paymentType: {
                    type: 'string',
                    enum: ['CARD', 'BANK_TRANSFER', 'CASH'],
                    example: 'CARD',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Payment processed successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaymentResponse' },
              },
            },
          },
          404: {
            description: 'Order not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          409: {
            description: 'Order is not in AWAITING_PAYMENT status',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
    },

    '/api/orders/{orderId}/rating': {
      post: {
        tags: ['Feedback'],
        summary: 'Submit a 1-5 star rating for an order',
        description: 'Allows customer to rate their dining experience after order is served or paid.',
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            description: 'Order ID',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['customerId', 'rating'],
                properties: {
                  customerId: { type: 'string', example: 'cust-001' },
                  rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                  comment: { type: 'string', example: 'Delicious food and swift service!' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Rating submitted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RatingResponse' },
              },
            },
          },
          404: {
            description: 'Order not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          409: {
            description: 'Order has already been rated or is not yet served',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
    },

    '/api/orders/{orderId}/complaints': {
      post: {
        tags: ['Feedback'],
        summary: 'Submit a complaint for an order',
        description: 'File an issue regarding service, delay, or order discrepancy.',
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            description: 'Order ID',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['customerId', 'type', 'description'],
                properties: {
                  customerId: { type: 'string', example: 'cust-001' },
                  type: {
                    type: 'string',
                    enum: [
                      'FOOD_TOOK_TOO_LONG',
                      'INCORRECT_ORDER',
                      'POOR_SERVICE',
                      'OTHER',
                    ],
                    example: 'FOOD_TOOK_TOO_LONG',
                  },
                  description: {
                    type: 'string',
                    example: 'The drinks took over 25 minutes to arrive.',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Complaint registered',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ComplaintResponse' },
              },
            },
          },
          404: {
            description: 'Order not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
    },
  },

  components: {
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Resource was not found' },
        },
      },

      Restaurant: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'the-grill-house' },
          name: { type: 'string', example: 'The Grill House' },
          phone: { type: 'string', example: '+234 801 234 5678' },
          image: { type: 'string', format: 'uri' },
          description: { type: 'string' },
          openingTime: { type: 'string', example: '10:00 AM' },
          closingTime: { type: 'string', example: '11:00 PM' },
          status: { type: 'string', example: 'open' },
          avgPrepTime: { type: 'integer', example: 20 },
          rating: { type: 'number', example: 4.8 },
          tableCount: { type: 'integer', example: 15 },
        },
      },

      RestaurantResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Restaurant retrieved successfully' },
          data: { $ref: '#/components/schemas/Restaurant' },
        },
      },

      RestaurantListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Restaurants retrieved successfully' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Restaurant' },
          },
        },
      },

      Table: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cm7table1' },
          number: { type: 'integer', example: 4 },
          capacity: { type: 'integer', example: 4 },
          status: { type: 'string', example: 'available' },
          restaurantId: { type: 'string', example: 'the-grill-house' },
        },
      },

      TableListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Tables retrieved successfully' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Table' },
          },
        },
      },

      MenuItem: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'menu-001' },
          name: { type: 'string', example: 'Jollof Rice' },
          description: { type: 'string' },
          price: { type: 'number', example: 2500 },
          image: { type: 'string', format: 'uri' },
          category: { type: 'string', example: 'food' },
          prepTime: { type: 'integer', example: 15 },
          isPopular: { type: 'boolean', example: true },
        },
      },

      MenuItemResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Menu item retrieved successfully' },
          data: { $ref: '#/components/schemas/MenuItem' },
        },
      },

      MenuItemListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Menu items retrieved successfully' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/MenuItem' },
          },
        },
      },

      StaffMember: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'staff-001' },
          name: { type: 'string', example: 'David Adeyemi' },
          role: { type: 'string', example: 'waiter' },
          availability: { type: 'string', example: 'available' },
        },
      },

      StaffListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Staff retrieved successfully' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/StaffMember' },
          },
        },
      },

      CreateOrderItemInput: {
        type: 'object',
        required: ['menuItemId', 'quantity'],
        properties: {
          menuItemId: { type: 'string', example: 'menu-001' },
          quantity: { type: 'integer', minimum: 1, maximum: 50, example: 2 },
          specialInstructions: { type: 'string', example: 'Extra spicy, plantains well-done' },
        },
      },

      CreateOrderRequest: {
        type: 'object',
        required: ['customerId', 'restaurantId', 'tableId', 'items'],
        properties: {
          customerId: { type: 'string', example: 'cust-001' },
          restaurantId: { type: 'string', example: 'the-grill-house' },
          tableId: { type: 'string', example: 'table-id-from-tables-endpoint' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/CreateOrderItemInput' },
          },
        },
      },

      OrderItem: {
        type: 'object',
        properties: {
          menuItemId: { type: 'string', example: 'menu-001' },
          name: { type: 'string', example: 'Jollof Rice' },
          price: { type: 'number', example: 2500 },
          quantity: { type: 'integer', example: 2 },
          specialInstructions: { type: 'string', nullable: true },
        },
      },

      StaffAssignment: {
        type: 'object',
        properties: {
          waiterId: { type: 'string', nullable: true, example: 'staff-001' },
          waiterName: { type: 'string', nullable: true, example: 'David Adeyemi' },
          chefId: { type: 'string', nullable: true, example: 'staff-003' },
          chefName: { type: 'string', nullable: true, example: 'Emeka Obi' },
          bartenderId: { type: 'string', nullable: true, example: 'staff-005' },
          bartenderName: { type: 'string', nullable: true, example: 'Daniel James' },
        },
      },

      Order: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cm7orderabc' },
          customerId: { type: 'string', example: 'cust-001' },
          restaurantId: { type: 'string', example: 'the-grill-house' },
          tableId: { type: 'string', example: 'cm7table1' },
          tableNumber: { type: 'integer', example: 4 },
          status: { type: 'string', example: 'new' },
          subtotal: { type: 'number', example: 5000 },
          packagingFee: { type: 'number', example: 0 },
          total: { type: 'number', example: 5000 },
          estimatedWait: { type: 'integer', example: 20 },
          paymentStatus: { type: 'string', example: 'pending' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItem' },
          },
          staffAssignment: { $ref: '#/components/schemas/StaffAssignment' },
        },
      },

      OrderResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Order retrieved successfully' },
          data: { $ref: '#/components/schemas/Order' },
        },
      },

      OrderPaginatedResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Orders retrieved successfully' },
          data: {
            type: 'object',
            properties: {
              orders: {
                type: 'array',
                items: { $ref: '#/components/schemas/Order' },
              },
              meta: {
                type: 'object',
                properties: {
                  page: { type: 'integer', example: 1 },
                  limit: { type: 'integer', example: 20 },
                  total: { type: 'integer', example: 5 },
                  totalPages: { type: 'integer', example: 1 },
                },
              },
            },
          },
        },
      },

      PaymentResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Payment processed successfully' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              orderId: { type: 'string' },
              amount: { type: 'number', example: 5000 },
              status: { type: 'string', example: 'success' },
              paymentType: { type: 'string', example: 'card' },
              paidAt: { type: 'string', format: 'date-time' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },

      RatingResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Rating submitted successfully' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              orderId: { type: 'string' },
              rating: { type: 'integer', example: 5 },
              comment: { type: 'string', nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },

      ComplaintResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Complaint submitted successfully' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              orderId: { type: 'string' },
              type: { type: 'string', example: 'food_took_too_long' },
              description: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  },
};

