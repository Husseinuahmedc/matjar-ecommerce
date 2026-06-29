export async function getBuyerDashboard() {
  return {
    stats: {
      totalOrders: 12,
      pendingOrders: 2,
      deliveredOrders: 8,
      totalSpent: 450000,
      wishlistCount: 5,
    },
    recentOrders: [
      {
        id: "mock-order-1",
        status: "PENDING",
        total: 125000,
        createdAt: new Date("2026-06-20"),
        items: [
          {
            quantity: 2,
            unitPrice: 62500,
            product: {
              titleEn: "Wireless Headphones",
              titleAr: "سماعات لاسلكية",
              images: [{ url: "/placeholder.svg" }],
            },
          },
        ],
        events: [{ status: "PENDING", createdAt: new Date("2026-06-20") }],
      },
    ],
    wishlistItems: [
      {
        id: "mock-wl-1",
        product: {
          id: "mock-prod-1",
          titleEn: "Smart Watch",
          titleAr: "ساعة ذكية",
          price: 89000,
          discountPrice: null,
          images: [{ url: "/placeholder.svg" }],
        },
      },
    ],
    recommendations: [
      {
        id: "mock-rec-1",
        titleEn: "Bluetooth Speaker",
        titleAr: "مكبر صوت بلوتوث",
        price: 45000,
        discountPrice: null,
        slug: "bluetooth-speaker",
        images: [{ url: "/placeholder.svg" }],
        category: { nameEn: "Electronics", nameAr: "إلكترونيات" },
      },
    ],
    hasShippedOrders: false,
    profile: {
      fullName: "Demo User",
      email: "demo@example.com",
      memberSince: new Date("2026-01-01"),
      totalSpent: 450000,
      rewardPoints: 150,
    },
  };
}

export async function getRecentOrders(_userId: string) {
  return [];
}

export async function getOrdersWithReviews(_userId: string) {
  return new Set<string>();
}

export async function getWishlist(_userId: string) {
  return [];
}

export async function getRecommendations() {
  return [];
}
