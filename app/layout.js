import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";

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
    <ClerkProvider>
      <AppContextProvider>
        <html lang="en">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <body className={`${inter.className} antialiased`}>
              <Toaster
                toastOptions={{
                  success: { style: { background: "black", color: "white" } },
                  error: { style: { background: "black", color: "white" } },
                }}
              />
              {children}
            </body>
          </ThemeProvider>
        </html>
      </AppContextProvider>
    </ClerkProvider>
  );
}
