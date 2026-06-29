"use client";

import { motion } from "motion/react";
import Counter from "@/components/ui/reactbits/Counter";
import BlurText from "@/components/ui/reactbits/BlurText";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  className?: string;
}

export function DashboardCard({
  title,
  value,
  icon,
  description,
  className,
}: DashboardCardProps) {
  const numericValue = typeof value === "string" ? parseInt(value.replace(/\D/g, "")) || 0 : value;
  const isNumeric = typeof value === "number" || /^\d/.test(String(value));

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm p-6",
        className
      )}
    >
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <BlurText
          text={title}
          className="text-sm font-medium text-muted-foreground"
          delay={50}
          animateBy="words"
          direction="top"
        />
        <motion.div
          whileHover={{ rotate: 15, scale: 1.15 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          {icon}
        </motion.div>
      </div>
      <div>
        {isNumeric ? (
          <Counter
            value={numericValue}
            fontSize={28}
            padding={4}
            gap={2}
            textColor="var(--color-foreground)"
            fontWeight="700"
            gradientHeight={12}
            gradientFrom="var(--color-card)"
            gradientTo="transparent"
            borderRadius={6}
            horizontalPadding={0}
          />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground pt-1">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
