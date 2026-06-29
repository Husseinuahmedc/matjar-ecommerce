"use client";

import React, { useTransition } from "react";
import { updateStatus } from "@/actions/products";
import { Button } from "@/components/ui";

interface StatusButtonProps {
  id: string;
  status: "PUBLISHED" | "REJECTED";
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export default function StatusButton({ id, status, children, variant = "default" }: StatusButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    startTransition(async () => {
      await updateStatus(id, status);
    });
  };

  return (
    <Button 
      size="sm" 
      variant={variant} 
      onClick={handleUpdate} 
      disabled={isPending}
    >
      {isPending ? "..." : children}
    </Button>
  );
}
