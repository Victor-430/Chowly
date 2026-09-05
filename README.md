# 🍽️ Chowly — Digital Restaurant Dining & Staff Coordination Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB.svg?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2+-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3+-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21+-000000.svg?style=flat-square&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19+-2D3748.svg?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791.svg?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D.svg?style=flat-square&logo=swagger)](http://localhost:5000/api/docs)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

**Chowly** is a full-stack, mobile-first and desktop-optimized digital dining platform designed for modern restaurants. It replaces outdated paper menus and slow service bottlenecks with QR-powered table ordering, real-time preparation tracking, multi-station staff dispatch (waiters, chefs, bartenders), frictionless digital bill settlement, and customer feedback loops.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
  - [Customer Experience](#-customer-experience)
  - [Waiter & Staff Operations](#-waiter--staff-operations)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Database Schema (Prisma & PostgreSQL)](#-database-schema-prisma--postgresql)
- [REST API Reference & Swagger](#-rest-api-reference--swagger)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone and Install Dependencies](#1-clone-and-install-dependencies)
  - [2. Environment Configuration](#2-environment-configuration)
  - [3. Database Setup & Seeding](#3-database-setup--seeding)
  - [4. Running the Development Servers](#4-running-the-development-servers)
- [Offline / Standalone Demo Mode](#-offline--standalone-demo-mode)
- [Production Deployment](#-production-deployment)
  - [Client Deployment (Vercel / Netlify)](#client-deployment-vercel--netlify)
  - [Server Deployment (Render / Railway / VPS)](#server-deployment-render--railway--vps)
- [Troubleshooting & Windows Development Tips](#-troubleshooting--windows-development-tips)
- [Contributing & License](#-contributing--license)

---

## ✨ Key Features

### 👤 Customer Experience

- **Seamless QR Code / Table Selection:** Customers scan a table QR code (e.g. `/restaurant/the-grill-house/table/3`) or select their table from an intuitive visual grid with live capacity indicators.
- **Categorized Digital Menu:** Fast item filtering across Food, Drinks, and Desserts with real-time text search, preparation time badges, price tags, and high-resolution photography.
- **Customized Item Ordering:** Add special instructions (e.g. *"Extra spicy"*, *"No onions"*), adjust quantities, and review live price calculations.
- **Responsive Cart:** Responsive slide-over / 2-column widescreen cart with line-item notes, packaging fees, subtotal calculation, and instant order placement.
- **Live Order Timeline:** Real-time visual progress tracker across 6 distinct lifecycle steps:
  1. *Order Received*
  2. *Waiter Assigned*
  3. *Chef Assigned / Bartender Assigned*
  4. *Preparing*
  5. *Ready for Serving*
  6. *Served*
- **Contactless Bill Payment:** On-screen bill breakdown with instant payment simulation (Card, Bank Transfer, Cash).
- **Post-Dining Feedback:** 5-star rating system with contextual complaint capture (*"Food took too long"*, *"Incorrect order"*, *"Poor service"*, etc.) when ratings indicate a sub-optimal experience.
- **Order History:** Persistent access to past orders placed at the table.

### 🧑‍🍳 Waiter & Staff Operations

- **Waiter Operations Dashboard:** Live analytics overview displaying active orders count, orders currently preparing, ready for pickup, and orders served today.
- **Live Order Queue & Search:** Search orders by Order ID or Table number, with one-tap status filtering (*All, New, Assigned, Preparing, Ready, Served, Paid*).
- **Flexible Multi-Station Staff Assignment:** 
  - Dynamic assignment to **Chefs** (kitchen station) and/or **Bartenders** (drinks bar).
  - Supports food-only orders (chef only), drinks-only orders (bartender only), or combo orders (both).
  - Orders seamlessly transition to `ASSIGNED` once relevant preparation personnel are selected.
- **Status Lifecycle Progression:** Single-click order status advancement (`new` → `assigned` → `preparing` → `ready` → `served`).
- **Responsive & Mobile-Protected Viewports:** Fully responsive layout with hardened `min-w-0` overflow protection to eliminate awkward horizontal scrolling on phone screens.
- **Role Switcher:** Instant role-switching toggle between Customer and Waiter modes for testing, staff training, and demos.

---

## 🏛️ System Architecture

```mermaid
flowchart TB
    subgraph Client ["Client (React 19 + Vite + Tailwind CSS v4)"]
        UI[Customer / Waiter Views]
        ZS[Zustand Stores]
        API_LAYER[API Service Layer]
        MOCK[Offline Mock Fallback]
        
        UI <--> ZS
        ZS <--> API_LAYER
        API_LAYER -.->|If server offline| MOCK
    end

    subgraph Server ["Backend (Node.js + Express + TypeScript)"]
        EXPRESS[Express API Router]
        SWAGGER[Swagger UI /docs]
        VAL[Input Validators]
        PRISMA[Prisma ORM Client]
        
        EXPRESS --> SWAGGER
        EXPRESS --> VAL
        VAL --> PRISMA
    end

    subgraph Database ["PostgreSQL (Neon / Local)"]
        PG[(PostgreSQL Database)]
        PRISMA --> PG
    end

    API_LAYER <===>|HTTP / JSON REST API| EXPRESS
```

---

## 🛠️ Tech Stack

### Frontend (`client/`)
- **Core:** React 19, TypeScript 5.7+, Vite 8
- **Styling:** Tailwind CSS v4 (native `@theme` styling & utility classes)
- **Routing:** React Router v8 (nested routes, layouts, dynamic parameters)
- **State Management:** Zustand 5 (modular stores for cart, orders, restaurant, role)
- **Icons & Animations:** Framer Motion 13, React Icons (`react-icons/hi2`)
- **Notifications:** Sonner (responsive adaptive toast placement: bottom-right on desktop, top-center on mobile)

### Backend (`server/`)
- **Runtime & Framework:** Node.js, Express 4, TypeScript 5.7+
- **ORM & Database:** Prisma ORM 6, PostgreSQL (compatible with Neon serverless Postgres)
- **API Documentation:** Swagger UI Express, OpenAPI 3.0.0 specification
- **Validation & Middleware:** Express middleware for request schema validation, CORS, error handling
- **Dev Runner:** `tsx` for high-performance TypeScript script execution and watch mode

---

## 📂 Repository Structure

```text
chowly/
├── client/                     # Frontend SPA application
│   ├── public/                 # Static assets & _redirects for SPAs
│   ├── src/
│   │   ├── components/
│   │   │   ├── customer/       # Customer-specific components (MenuCard, CartItem, OrderTimeline, etc.)
│   │   │   ├── shared/         # Shared components (EmptyState, OrderStatusBadge, RoleSwitcher)
│   │   │   ├── ui/             # Reusable design primitives (Button, Card, Dialog, Badge, Input, Select)
│   │   │   └── waiter/         # Staff components (OrderCard, StatsCard, AssignmentPanel, StaffSelector)
│   │   ├── data/               # Default fallback mock data (menu items, staff, restaurants)
│   │   ├── layouts/            # CustomerShell & WaiterShell with responsive navigation headers
│   │   ├── lib/                # API client fetcher, formatting utilities, class mergers
│   │   ├── pages/
│   │   │   ├── customer/       # Home, Menu, Cart, OrderConfirmation, Orders, Payment, Feedback, TableEntry
│   │   │   └── waiter/         # Dashboard, Orders queue, OrderDetail
│   │   ├── services/           # Backend API integration services
│   │   ├── stores/             # Zustand stores (cart, order, restaurant, role)
│   │   ├── types/              # Domain TypeScript interfaces and Enums
│   │   ├── App.tsx             # Route definitions and code-split pages
│   │   ├── index.css           # Tailwind v4 theme configurations and custom styling
│   │   └── main.tsx            # React application entry point with ResponsiveToaster
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                     # Backend REST API
│   ├── docs/                   # OpenAPI 3.0 Swagger specification
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma database schema definition
│   │   └── seed.ts             # Comprehensive database seeder (restaurants, tables, menu, staff)
│   ├── routes/                 # Express routers (restaurant, menu, order)
│   ├── controllers/            # Controller handlers for requests & responses
│   ├── middleware/             # Validation, error handling, not-found middlewares
│   ├── validators/             # Request payload validation rules
│   ├── services/               # Database query services wrapping Prisma
│   ├── index.ts                # Server entry point and API route configuration
│   ├── package.json
│   └── tsconfig.json
├── package.json                # Root package with unified workspace commands
├── vercel.json                 # Vercel deployment routing configuration
└── README.md                   # Project documentation
```

---

## 🗄️ Database Schema (Prisma & PostgreSQL)

The database schema models full restaurant operations with cascade rules and relational integrity:

```text
Restaurant (1) ──┬── (N) RestaurantTable ── (N) Order
                 ├── (N) MenuItem ───────── (N) OrderItem
                 ├── (N) Staff ──────────── (N) OrderAssignment
                 └── (N) Order

Order (1) ───────┬── (N) OrderItem ─────── (1) MenuItem
                 ├── (N) OrderAssignment ─ (1) Staff
                 ├── (1) OrderTracking
                 ├── (N) Payment
                 ├── (1) Rating
                 └── (N) Complaint
```

### Key Models & Enums

| Model | Purpose | Key Attributes |
| :--- | :--- | :--- |
| **`Restaurant`** | Multi-venue support | `id`, `name`, `image`, `averagePrepTime`, `status` (`OPEN` / `CLOSED`) |
| **`RestaurantTable`** | Dine-in tables | `restaurantId`, `tableNumber`, `capacity`, `status` (`AVAILABLE` / `OCCUPIED`) |
| **`Customer`** | Guest identification | `id`, `displayName`, relations to orders & ratings |
| **`MenuCategory`** | Item groupings | `id`, `name` (`food`, `drinks`, `desserts`) |
| **`MenuItem`** | Dishes and beverages | `name`, `description`, `price`, `preparationTime`, `image`, `availabilityStatus` |
| **`Staff`** | Restaurant personnel | `fullName`, `role` (`WAITER`, `CHEF`, `BARTENDER`), `availability` (`AVAILABLE` / `BUSY`) |
| **`Order`** | Central transaction | `status` (`NEW`, `ASSIGNED`, `PREPARING`, `READY`, `SERVED`, `AWAITING_PAYMENT`, `PAID`, `CANCELLED`), `subtotal`, `totalAmount` |
| **`OrderItem`** | Line-item details | `menuItemId`, `quantity`, `unitPrice`, `subtotal`, `specialInstructions` |
| **`OrderAssignment`**| Kitchen / bar dispatch | `orderId`, `staffId`, `role`, `status` (`ASSIGNED`, `IN_PROGRESS`, `COMPLETED`) |
| **`OrderTracking`** | Preparation analytics | `startedAt`, `readyAt`, `servedAt`, `processingTime` |
| **`Payment`** | Bill settlement | `amount`, `paymentType` (`CARD`, `BANK_TRANSFER`, `CASH`), `status` (`PENDING`, `SUCCESS`) |
| **`Rating`** | Experience review | `rating` (1–5 stars), `comment` |
| **`Complaint`** | Quality assurance | `type` (`FOOD_TOOK_TOO_LONG`, `INCORRECT_ORDER`, `POOR_SERVICE`, `OTHER`), `description` |

---

## 📡 REST API Reference & Swagger

Chowly features an interactive Swagger UI documentation dashboard. When the backend is running, visit:
👉 **`http://localhost:5000/api/docs`**

### Summary of Primary Endpoints

#### 🏥 System Health
- `GET /api/health` — Returns server uptime and health status.

#### 🍽️ Restaurants & Staff
- `GET /api/restaurants` — List all registered restaurants.
- `GET /api/restaurants/:id` — Get restaurant profile by ID.
- `GET /api/restaurants/:id/tables` — List tables and occupancy for a venue.
- `GET /api/restaurants/:restaurantId/menu` — Retrieve full menu items for a venue.
- `GET /api/restaurants/:restaurantId/staff` — List staff members filtered by role and availability.

#### 📋 Orders & Preparation
- `POST /api/orders` — Create a new order with line items, table ID, and customer ID.
- `GET /api/orders` — Filter orders by status, restaurant, table, or customer.
- `GET /api/orders/:id` — Retrieve comprehensive order details, staff assignments, and tracking.
- `PATCH /api/orders/:id/status` — Advance order status (`ASSIGNED`, `PREPARING`, `READY`, `SERVED`, `PAID`).
- `PATCH /api/orders/:id/assign` — Assign a chef and/or bartender to an order.
- `PATCH /api/orders/:id/waiter` — Assign a primary waiter to an order.

#### 💳 Payments & Feedback
- `POST /api/orders/:orderId/payments` — Record payment transaction (Card, Bank Transfer, Cash).
- `POST /api/orders/:orderId/rating` — Submit 1-5 star customer review with optional remarks.
- `POST /api/orders/:orderId/complaints` — File a service or food quality complaint.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or later (Node 20+ recommended)
- **npm**: v9.0.0 or later (or yarn / pnpm)
- **PostgreSQL Database**: Local PostgreSQL instance OR a free cloud database like [Neon](https://neon.tech/)

---

### 1. Clone and Install Dependencies

Clone the repository to your local machine:
```bash
git clone https://github.com/Victor-430/Chowly.git
cd Chowly
```

Install root, client, and server dependencies:
```bash
# Install root tooling
npm install

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
cd ..
```

---

### 2. Environment Configuration

#### Backend Environment (`server/.env`)
Create a `.env` file in the `server/` directory:

```env
# Database Connection (Neon or local PostgreSQL)
DATABASE_URL="postgresql://username:password@ep-sample-pool.us-east-2.aws.neon.tech/chowly?sslmode=require"

# Server Port
PORT=5000

# Allowed Frontend Origins (CORS)
FRONTEND_URL="http://localhost:5173"
```

#### Frontend Environment (`client/.env`)
Create a `.env` file in the `client/` directory:

```env
# Backend API Base URL
VITE_API_URL="http://localhost:5000/api"
```

---

### 3. Database Setup & Seeding

Navigate to the `server/` folder to generate the Prisma client, apply database migrations, and populate initial data:

```bash
cd server

# Generate Prisma Client
npm run prisma:generate

# Push schema changes or run migrations
npm run prisma:migrate

# Seed restaurant, tables (1-15), menu items, and staff members
npm run seed

cd ..
```

> **Note:** The seeder creates *"The Grill House"* restaurant, 15 tables, categorized meals/drinks/desserts, and sample staff (waiters, chefs, bartenders).

---

### 4. Running the Development Servers

You can run both servers concurrently or in separate terminal windows:

#### Option A: Run Both Together (Root)
From the root project directory:
```bash
npm run dev:client
```
*(In a second terminal)*:
```bash
npm run dev:server
```

#### Option B: Run Individually
- **Client Application:**
  ```bash
  cd client
  npm run dev
  ```
  App will be running at 👉 **`http://localhost:5173`**

- **Server Application:**
  ```bash
  cd server
  npm run dev
  ```
  API server will be running at 👉 **`http://localhost:5000`**  
  Swagger documentation at 👉 **`http://localhost:5000/api/docs`**

---

## 📴 Offline / Standalone Demo Mode

Chowly is engineered with zero-friction development in mind. If you run the frontend without starting the backend or without configuring a PostgreSQL database:
- The frontend client detects network unavailability and **automatically falls back to rich mock data**.
- You can freely browse menus, select tables, place orders, advance through the live timeline, simulate payments, and test waiter assignments.
- All state changes persist smoothly in-memory within the Zustand stores for the duration of your session.

---

## 🌐 Production Deployment

### Client Deployment (Vercel / Netlify)

The client is configured for Single Page Application (SPA) routing:

#### Deploying on Vercel:
1. Connect your GitHub repository to Vercel.
2. Set the **Root Directory** to `client` (or use the root `vercel.json` rewrite configuration).
3. Set **Build Command** to `npm run build` and **Output Directory** to `dist`.
4. Set the environment variable:
   - `VITE_API_URL`: Your deployed backend API URL (e.g. `https://chowly-api.onrender.com/api`).
5. Vercel automatically honors `vercel.json` rewrites to redirect all subroutes (`/customer`, `/waiter`, `/restaurant/:id`) to `index.html`.

#### Deploying on Netlify:
The `client/public/_redirects` file is pre-configured:
```text
/*    /index.html   200
```
This ensures direct URL navigation and browser refreshes on subroutes never trigger 404 errors.

---

### Server Deployment (Render / Railway / VPS)

1. Deploy the `server/` directory as a Node.js web service.
2. Set build command:
   ```bash
   npm install && npm run prisma:generate && npm run build
   ```
3. Set start command:
   ```bash
   npm run start
   ```
4. Configure environment variables in the host dashboard:
   - `DATABASE_URL`: PostgreSQL connection string (with SSL mode required for cloud DBs).
   - `PORT`: Port assigned by host (e.g., `5000` or `10000`).
   - `FRONTEND_URL`: The URL of your deployed client application (for CORS whitelist).

---

## 💡 Troubleshooting & Windows Development Tips

### Windows PowerShell Scripts
On Windows systems, command execution of npm packages may require running via `cmd /c`:
```powershell
cmd /c "npm run dev"
```

### Git Index Corruption Recovery
If an interrupted build or lock produces `fatal: .git/index: index file smaller than expected`, execute:
```powershell
cmd /c "del .git\index && git reset"
```

### Direct Page Refresh 404s
If refreshing subroutes like `/customer/menu` returns a 404 on your hosting provider, verify that SPA rewrite rules (`vercel.json` or `_redirects`) are active. Both configurations are included in this repository.

---

## 📄 Contributing & License

Contributions, issue reports, and feature requests are welcome! Feel free to open an issue or submit a pull request.

This project is licensed under the [MIT License](LICENSE).

