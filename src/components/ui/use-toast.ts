
// Re-export the toast components and hooks from our custom implementation
// This file simply re-exports from the hooks/use-toast.ts file

import { useToast, toast } from "@/hooks/use-toast"

export { useToast, toast }

export type {
  ToastProps,
  ToastActionElement,
} from "@/components/ui/toast"

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from "@/components/ui/toast"
