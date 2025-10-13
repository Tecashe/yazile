



import type { Metadata } from "next";
import ReactQueryProvider from '@/providers/react-query-provider'
import ReduxProvider from '@/providers/redux-provider'
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'

import { ThemeProvider } from "@/components/providers/theme-provider"
// import { Toaster } from "@/components/ui/toaster"
import {Toaster} from "sonner"
import { NotificationProvider } from "@/contexts/notification-context";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yazzil | Automate > Engage > Grow",
  description: "Next-Level Business Automations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <NotificationProvider>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning className={inter.className}
        
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          
          <ReduxProvider>
              <ReactQueryProvider> 
                {children}
              </ReactQueryProvider>
            </ReduxProvider>
           <Toaster position="top-right" />
          </ThemeProvider>
          </body>
      </html>
      </NotificationProvider>
    </ClerkProvider>
    
  );
}







