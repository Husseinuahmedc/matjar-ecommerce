"use client";

import { motion } from "motion/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
} from "@/components/ui/base";
import { OrderStatus } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";

interface Order {
  id: string;
  createdAt: Date;
  status: OrderStatus;
  total: number | string | { toNumber(): number };
}

interface RecentOrdersTableProps {
  orders: Order[];
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: "easeOut" as const },
  }),
};

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "outline";
      case OrderStatus.CONFIRMED:
      case OrderStatus.PROCESSING:
        return "secondary";
      case OrderStatus.SHIPPED:
        return "default";
      case OrderStatus.DELIVERED:
      case OrderStatus.COMPLETED:
        return "success";
      case OrderStatus.CANCELLED:
      case OrderStatus.REFUNDED:
        return "destructive";
      default:
        return "default";
    }
  };

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-[200px] items-center justify-center rounded-md border border-dashed"
      >
        <div className="text-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted"
          >
            <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </motion.div>
          <p className="text-sm text-muted-foreground">{t("noRecentOrders")}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("orderId")}</TableHead>
          <TableHead>{t("date")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead className="text-right">{t("total")}</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order, i) => (
          <motion.tr
            key={order.id}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={rowVariants}
            className="border-b transition-colors hover:bg-muted/50"
          >
            <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
            <TableCell>
              {new Intl.DateTimeFormat(locale, {
                dateStyle: "medium",
              }).format(new Date(order.createdAt))}
            </TableCell>
            <TableCell>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Badge variant={getStatusVariant(order.status)}>
                  {t(`status.${order.status}`)}
                </Badge>
              </motion.div>
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatPrice(Number(order.total))}
            </TableCell>
            <TableCell className="text-right">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/orders/${order.id}`}>{t("view")}</Link>
              </Button>
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
}
