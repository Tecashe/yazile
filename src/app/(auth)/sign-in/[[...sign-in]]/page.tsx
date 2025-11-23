
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
//               formFieldWarning: "text-yellow",
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
//               card: "bg-card border border-foreground/20",
//               headerTitle: "text-foreground",
//               headerSubtitle: "text-muted-foreground",
//               formFieldLabel: "text-foreground",
//               formFieldInput:
//                 "bg-background border-2 border-foreground/30 focus:border-foreground text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-200 hover:border-foreground/50",
//               footerActionLink: "text-muted-foreground hover:text-foreground",
//               identityPreviewText: "text-foreground",
//               identityPreviewEditButton: "text-muted-foreground hover:text-foreground",
//               formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
//               dividerLine: "bg-foreground/20",
//               dividerText: "text-muted-foreground",
//               formFieldWarning: "text-yellow",
//               formFieldError: "text-red-500",
//               socialButtonsBlockButton:
//                 "border-2 border-foreground/30 hover:border-foreground bg-background hover:bg-card transition-all duration-200",
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

// SignIn Page Component
// import { SignIn } from "@clerk/nextjs"

// type Props = {}

// const Page = (props: Props) => {
//   return (
//     <div className="flex flex-col items-center space-y-6 py-2 bg-neutral-950 min-h-screen">
//       <div className="text-center space-y-2 w-full">
//         <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
//           Welcome Back!
//         </h1>
//       </div>

//       <div className="w-full">
//         <SignIn
//           appearance={{
//             elements: {
//               formButtonPrimary:
//                 "bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl",
//               card: "bg-neutral-900 border border-neutral-700 shadow-2xl rounded-xl",
//               headerTitle: "text-neutral-100",
//               headerSubtitle: "text-neutral-400",
//               formFieldLabel: "text-neutral-200",
//               formFieldInput:
//                 "bg-neutral-800 border-2 border-neutral-600 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/20 text-neutral-100 placeholder:text-neutral-500 rounded-lg transition-all duration-200 hover:border-neutral-500",
//               footerActionLink: "text-neutral-400 hover:text-neutral-200",
//               identityPreviewText: "text-neutral-200",
//               identityPreviewEditButton: "text-neutral-400 hover:text-neutral-200",
//               formFieldInputShowPasswordButton: "text-neutral-400 hover:text-neutral-200",
//               dividerLine: "bg-neutral-700",
//               dividerText: "text-neutral-500",
//               formFieldWarning: "text-yellow-400",
//               formFieldError: "text-red-400",
//               socialButtonsBlockButton:
//                 "border-2 border-neutral-700 hover:border-neutral-500 bg-neutral-800 hover:bg-neutral-700 transition-all duration-200",
//               socialButtonsBlockButtonText: "text-neutral-200",
//               socialButtonsBlockButtonArrow: "text-neutral-400",
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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Welcome Back!
        </h1>
        <p className="text-muted-foreground text-sm">
          Sign in to your account
        </p>
      </div>

      {/* SignIn Component */}
      <div className="w-full max-w-sm">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl",
              card: "bg-card/80 backdrop-blur-sm border border-border shadow-2xl rounded-xl",
              headerTitle: "text-card-foreground",
              headerSubtitle: "text-muted-foreground",
              formFieldLabel: "text-card-foreground",
              formFieldInput:
                "bg-background border-2 border-input focus:border-ring focus:ring-2 focus:ring-ring/20 text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-200 hover:border-ring/60",
              footerActionLink: "text-muted-foreground hover:text-foreground",
              identityPreviewText: "text-card-foreground",
              identityPreviewEditButton: "text-muted-foreground hover:text-foreground",
              formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
              formFieldWarning: "text-yellow",
              formFieldError: "text-red-500",
              socialButtonsBlockButton:
                "border-2 border-input hover:border-ring bg-background hover:bg-accent transition-all duration-200",
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

export default Page