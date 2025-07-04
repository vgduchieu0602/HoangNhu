"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { assets } from "@/assets/assets.js";
import {
  PlusCircle,
  Database,
  FileBarChart2,
  Receipt,
  Gauge,
  BarChart2,
  FileText,
  LayoutDashboard,
} from "lucide-react";

const navigation = [
  {
    name: "Tổng quan",
    // href: "/dashboard/suggested-questions",
    href: "/dashboard/",
    icon: <LayoutDashboard className="mr-3 h-6 w-6" />,
  },
  {
    name: "Thêm câu hỏi đề xuất",
    href: "/dashboard/suggested-questions",
    icon: <PlusCircle className="mr-3 h-6 w-6" />,
  },
  {
    name: "Thêm dữ liệu chatbot",
    // href: "/dashboard/chatbot-data",
    href: "#",
    icon: <Database className="mr-3 h-6 w-6" />,
  },
  {
    name: "Thống kê log",
    // href: "/dashboard/log-stats",
    href: "#",
    icon: <FileBarChart2 className="mr-3 h-6 w-6" />,
  },
  {
    name: "Thống kê chi phí",
    // href: "/dashboard/cost-stats",
    href: "#",
    icon: <Receipt className="mr-3 h-6 w-6" />,
  },
  {
    name: "Thống kê hiệu suất",
    // href: "/dashboard/performance-stats",
    href: "#",
    icon: <Gauge className="mr-3 h-6 w-6" />,
  },
  {
    name: "Thống kê tần suất truy cập",
    // href: "/dashboard/frequency-stats",
    href: "#",
    icon: <BarChart2 className="mr-3 h-6 w-6" />,
  },
  {
    name: "Báo cáo",
    // href: "/dashboard/reports",
    href: "#",
    icon: <FileText className="mr-3 h-6 w-6" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center flex-shrink-0 px-4">
              <Image
                src={assets.logo_icon}
                alt="Logo icon"
                className="h-10 w-10"
              />
              <span className="text-white text-xl font-bold ml-3">
                Hoàng Như
              </span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
