const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

export const db = globalForPrisma.prisma ?? {} as any;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
