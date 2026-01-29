# SwagChain 🔗⚡

A modern crypto-themed ecommerce application built with Next.js 16, featuring Kira-Pay integration for crypto payments.

![SwagChain](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=400&fit=crop)

## Features

### 🛍️ Shop
- Browse crypto-themed merchandise (hoodies, t-shirts, hats, mugs, stickers)
- Search products by name, description, or keywords
- Filter by category, price range, and rating
- Sort by newest, price, or rating

### 👤 User Dashboard
- **Cart**: Add, remove, and update product quantities
- **Orders**: Track order status (Created → Paid → Shipped → Delivered)
- **Likes**: Save favorite products

### 💳 Checkout
- Enter shipping address
- Pay with crypto via Kira-Pay integration
- Secure, single-use payment links

### 🔐 Authentication
- Google OAuth sign-in via NextAuth
- Protected routes for dashboard and checkout

### 🛠️ Admin Panel
- Create, edit, and delete products
- Set product details: name, description, price, images, category, keywords, stock
- Mark products as featured
- Manage order statuses

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (NeonDB) |
| ORM | Prisma 7 |
| Auth | NextAuth v5 (Beta) |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI + Custom shadcn-style |
| Forms | React Hook Form + Zod |
| Payments | Kira-Pay API |
| Animations | Framer Motion |
| Notifications | Sonner |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)
- PostgreSQL database (NeonDB recommended)
- Google OAuth credentials
- Kira-Pay API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/swagchain.git
cd swagchain
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```env
# Database (NeonDB PostgreSQL)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Kira-Pay
KIRA_PAY_API_KEY="your-api-key"
KIRA_PAY_API_URL="https://api.kira-pay.com"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

5. Push the database schema:
```bash
pnpm db:push
```

6. Seed the database with sample products:
```bash
pnpm db:seed
```

7. Start the development server:
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Database Management

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed database
pnpm db:seed

# Open Prisma Studio
pnpm db:studio
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (admin)/           # Admin panel routes
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # User dashboard routes
│   ├── api/               # API routes
│   ├── order/             # Order success page
│   └── product/           # Product detail page
├── actions/               # Server actions
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── cart/             # Cart components
│   ├── checkout/         # Checkout components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components
│   ├── products/         # Product components
│   ├── shared/           # Shared components
│   └── ui/               # UI primitives
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── auth.ts          # NextAuth configuration
│   ├── kira-pay.ts      # Kira-Pay API wrapper
│   ├── prisma.ts        # Prisma client
│   └── utils.ts         # Utility functions
└── types/               # TypeScript types
```

## Design System

SwagChain features a custom dark theme with a crypto-native aesthetic:

- **Colors**: Deep space blacks with purple, cyan, and pink accents
- **Typography**: Bold, modern with gradient text effects
- **Cards**: Glass morphism with subtle glows
- **Buttons**: Gradient backgrounds with hover animations
- **Animations**: Floating orbs, shimmer loading states, pulse effects

## Kira-Pay Integration

The checkout flow integrates with Kira-Pay for crypto payments:

1. User fills shipping address
2. Order is created in the database
3. Server calls Kira-Pay API to generate payment link
4. User is redirected to Kira-Pay hosted payment page
5. After payment, user returns to success page
6. Order status is marked as PAID

API endpoint used:
```
POST https://api.kira-pay.com/api/link/generate
Headers: x-api-key: <API_KEY>
Body: { price, customOrderId, redirectUrl, type: "single_use" }
```

## Admin Access

To access the admin panel:

1. Sign in with Google
2. Update your user's role to `ADMIN` in the database:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';
```
3. Or set the `ADMIN_EMAIL` env variable before seeding:
```bash
ADMIN_EMAIL="your-email@gmail.com" pnpm db:seed
```

## License

MIT

---

Built with ❤️ for the crypto community
