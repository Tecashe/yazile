// import * as React from "react"
// import { cva, type VariantProps } from "class-variance-authority"

// import { cn } from "@/lib/utils"

// const badgeVariants = cva(
//   "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
//   {
//     variants: {
//       variant: {
//         default:
//           "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
//         secondary:
//           "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
//         destructive:
//           "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
//         outline: "text-foreground",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//     },
//   }
// )

// export interface BadgeProps
//   extends React.HTMLAttributes<HTMLDivElement>,
//     VariantProps<typeof badgeVariants> {}

// function Badge({ className, variant, ...props }: BadgeProps) {
//   return (
//     <div className={cn(badgeVariants({ variant }), className)} {...props} />
//   )
// }

// export { Badge, badgeVariants }

// import * as React from "react"
// import { cva, type VariantProps } from "class-variance-authority"
// import { CheckCircle, AlertCircle, Info, Bell, Clock } from "lucide-react"

// import { cn } from "@/lib/utils"

// const badgeVariants = cva(
//   "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
//   {
//     variants: {
//       variant: {
//         default:
//           "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
//         secondary:
//           "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
//         destructive:
//           "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
//         outline: "text-foreground",
//         success:
//           "border-transparent bg-emerald-500 text-white shadow hover:bg-emerald-600",
//         warning:
//           "border-transparent bg-amber-500 text-white shadow hover:bg-amber-600",
//         info:
//           "border-transparent bg-blue-500 text-white shadow hover:bg-blue-600",
//         pending:
//           "border-transparent bg-purple-500 text-white shadow hover:bg-purple-600",
//       },
//       size: {
//         sm: "px-2 py-0.25 text-xs",
//         default: "px-2.5 py-0.5 text-xs",
//         lg: "px-3 py-1 text-sm",
//       },
//       animation: {
//         none: "",
//         pulse: "animate-pulse",
//         bounce: "animate-bounce",
//       },
//       rounded: {
//         default: "rounded-md",
//         full: "rounded-full",
//         none: "rounded-none",
//       },
//       bordered: {
//         true: "border-2",
//         false: "border",
//       },
//       elevated: {
//         true: "shadow-md",
//         false: "",
//       }
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//       animation: "none",
//       rounded: "default",
//       bordered: false,
//       elevated: false,
//     },
//     compoundVariants: [
//       {
//         variant: ["success", "warning", "info", "pending"],
//         elevated: true,
//         className: "shadow-lg",
//       }
//     ]
//   }
// )

// // Define variant types for better type safety
// type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

// export interface BadgeProps
//   extends React.HTMLAttributes<HTMLDivElement>,
//     Omit<VariantProps<typeof badgeVariants>, "animation"> {
//   icon?: boolean
//   dismissible?: boolean
//   animated?: boolean | "pulse" | "bounce"
//   tooltipText?: string
// }

// // Fixed function with proper type safety
// const getIconForVariant = (variant: BadgeVariant | undefined) => {
//   if (!variant) return null;
  
//   switch (variant) {
//     case "success":
//       return <CheckCircle className="h-3 w-3" />
//     case "destructive":
//       return <AlertCircle className="h-3 w-3" />
//     case "warning":
//       return <Bell className="h-3 w-3" />
//     case "info":
//       return <Info className="h-3 w-3" />
//     case "pending":
//       return <Clock className="h-3 w-3" />
//     default:
//       return null
//   }
// }

// function Badge({
//   className,
//   variant,
//   size,
//   rounded,
//   bordered,
//   elevated,
//   icon = false,
//   dismissible = false,
//   animated = false,
//   tooltipText,
//   children,
//   ...props
// }: BadgeProps) {
//   const [isVisible, setIsVisible] = React.useState(true)
//   const badgeIcon = icon ? getIconForVariant(variant) : null
  
//   if (!isVisible) return null
  
//   // Convert boolean or string animation to the expected variant
//   const animation = animated === true ? "pulse" : (animated || "none")
  
