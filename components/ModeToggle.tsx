"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-6 right-6">
      <div className="relative flex items-center">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative h-8 w-16 rounded-full bg-white/10 backdrop-blur-sm border border-purple-500/80 transition-all duration-300 ease-in-out p-4"
        >
          <div
            className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white transition-all duration-300 ease-in-out flex items-center justify-center ${
              theme === "dark" ? "translate-x-8" : "translate-x-0"
            }`}
          >
            {theme === "dark" ? (
              <Moon className="h-4 w-4 text-purple-600" />
            ) : (
              <Sun className="h-4 w-4 text-purple-600" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
