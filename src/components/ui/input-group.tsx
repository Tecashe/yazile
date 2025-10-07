import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const InputGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full items-center rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className,
      )}
      {...props}
    />
  ),
)
InputGroup.displayName = "InputGroup"

const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "inline-start" | "inline-end" | "block-start" | "block-end"
  }
>(({ className, align = "inline-start", ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 px-3 text-muted-foreground", align === "inline-end" && "order-2", className)}
    {...props}
  />
))
InputGroupAddon.displayName = "InputGroupAddon"

const InputGroupButton = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "ghost", size = "sm", ...props }, ref) => (
    <Button ref={ref} variant={variant} size={size} className={cn("h-auto", className)} {...props} />
  ),
)
InputGroupButton.displayName = "InputGroupButton"

const InputGroupInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      data-slot="input-group-control"
      className={cn("flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0", className)}
      {...props}
    />
  ),
)
InputGroupInput.displayName = "InputGroupInput"

const InputGroupText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
InputGroupText.displayName = "InputGroupText"

const InputGroupTextarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<typeof Textarea>>(
  ({ className, ...props }, ref) => (
    <Textarea
      ref={ref}
      data-slot="input-group-control"
      className={cn("flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0", className)}
      {...props}
    />
  ),
)
InputGroupTextarea.displayName = "InputGroupTextarea"

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea }
