"use client";

import { useEffect, useState } from "react";
import CustomUserButton from "../CustomUserButton";

export default function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Trang chủ</h1>
          </div>
          <div className="flex items-center">
            <CustomUserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
