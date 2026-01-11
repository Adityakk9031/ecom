# NextStore

A full-stack Next.js E-commerce application that merges external product data (FakeStore API) with a local PostgreSQL database.

## Features

- **Hybrid Catalog**: define products in your local database AND fetch live products from an external API.
- **Resilient Architecture**: Gracefully degrades to show only external products if the database is unreachable.
- **Client-Side Cart**: Persistent shopping cart using `localStorage`.
- **Admin Dashboard**:
  - Add new products to the local validated database.
  - View recent orders.
  - Unified "All Products" view.
- **Modern UI**: Built with Tailwind CSS, responsive and dark-mode compatible.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (via Neon.tech)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **API**: FakeStore API (for external data)

## Setup & Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Connect to your PostgreSQL database
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
   
   # Admin Access Token (Accepts ANY value in demo mode)
   ADMIN_TOKEN="supersecretadmintoken"
   ```

3. **Database Setup**
   Push the schema to your database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Admin Access

- Log in at `/admin`.
- **Token**: Accepts any string (currently relaxed for testing). Default hint: `supersecretadmintoken`.
- **Capabilities**:
  - **Add Product**: Creates a new product in the local SQL database.
  - **View Orders**: Checks orders placed by users.

## Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components (ProductCard, Navbar).
- `lib/`: Utilities for Prisma and API fetching.
- `prisma/`: Database schema definition.

## Troubleshooting

- **Database Error**: If the DB is down, the Admin panel will warn you, but the main Store page will still work (serving external products).
- **Invisible Text**: If using Dark Mode extensions, some inputs might look odd. The app forces standard text colors to prevent this.
