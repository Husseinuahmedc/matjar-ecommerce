"use client";

import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/base";
import { Link } from "@/i18n/routing";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-muted"
      >
        <Icon className="h-10 w-10 text-muted-foreground" />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mt-4 text-lg font-semibold"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="mt-2 text-sm text-muted-foreground max-w-[300px]"
      >
        {description}
      </motion.p>
      {actionLabel && actionHref && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Button asChild className="mt-6">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
