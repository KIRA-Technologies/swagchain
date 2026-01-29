import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Bitcoin Hoodie",
    description:
      "Premium quality hoodie featuring the iconic Bitcoin logo. Made from 100% organic cotton with a soft fleece lining. Perfect for crypto enthusiasts who want to rep their favorite digital currency in style.",
    price: 89.99,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800",
    ],
    category: "Hoodies",
    keywords: ["bitcoin", "btc", "hoodie", "crypto", "orange"],
    rating: 4.8,
    ratingCount: 156,
    stock: 50,
    featured: true,
  },
  {
    name: "Ethereum Classic Tee",
    description:
      "Minimalist Ethereum logo t-shirt made from premium Pima cotton. Ultra-soft and comfortable for everyday wear. Show your love for the world's second-largest cryptocurrency.",
    price: 39.99,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    ],
    category: "T-Shirts",
    keywords: ["ethereum", "eth", "tshirt", "crypto", "purple"],
    rating: 4.6,
    ratingCount: 89,
    stock: 100,
    featured: true,
  },
  {
    name: "Crypto Dad Hat",
    description:
      "Vintage-style dad hat with embroidered crypto symbols. Adjustable strap for perfect fit. Low profile design for a casual, laid-back look.",
    price: 34.99,
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800",
    ],
    category: "Hats",
    keywords: ["hat", "cap", "crypto", "dad hat", "casual"],
    rating: 4.5,
    ratingCount: 67,
    stock: 75,
    featured: false,
  },
  {
    name: "HODL Coffee Mug",
    description:
      "Start your morning with some crypto motivation. This premium ceramic mug features the legendary HODL motto. Microwave and dishwasher safe. 12oz capacity.",
    price: 24.99,
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800",
    ],
    category: "Mugs",
    keywords: ["hodl", "mug", "coffee", "crypto", "motivation"],
    rating: 4.9,
    ratingCount: 203,
    stock: 200,
    featured: true,
  },
  {
    name: "Solana Snapback",
    description:
      "Premium snapback cap with the Solana gradient logo. High-quality embroidery on durable fabric. Flat brim design with adjustable snap closure.",
    price: 44.99,
    images: [
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800",
    ],
    category: "Hats",
    keywords: ["solana", "sol", "hat", "snapback", "gradient"],
    rating: 4.7,
    ratingCount: 45,
    stock: 60,
    featured: false,
  },
  {
    name: "DeFi Kingdom Hoodie",
    description:
      "Luxurious oversized hoodie celebrating decentralized finance. Features unique artwork and premium heavyweight fleece. Kangaroo pocket and drawstring hood.",
    price: 99.99,
    images: [
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800",
    ],
    category: "Hoodies",
    keywords: ["defi", "hoodie", "kingdom", "premium", "oversized"],
    rating: 4.4,
    ratingCount: 34,
    stock: 30,
    featured: false,
  },
  {
    name: "NFT Creator Tee",
    description:
      "For the digital artists and NFT creators. This shirt features a unique generative art design that celebrates the NFT revolution. Made from organic cotton.",
    price: 44.99,
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800",
    ],
    category: "T-Shirts",
    keywords: ["nft", "art", "creator", "tshirt", "digital"],
    rating: 4.3,
    ratingCount: 78,
    stock: 85,
    featured: false,
  },
  {
    name: "To The Moon Sticker Pack",
    description:
      "Ultimate sticker pack for crypto enthusiasts. Includes 20 high-quality vinyl stickers featuring popular crypto memes and logos. Waterproof and durable.",
    price: 14.99,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    ],
    category: "Stickers",
    keywords: ["stickers", "moon", "meme", "vinyl", "pack"],
    rating: 4.8,
    ratingCount: 312,
    stock: 500,
    featured: true,
  },
  {
    name: "Blockchain Dev Mug",
    description:
      "For the builders of Web3. This mug features code snippets and blockchain terminology. Perfect gift for developers in the crypto space. 14oz capacity.",
    price: 29.99,
    images: [
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800",
    ],
    category: "Mugs",
    keywords: ["developer", "blockchain", "code", "mug", "web3"],
    rating: 4.6,
    ratingCount: 89,
    stock: 150,
    featured: false,
  },
  {
    name: "Crypto Whale Hoodie",
    description:
      "Embrace your inner whale with this premium hoodie. Features a subtle whale design with crypto elements. Heavyweight 400gsm cotton for maximum comfort.",
    price: 109.99,
    images: [
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800",
    ],
    category: "Hoodies",
    keywords: ["whale", "hoodie", "premium", "crypto", "holder"],
    rating: 4.9,
    ratingCount: 45,
    stock: 25,
    featured: false,
  },
  {
    name: "Web3 Laptop Sleeve",
    description:
      "Protect your laptop in style with this Web3-themed sleeve. Fits 13-15 inch laptops. Neoprene material with soft fleece lining. Zippered closure.",
    price: 49.99,
    images: [
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800",
    ],
    category: "Accessories",
    keywords: ["laptop", "sleeve", "web3", "accessories", "protection"],
    rating: 4.5,
    ratingCount: 56,
    stock: 80,
    featured: false,
  },
  {
    name: "Diamond Hands Tee",
    description:
      "Show your unwavering commitment to HODL with this Diamond Hands t-shirt. Premium print quality that won't fade. Available in multiple colors.",
    price: 34.99,
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
    ],
    category: "T-Shirts",
    keywords: ["diamond", "hands", "hodl", "tshirt", "hold"],
    rating: 4.7,
    ratingCount: 134,
    stock: 120,
    featured: false,
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing products
  await prisma.product.deleteMany();
  console.log("📦 Cleared existing products");

  // Create products
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`✅ Created ${products.length} products`);

  // Create an admin user if one doesn't exist
  const adminEmail = process.env.ADMIN_EMAIL || "admin@swagchain.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin User",
        role: "ADMIN",
      },
    });
    console.log(`👤 Created admin user: ${adminEmail}`);
  } else {
    // Update existing user to admin
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: "ADMIN" },
    });
    console.log(`👤 Updated ${adminEmail} to admin`);
  }

  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
