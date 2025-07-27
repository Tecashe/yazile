
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

import { SignIn } from "@clerk/nextjs"

type Props = {}

const Page = (props: Props) => {
  return (
    <div className="flex flex-col items-center max-w-md mx-auto space-y-6 py-2">
      <div className="text-center space-y-2 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Welcome Back!
        </h1>
        <p className="text-muted-foreground">Sign in to continue to your dashboard</p>
      </div>

      <div className="w-full">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl border-0",
              card: "bg-card/50 backdrop-blur-xl shadow-2xl border border-border/50 rounded-xl",
              headerTitle: "text-foreground font-bold",
              headerSubtitle: "text-muted-foreground",
              formFieldLabel: "text-foreground font-medium",
              formFieldInput:
                "bg-background/50 border border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-200 backdrop-blur-sm",
              footerActionLink: "text-primary hover:text-primary/80 transition-colors",
              identityPreviewText: "text-foreground",
              identityPreviewEditButton: "text-primary hover:text-primary/80 transition-colors",
              formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground transition-colors",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
              formFieldWarning: "text-yellow-500",
              formFieldError: "text-destructive",
              socialButtonsBlockButton:
                "border border-border hover:border-primary/50 bg-background/50 hover:bg-background/80 transition-all duration-200 backdrop-blur-sm",
              socialButtonsBlockButtonText: "text-foreground font-medium",
              socialButtonsBlockButtonArrow: "text-muted-foreground",
              formFieldSuccessText: "text-green-500",
              formFieldInfoText: "text-blue-500",
              formHeaderTitle: "text-foreground",
              formHeaderSubtitle: "text-muted-foreground",
              modalContent: "bg-background border border-border rounded-xl shadow-2xl",
              modalCloseButton: "text-muted-foreground hover:text-foreground",
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

export default Page


