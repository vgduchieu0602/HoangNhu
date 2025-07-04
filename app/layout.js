import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";

import { AppContextProvider } from "@/context/AppContext";
import { PromptProvider } from "@/context/PromptContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Hoàng Như",
  description: "Full Stack Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ClerkProvider>
          <AppContextProvider>
            <PromptProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Toaster
                  toastOptions={{
                    success: { style: { background: "black", color: "white" } },
                    error: { style: { background: "black", color: "white" } },
                  }}
                />
                {children}
              </ThemeProvider>
            </PromptProvider>
          </AppContextProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
