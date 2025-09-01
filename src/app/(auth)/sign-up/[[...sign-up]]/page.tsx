
// import { SignUp } from "@clerk/nextjs"
// import Link from "next/link"

// type Props = {
//   searchParams?: { ref?: string }
// }

// const Page = ({ searchParams }: Props) => {
//   const referralCode = searchParams?.ref || ""

//   // Store the referral code in localStorage for later use
//   if (typeof window !== "undefined" && referralCode) {
//     localStorage.setItem("referralCode", referralCode)
//   }

//   return (
//     <div className="flex flex-col items-center max-w-md mx-auto space-y-6 py-2">
//       <div className="text-center space-y-2 w-full">
//         <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//           Get Started
//         </h1>
//         <p className="text-muted-foreground text-sm mx-auto max-w-sm">
//           Create your account to automate Instagram DMs and grow your business
//           {referralCode && (
//             <span className="block mt-2 text-primary font-medium">Using referral code: {referralCode}</span>
//           )}
//         </p>
//       </div>

//       <div className="w-full">
//         <SignUp
//           appearance={{
//             elements: {
//               formButtonPrimary:
//                 "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl border-0",
//               card: "bg-card/50 backdrop-blur-xl shadow-2xl border border-border/50 rounded-xl",
//               headerTitle: "text-foreground font-bold",
//               headerSubtitle: "text-muted-foreground",
//               formFieldLabel: "text-foreground font-medium",
//               formFieldInput:
//                 "bg-background/50 border border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-200 backdrop-blur-sm",
//               footerActionLink: "text-primary hover:text-primary/80 transition-colors",
//               identityPreviewText: "text-foreground",
//               identityPreviewEditButton: "text-primary hover:text-primary/80 transition-colors",
//               formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground transition-colors",
//               dividerLine: "bg-border",
//               dividerText: "text-muted-foreground",
//               formFieldWarning: "text-yellow-500",
//               formFieldError: "text-destructive",
//               socialButtonsBlockButton:
//                 "border border-border hover:border-primary/50 bg-background/50 hover:bg-background/80 transition-all duration-200 backdrop-blur-sm",
//               socialButtonsBlockButtonText: "text-foreground font-medium",
//               socialButtonsBlockButtonArrow: "text-muted-foreground",
//               formFieldSuccessText: "text-green-500",
//               formFieldInfoText: "text-blue-500",
//               formHeaderTitle: "text-foreground",
//               formHeaderSubtitle: "text-muted-foreground",
//               modalContent: "bg-background border border-border rounded-xl shadow-2xl",
//               modalCloseButton: "text-muted-foreground hover:text-foreground",
//             },
//             layout: {
//               socialButtonsPlacement: "bottom",
//               showOptionalFields: false,
//             },
//           }}
//         />
//       </div>

//       <div className="w-full space-y-4">
//         <div className="text-center px-4">
//           <p className="text-xs text-muted-foreground max-w-sm mx-auto">
//             By signing up, you agree to our{" "}
//             <Link href="/terms" className="text-primary hover:text-primary/80 underline transition-colors">
//               Terms of Service
//             </Link>{" "}
//             and{" "}
//             <Link href="/privacy" className="text-primary hover:text-primary/80 underline transition-colors">
//               Privacy Policy
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Page
import { SignUp } from "@clerk/nextjs"
import Link from "next/link"

type Props = {
  searchParams?: { ref?: string }
}

const Page = ({ searchParams }: Props) => {
  const referralCode = searchParams?.ref || ""

  // Store the referral code in localStorage for later use
  if (typeof window !== "undefined" && referralCode) {
    localStorage.setItem("referralCode", referralCode)
  }

  return (
    <div className="flex flex-col items-center space-y-6 py-2">
      <div className="text-center space-y-2 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Get Started
        </h1>
        <p className="text-muted-foreground text-sm">
          Create your account to get started
          {referralCode && (
            <span className="block mt-2 text-foreground font-medium">
              Using referral code: {referralCode}
            </span>
          )}
        </p>
      </div>

      <div className="w-full">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-foreground hover:bg-foreground/90 text-background font-semibold py-2.5 px-4 rounded-lg transition-all duration-200",
              card: "bg-card border border-border",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              formFieldLabel: "text-foreground",
              formFieldInput:
                "bg-background border border-border focus:border-foreground text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-200",
              footerActionLink: "text-muted-foreground hover:text-foreground",
              identityPreviewText: "text-foreground",
              identityPreviewEditButton: "text-muted-foreground hover:text-foreground",
              formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
              formFieldWarning: "text-yellow-500",
              formFieldError: "text-red-500",
              socialButtonsBlockButton:
                "border border-border hover:border-foreground bg-background hover:bg-card transition-all duration-200",
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

      <div className="w-full">
        <div className="text-center px-4">
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-foreground hover:text-foreground/80 underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-foreground hover:text-foreground/80 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page