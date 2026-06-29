"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-md animate-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  )
}

interface AlertDialogContentProps {
  children: React.ReactNode
  className?: string
}

function AlertDialogContent({ children, className }: AlertDialogContentProps) {
  return (
    <div
      className={cn(
        "relative mx-4 rounded-xl border bg-card p-6 shadow-lg",
        className
      )}
    >
      {children}
    </div>
  )
}

function AlertDialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2 text-center sm:text-start", className)}>
      {children}
    </div>
  )
}

function AlertDialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6", className)}>
      {children}
    </div>
  )
}

function AlertDialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>
  )
}

function AlertDialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  )
}

function AlertDialogAction({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-destructive text-destructive-foreground px-4 py-2 text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function AlertDialogCancel({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