//   const badgeContent = (
//     <div 
//       className={cn(
//         badgeVariants({ 
//           variant, 
//           size, 
//           animation, 
//           rounded, 
//           bordered, 
//           elevated 
//         }), 
//         className
//       )} 
//       data-tooltip={tooltipText}
//       {...props}
//     >
//       {badgeIcon && <span className="badge-icon">{badgeIcon}</span>}
//       {children}
//       {dismissible && (
//         <button 
//           onClick={() => setIsVisible(false)} 
//           className="ml-1 -mr-1 h-3 w-3 rounded-full text-foreground/60 hover:text-foreground"
//           aria-label="Dismiss"
//         >
//           ×
//         </button>
//       )}
//     </div>
//   )
  
//   // Add tooltip functionality when tooltipText is provided
//   if (tooltipText) {
//     return (
//       <div className="group relative inline-block">
//         {badgeContent}
//         <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
//           {tooltipText}
//           <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform bg-black"></div>
//         </div>
//       </div>
//     )
//   }
  
//   return badgeContent
// }

// export { Badge, badgeVariants }

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircle, AlertCircle, Info, Bell, Clock } from "lucide-react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-emerald-500 text-white shadow hover:bg-emerald-600",
        warning:
          "border-transparent bg-amber-500 text-white shadow hover:bg-amber-600",
        info:
          "border-transparent bg-blue-500 text-white shadow hover:bg-blue-600",
        pending:
          "border-transparent bg-purple-500 text-white shadow hover:bg-purple-600",
      },
      size: {
        sm: "px-2 py-0.25 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
      bordered: {
        true: "border-2",
        false: "border",
      },
      elevated: {
        true: "shadow-md",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
      rounded: "default",
      bordered: false,
      elevated: false,
    },
    compoundVariants: [
      {
        variant: ["success", "warning", "info", "pending"],
        elevated: true,
        className: "shadow-lg",
      }
    ]
  }
)

// Define variant types for better type safety
export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof badgeVariants>, "animation"> {
  icon?: boolean
  dismissible?: boolean
  animated?: boolean | "pulse" | "bounce"
  tooltipText?: string
}

// Fixed function with proper type safety
const getIconForVariant = (variant: BadgeVariant) => {
  switch (variant) {
    case "success":
      return <CheckCircle className="h-3 w-3" />
    case "destructive":
      return <AlertCircle className="h-3 w-3" />
    case "warning":
      return <Bell className="h-3 w-3" />
    case "info":
      return <Info className="h-3 w-3" />
    case "pending":
      return <Clock className="h-3 w-3" />
    default:
      return null
  }
}

function Badge({
  className,
  variant,
  size,
  rounded,
  bordered,
  elevated,
  icon = false,
  dismissible = false,
  animated = false,
  tooltipText,
  children,
  ...props
}: BadgeProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  
  // Fix: Only call getIconForVariant when both icon is true and variant is defined
  const badgeIcon = icon && variant ? getIconForVariant(variant) : null
  
  if (!isVisible) return null
  
  // Convert boolean or string animation to the expected variant
  const animation = animated === true ? "pulse" : (animated || "none")
  
  const badgeContent = (
    <div 
      className={cn(
        badgeVariants({ 
          variant, 
          size, 
          animation, 
          rounded, 
          bordered, 
          elevated 
        }), 
        className
      )} 
      data-tooltip={tooltipText}
      {...props}
    >
      {badgeIcon && <span className="badge-icon">{badgeIcon}</span>}
      {children}
      {dismissible && (
        <button 
          onClick={() => setIsVisible(false)} 
          className="ml-1 -mr-1 h-3 w-3 rounded-full text-foreground/60 hover:text-foreground"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  )
  
  // Add tooltip functionality when tooltipText is provided
  if (tooltipText) {
    return (
      <div className="group relative inline-block">
        {badgeContent}
        <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
          {tooltipText}
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform bg-black"></div>
        </div>
      </div>
    )
  }
  
  return badgeContent
}

export { Badge, badgeVariants }