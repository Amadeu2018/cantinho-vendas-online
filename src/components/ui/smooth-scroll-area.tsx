
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"

interface SmoothScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  orientation?: "vertical" | "horizontal" | "both"
  showScrollbar?: boolean
  fadeEdges?: boolean
}

const SmoothScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  SmoothScrollAreaProps
>(({ className, children, orientation = "vertical", showScrollbar = true, fadeEdges = false, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport 
      className={cn(
        "h-full w-full rounded-[inherit] scroll-smooth",
        fadeEdges && "mask-fade"
      )}
      style={{
        scrollBehavior: 'smooth',
        WebkitScrollBehavior: 'smooth'
      }}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    {showScrollbar && orientation !== "horizontal" && (
      <SmoothScrollBar />
    )}
    {showScrollbar && orientation !== "vertical" && (
      <SmoothScrollBar orientation="horizontal" />
    )}
    {showScrollbar && orientation === "both" && (
      <>
        <SmoothScrollBar />
        <SmoothScrollBar orientation="horizontal" />
      </>
    )}
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))

const SmoothScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-all duration-300 ease-out",
      "hover:bg-muted/30 data-[state=visible]:animate-in data-[state=hidden]:animate-out",
      "data-[state=visible]:fade-in-0 data-[state=hidden]:fade-out-0",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px] hover:w-3",
      orientation === "horizontal" &&
        "h-2.5 w-full flex-col border-t border-t-transparent p-[1px] hover:h-3",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb 
      className="relative flex-1 rounded-full bg-border/60 hover:bg-border transition-colors duration-200" 
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))

SmoothScrollArea.displayName = "SmoothScrollArea"
SmoothScrollBar.displayName = "SmoothScrollBar"

export { SmoothScrollArea, SmoothScrollBar }
