
// import { SignIn } from "@clerk/nextjs"

// type Props = {}

// const Page = (props: Props) => {
//   return (
//     <div className="flex flex-col items-center max-w-md mx-auto space-y-6 py-2">
//       <div className="text-center space-y-2 w-full">
//         <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome Back!</h1>
//       </div>

//       <div className="w-full">
//         <SignIn
//           appearance={{
//             elements: {
//               formButtonPrimary:
//                 "bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-gray-900/25 hover:shadow-gray-800/40",
//               card: "bg-gray-900 shadow-xl border border-gray-800",
//               headerTitle: "text-white",
//               headerSubtitle: "text-white/70",
//               formFieldLabel: "text-white/90",
//               formFieldInput:
//                 "bg-gray-800/50 border-2 border-gray-700 focus:border-gray-600 text-white placeholder:text-white/40 rounded-lg transition-all duration-200",
//               footerActionLink: "text-gray-400 hover:text-white",
//               identityPreviewText: "text-white",
//               identityPreviewEditButton: "text-gray-400 hover:text-white",
//               formFieldInputShowPasswordButton: "text-white/60 hover:text-white",
//               dividerLine: "bg-gray-700",
//               dividerText: "text-gray-500",
//               formFieldWarning: "text-amber-500",
//               formFieldError: "text-red-500",
//               socialButtonsBlockButton:
//                 "border-2 border-gray-700 hover:border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200",
//               socialButtonsBlockButtonText: "text-white font-medium",
//               socialButtonsBlockButtonArrow: "text-white/60",
//             },
//             layout: {
//               socialButtonsPlacement: "bottom",
//               showOptionalFields: false,
//             },
//           }}
//         />
//       </div>
//     </div>
//   )
// }

// export default Page

// import { SignIn } from "@clerk/nextjs"

// type Props = {}

// const Page = (props: Props) => {
//   return (
//     <div className="flex flex-col items-center space-y-6 py-2">
//       <div className="text-center space-y-2 w-full">
//         <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
//           Welcome Back!
//         </h1>
//       </div>

//       <div className="w-full">
//         <SignIn
//           appearance={{
//             elements: {
//               formButtonPrimary:
//                 "bg-foreground hover:bg-foreground/90 text-background font-semibold py-2.5 px-4 rounded-lg transition-all duration-200",
//               card: "bg-card border border-border",
//               headerTitle: "text-foreground",
//               headerSubtitle: "text-muted-foreground",
//               formFieldLabel: "text-foreground",
//               formFieldInput:
//                 "bg-background border border-border focus:border-foreground text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-200",
//               footerActionLink: "text-muted-foreground hover:text-foreground",
//               identityPreviewText: "text-foreground",
//               identityPreviewEditButton: "text-muted-foreground hover:text-foreground",
//               formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
//               dividerLine: "bg-border",
//               dividerText: "text-muted-foreground",
//               formFieldWarning: "text-yellow-500",
//               formFieldError: "text-red-500",
//               socialButtonsBlockButton:
//                 "border border-border hover:border-foreground bg-background hover:bg-card transition-all duration-200",
//               socialButtonsBlockButtonText: "text-foreground",
//               socialButtonsBlockButtonArrow: "text-muted-foreground",
//             },
//             layout: {
//               socialButtonsPlacement: "bottom",
//               showOptionalFields: false,
//             },
//           }}
//         />
//       </div>
//     </div>
//   )
// }

// export default Page

// Enhanced SignIn Component
// SignIn Component
import { SignIn } from "@clerk/nextjs"

type Props = {}

const SignInPage = (props: Props) => {
  return (
    <div className="flex flex-col items-center space-y-6 py-2">
      <div className="text-center space-y-2 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Welcome Back!
        </h1>
      </div>

      <div className="w-full">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition-all duration-200",
              
              card: "bg-card border-2 border-border shadow-lg",
              
              headerTitle: "text-foreground font-bold",
              
              headerSubtitle: "text-muted-foreground",
              
              formFieldLabel: "text-foreground font-medium",
              
              formFieldInput:
                "bg-input border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-200 hover:border-primary/50",
              
              footerActionLink: "text-primary hover:text-primary/80",
              
              identityPreviewText: "text-foreground",
              
              identityPreviewEditButton: "text-muted-foreground hover:text-foreground",
              
              formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
              
              dividerLine: "bg-border",
              
              dividerText: "text-muted-foreground",
              
              formFieldError: "text-destructive",
              
              socialButtonsBlockButton:
                "border-2 border-border hover:border-primary bg-card hover:bg-accent transition-all duration-200",
              
              socialButtonsBlockButtonText: "text-foreground",
              
              socialButtonsBlockButtonArrow: "text-muted-foreground",
            },
            layout: {
              socialButtonsPlacement: "bottom",
              showOptionalFields: false,
            },
          }}
        />
      </div>
    </div>
  )
}

export default SignInPage

// ============================================

