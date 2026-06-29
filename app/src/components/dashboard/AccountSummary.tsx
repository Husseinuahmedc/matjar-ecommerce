"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui/base";
import { formatPrice } from "@/lib/utils";
import { User, Calendar, Wallet, Trophy } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface AccountSummaryProps {
  fullName?: string;
  email?: string;
  memberSince?: Date;
  totalSpent: number;
  rewardPoints: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.3, ease: "easeOut" as const },
  }),
};

export function AccountSummary({
  fullName,
  email,
  memberSince,
  totalSpent,
  rewardPoints,
}: AccountSummaryProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <motion.div whileHover={{ rotate: 15 }}>
            <User className="h-5 w-5 text-primary" />
          </motion.div>
          {t("accountSummary")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-1"
        >
          <p className="text-sm font-medium text-muted-foreground">{t("personalDetails")}</p>
          <div className="mt-1">
            <p className="font-bold text-lg">{fullName || "User"}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">
                {t("memberSince")}
              </p>
              <p className="text-sm font-semibold">
                {memberSince
                  ? new Intl.DateTimeFormat(locale, {
                      year: "numeric",
                      month: "short",
                    }).format(new Date(memberSince))
                  : "-"}
              </p>
            </div>
          </motion.div>

          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">
                {t("totalSpent")}
              </p>
              <p className="text-sm font-semibold">{formatPrice(totalSpent)}</p>
            </div>
          </motion.div>

          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10 sm:col-span-2"
          >
            <div className="h-10 w-10 rounded-full bg-yellow-400/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">
                {t("rewardPoints")}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-yellow-600">{rewardPoints} {t("pts")}</p>
                <Badge variant="success" className="text-[10px] h-5">
                  {t("goldMember")}
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
