"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CustomUserButton = () => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenProfile = () => {
    if (openUserProfile) openUserProfile();
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
          <Avatar className="h-8 w-8 ring-2 ring-gray-200 dark:ring-gray-700">
            <AvatarImage src={user.imageUrl} alt={user.fullName} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-medium">
              {user.firstName?.charAt(0) ||
                user.emailAddresses[0]?.emailAddress?.charAt(0) ||
                "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 p-2 mt-1 ml-2 shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl"
        sideOffset={4}
      >
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 mb-2">
          <Avatar className="h-10 w-10 ring-2 ring-purple-200 dark:ring-purple-700">
            <AvatarImage src={user.imageUrl} alt={user.fullName} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-medium">
              {user.firstName?.charAt(0) ||
                user.emailAddresses[0]?.emailAddress?.charAt(0) ||
                "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {user.fullName || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          onClick={handleOpenProfile}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-colors"
        >
          <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30">
            <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Quản lý tài khoản
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Xem và chỉnh sửa thông tin
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isLoading}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors text-red-600 dark:text-red-400"
        >
          <div className="p-1.5 rounded-md bg-red-100 dark:bg-red-900/30">
            <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {isLoading ? "Đang đăng xuất..." : "Đăng xuất"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Thoát khỏi tài khoản
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomUserButton;
