import { PrismaClient, User, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── Clean existing data (respecting foreign key order) ───────────
  await prisma.review.deleteMany();
  await prisma.orderEvent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.shippingAddress.deleteMany();
  await prisma.user.deleteMany();
  console.log("✓ Cleared existing data");

  // ── Clean Supabase Auth Users ────────────────────────────────────
  const { data: authData } = await supabase.auth.admin.listUsers();
  if (authData?.users) {
    const seedEmails = [
      "admin@matjar.com", "seller@matjar.com", "buyer@matjar.com", "support@matjar.com",
      "admin@souk.com", "seller@souk.com", "buyer@souk.com"
    ];
    for (const u of authData.users) {
      if (u.email && seedEmails.includes(u.email)) {
        await supabase.auth.admin.deleteUser(u.id);
      }
    }
    console.log("✓ Cleared existing seed users from Supabase Auth");
  }

  // ── Users ────────────────────────────────────────────────────────
  const testUsers = [
    { email: "admin@matjar.com", password: "Admin123!", role: "ADMIN", fullName: "أحمد المدير", phone: "+9647701234567" },
    { email: "seller@matjar.com", password: "Seller123!", role: "SELLER", fullName: "محمد التاجر", phone: "+9647709876543" },
    { email: "buyer@matjar.com", password: "Buyer123!", role: "BUYER", fullName: "سارة العميل", phone: "+9647705551234" },
    { email: "support@matjar.com", password: "Support123!", role: "SUPPORT", fullName: "علي الدعم", phone: "+9647701112222" },
  ];

  const createdUsers: Record<string, User> = {};

  for (const u of testUsers) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: {
        fullName: u.fullName,
        role: u.role
      }
    });

    if (error || !data.user) {
      console.error(`❌ Error creating Supabase user ${u.email}:`, error);
      continue;
    }

    const prismaUser = await prisma.user.create({
      data: {
        id: data.user.id,
        email: u.email,
        fullName: u.fullName,
        phone: u.phone,
        role: u.role as UserRole,
      }
    });
    console.log(`✓ Created ${u.role.toLowerCase()}: ${u.email}`);
    createdUsers[u.role] = prismaUser;
  }

  const seller = createdUsers["SELLER"];

  // ── Categories ───────────────────────────────────────────────────
  const electronicsCategory = await prisma.category.create({
    data: {
      nameEn: "Electronics",
      nameAr: "إلكترونيات",
      slug: "electronics",
    },
  });
  console.log(`✓ Created category: ${electronicsCategory.nameEn}`);

  const mensClothingCategory = await prisma.category.create({
    data: {
      nameEn: "Men's Clothing",
      nameAr: "ملابس رجالية",
      slug: "mens-clothing",
    },
  });
  console.log(`✓ Created category: ${mensClothingCategory.nameEn}`);

  const womensClothingCategory = await prisma.category.create({
    data: {
      nameEn: "Women's Clothing",
      nameAr: "ملابس نسائية",
      slug: "womens-clothing",
    },
  });
  console.log(`✓ Created category: ${womensClothingCategory.nameEn}`);

  const jewelryCategory = await prisma.category.create({
    data: {
      nameEn: "Jewelry",
      nameAr: "مجوهرات",
      slug: "jewelry",
    },
  });
  console.log(`✓ Created category: ${jewelryCategory.nameEn}`);

  // ── Products (hardcoded — no fetch, DummyJSON images, IQD prices) ──
  const products = [
    {
      titleEn: "Samsung Gaming Monitor 49\"",
      titleAr: "شاشة سامسونج منحنية للألعاب 49\"",
      descriptionEn: "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side. QUANTUM DOT TECHNOLOGY, HDR support. 144HZ HIGH REFRESH RATE.",
      descriptionAr: "شاشة ألعاب منحنية فائقة العرض 49 بوصة بنسبة 32:9 مع شاشتين 27 بوصة جنباً إلى جنب. تقنية النقاط الكمية، دعم HDR. معدل تحديث عالٍ 144 هرتز.",
      price: 500000,
      stock: 8,
      sku: "FS-1",
      categoryId: electronicsCategory.id,
      images: [
        "https://picsum.photos/seed/macbook-pro-1/800/600.webp",
        "https://picsum.photos/seed/macbook-pro-2/800/600.webp",
      ]
    },
    {
      titleEn: "iPhone 15 Pro",
      titleAr: "آيفون 15 برو",
      descriptionEn: "The ultimate iPhone. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
      descriptionAr: "الآيفون المطلق. مصمم من التيتانيوم ويتميز بشريحة A17 Pro الثورية، وزر إجراء قابل للتخصيص، وأقوى نظام كاميرا في آيفون على الإطلاق.",
      price: 1800000,
      stock: 35,
      sku: "FS-2",
      categoryId: electronicsCategory.id,
      images: [
        "https://picsum.photos/seed/iphone-15-pro-1/800/600.webp",
        "https://picsum.photos/seed/iphone-15-pro-2/800/600.webp",
      ]
    },
    {
      titleEn: "Samsung Galaxy S23",
      titleAr: "سامسونج غالاكسي S23",
      descriptionEn: "Epic nights are now for everyone. Capture the best of the night with Nightography on the Galaxy S23. Plus, enjoy the most powerful processor on a Galaxy smartphone.",
      descriptionAr: "ليالي ملحمية للجميع. التقط أفضل ما في الليل مع تقنية Nightography في غالاكسي S23. بالإضافة إلى ذلك، استمتع بأقوى معالج في هاتف غالاكسي ذكي.",
      price: 1200000,
      stock: 25,
      sku: "FS-3",
      categoryId: electronicsCategory.id,
      images: [
        "https://picsum.photos/seed/samsung-s23-1/800/600.webp",
        "https://picsum.photos/seed/samsung-s23-2/800/600.webp",
      ]
    },
    {
      titleEn: "Nike Air Jordan 1",
      titleAr: "نايكي اير جوردن 1",
      descriptionEn: "The Air Jordan 1 High OG continues to reign as one of the most iconic and beloved sneakers of all time. Features a premium leather upper with classic styling.",
      descriptionAr: "لا يزال حذاء اير جوردن 1 هاي أو جي يتربع على عرش الأحذية الرياضية كأحد أكثر الأحذية الأيقونية والمحبوبة في كل العصور. يتميز بجزء علوي من الجلد الفاخر مع تصميم كلاسيكي.",
      price: 250000,
      stock: 15,
      sku: "FS-4",
      categoryId: mensClothingCategory.id,
      images: [
        "https://picsum.photos/seed/nike-jordan-1/800/600.webp",
        "https://picsum.photos/seed/nike-jordan-2/800/600.webp",
      ]
    },
    {
      titleEn: "Men's Casual Slim Fit Shirt",
      titleAr: "قميص رجالي كاجوال سلم فت",
      descriptionEn: "The color could be slightly different between on the screen and in practice. Detailed size information should be reviewed on the product description.",
      descriptionAr: "قد يختلف اللون قليلاً بين ما يظهر على الشاشة والواقع. يرجى مراجعة معلومات المقاسات التفصيلية في وصف المنتج.",
      price: 35000,
      stock: 45,
      sku: "FS-5",
      categoryId: mensClothingCategory.id,
      images: [
        "https://picsum.photos/seed/mens-shirt-1/800/600.webp",
        "https://picsum.photos/seed/mens-shirt-2/800/600.webp",
      ]
    },
    {
      titleEn: "Women's Floral Dress",
      titleAr: "فستان نسائي بطبعة زهور",
      descriptionEn: "A beautiful floral print dress, perfect for summer days or evening occasions. Features a flattering V-neck and a flowing skirt.",
      descriptionAr: "فستان جميل بطبعة زهور، مثالي لأيام الصيف أو المناسبات المسائية. يتميز برقبة على شكل V وتنورة انسيابية.",
      price: 75000,
      stock: 20,
      sku: "FS-6",
      categoryId: womensClothingCategory.id,
      images: [
        "https://picsum.photos/seed/floral-dress-1/800/600.webp",
        "https://picsum.photos/seed/floral-dress-2/800/600.webp",
      ]
    },
    {
      titleEn: "Gold Diamond Ring",
      titleAr: "خاتم ذهب مع الماس",
      descriptionEn: "A stunning gold ring featuring a brilliant-cut diamond. An elegant piece of jewelry that adds a touch of luxury to any outfit.",
      descriptionAr: "خاتم ذهبي مذهل يتميز بماسة مقطوعة ببراعة. قطعة مجوهرات أنيقة تضفي لمسة من الفخامة على أي مظهر.",
      price: 850000,
      stock: 10,
      sku: "FS-7",
      categoryId: jewelryCategory.id,
      images: [
        "https://picsum.photos/seed/diamond-ring-1/800/600.webp",
      ]
    },
    {
      titleEn: "Portable Power Bank 20000mAh",
      titleAr: "باور بانك محمول 20000 مللي أمبير",
      descriptionEn: "Keep your devices charged on the go with this high-capacity power bank. Features multiple charging ports and fast-charging capabilities.",
      descriptionAr: "حافظ على أجهزتك مشحونة أثناء التنقل مع هذا الباور بانك عالي السعة. يتميز بمنافذ شحن متعددة وإمكانيات الشحن السريع.",
      price: 45000,
      stock: 60,
      sku: "FS-8",
      categoryId: electronicsCategory.id,
      images: [
        "https://picsum.photos/seed/powerbank-1/800/600.webp",
        "https://picsum.photos/seed/powerbank-2/800/600.webp",
      ]
    },
    {
      titleEn: "Sony WH-1000XM5 Headphones",
      titleAr: "سماعات سوني WH-1000XM5",
      descriptionEn: "Industry-leading noise cancellation. Exceptional sound quality and comfortable over-ear design. Up to 30 hours of battery life.",
      descriptionAr: "إلغاء الضوضاء الرائد في الصناعة. جودة صوت استثنائية وتصميم مريح فوق الأذن. عمر بطارية يصل إلى 30 ساعة.",
      price: 350000,
      stock: 30,
      sku: "FS-9",
      categoryId: electronicsCategory.id,
      images: [
        "https://picsum.photos/seed/airpods-pro-1/800/600.webp",
        "https://picsum.photos/seed/airpods-pro-2/800/600.webp",
      ]
    },
    {
      titleEn: "WD External Hard Drive 2TB",
      titleAr: "هارد خارجي محمول WD Elements",
      descriptionEn: "USB 3.0 and USB 2.0 compatibility. Fast data transfers. Improve PC Performance. High Capacity. Formatted NTFS for Windows 10, Windows 8.1, Windows 7.",
      descriptionAr: "متوافق مع USB 3.0 و USB 2.0. نقل بيانات سريع. تحسين أداء الكمبيوتر. سعة عالية. مهيأ بنظام NTFS لأنظمة ويندوز.",
      price: 150000,
      stock: 40,
      sku: "FS-10",
      categoryId: electronicsCategory.id,
      images: [
        "https://picsum.photos/seed/huawei-matebook-1/800/600.webp",
      ]
    },
  ];

  for (const product of products) {
    const slug = product.titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const createdProduct = await prisma.product.create({
      data: {
        titleEn: product.titleEn,
        titleAr: product.titleAr,
        descriptionEn: product.descriptionEn,
        descriptionAr: product.descriptionAr,
        slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
        price: product.price,
        stock: product.stock,
        sku: product.sku,
        status: "PUBLISHED",
        isFeatured: Math.random() > 0.7,
        sellerId: seller.id,
        categoryId: product.categoryId,
        images: {
          create: product.images.map((url, index) => ({
            url: url,
            position: index,
            isPrimary: index === 0,
          })),
        },
      },
    });
    console.log(`✓ Created product: ${createdProduct.titleEn.substring(0, 40)}...`);
  }

  // ── Test Orders for Buyer ────────────────────────────────────────
  const buyer = createdUsers["BUYER"];
  const allProducts = await prisma.product.findMany({ take: 3 });

  if (buyer && allProducts.length >= 2) {
    // Shipping address for the buyer
    const buyerAddress = await prisma.shippingAddress.create({
      data: {
        userId: buyer.id,
        fullName: "سارة العميل",
        phone: "+9647705551234",
        city: "بغداد",
        country: "العراق",
        street: "شارع المتنبي، منطقة الكرادة",
        isDefault: true,
      },
    });

    // ── Order 1: DELIVERED (7 days ago — buyer can leave a review) ──
    const pastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const pastDatePlus1h = new Date(pastDate.getTime() + 60 * 60 * 1000);
    const pastDatePlus2h = new Date(pastDate.getTime() + 2 * 60 * 60 * 1000);
    const pastDatePlus1d = new Date(pastDate.getTime() + 24 * 60 * 60 * 1000);

    const deliveredOrder = await prisma.order.create({
      data: {
        buyerId: buyer.id,
        status: "DELIVERED",
        paymentStatus: "PAID",
        shippingAddressId: buyerAddress.id,
        subtotal: Number(allProducts[0].price) * 2 + Number(allProducts[1].price) * 1,
        shippingCost: 25,
        discount: 0,
        total: Number(allProducts[0].price) * 2 + Number(allProducts[1].price) * 1 + 25,
        createdAt: pastDate,
        updatedAt: pastDatePlus1d,
        items: {
          create: [
            {
              productId: allProducts[0].id,
              quantity: 2,
              unitPrice: allProducts[0].discountPrice ?? allProducts[0].price,
            },
            {
              productId: allProducts[1].id,
              quantity: 1,
              unitPrice: allProducts[1].discountPrice ?? allProducts[1].price,
            },
          ],
        },
        events: {
          create: [
            {
              status: "PENDING",
              actorId: buyer.id,
              createdAt: pastDate,
            },
            {
              status: "CONFIRMED",
              actorId: buyer.id,
              createdAt: pastDatePlus1h,
            },
            {
              status: "PROCESSING",
              actorId: buyer.id,
              createdAt: pastDatePlus1h,
            },
            {
              status: "SHIPPED",
              actorId: buyer.id,
              createdAt: pastDatePlus2h,
            },
            {
              status: "DELIVERED",
              actorId: buyer.id,
              createdAt: pastDatePlus1d,
            },
          ],
        },
      },
    });
    console.log(`✓ Created delivered order #${deliveredOrder.id.slice(-8).toUpperCase()} for buyer`);

    // ── Order 2: PENDING (just created) ─────────────────────────────
    const now = new Date();
    const pendingOrder = await prisma.order.create({
      data: {
        buyerId: buyer.id,
        status: "PENDING",
        paymentStatus: "PENDING",
        shippingAddressId: buyerAddress.id,
        subtotal: Number(allProducts[0].price) * 1,
        shippingCost: 25,
        discount: 0,
        total: Number(allProducts[0].price) * 1 + 25,
        createdAt: now,
        updatedAt: now,
        items: {
          create: [
            {
              productId: allProducts[0].id,
              quantity: 1,
              unitPrice: allProducts[0].discountPrice ?? allProducts[0].price,
            },
          ],
        },
        events: {
          create: [
            {
              status: "PENDING",
              actorId: buyer.id,
              createdAt: now,
            },
          ],
        },
      },
    });
    console.log(`✓ Created pending order #${pendingOrder.id.slice(-8).toUpperCase()} for buyer`);
  } else {
    console.log("⚠ Skipped order seeding: buyer or products not available");
  }

  // ── Summary ──────────────────────────────────────────────────────
  console.log("\n🎉 Seeding complete!");
  console.log(`   Users:      4`);
  console.log(`   Categories: 4`);
  console.log(`   Products:   ${products.length}`);
  console.log(`
╔══════════════════════════════════════════╗
║         TEST ACCOUNTS                    ║
║  admin@matjar.com    / Admin123!         ║
║  seller@matjar.com   / Seller123!        ║
║  buyer@matjar.com    / Buyer123!         ║
║  support@matjar.com  / Support123!       ║
╚══════════════════════════════════════════╝
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
