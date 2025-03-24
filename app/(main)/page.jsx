"use client";
import { assets } from "@/assets/assets";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [message, setMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#DCD3FF] text-white relative">
          <div className="md:hidden  absolute px-4 top-6 flex items-center justify-between w-full">
            <Image
              onClick={() => (expand ? setExpand(false) : setExpand(true))}
              className="rotate-180"
              src={assets.menu_icon}
              alt="Menu icon"
            />
            <Image
              className="opacity-70"
              src={assets.chat_icon}
              alt="Chat icon"
            />
          </div>

          {message.length === 0 ? (
            <>
              <div className="flex items-center gap-3">
                <Image
                  src={assets.logo_icon}
                  alt="Logo icon"
                  className="h-8 w-8"
                />
                <p className="text-2xl font-medium">Hi, I'm Nuu</p>
              </div>
              <p className="text-sm mt-2">How can I help you today?</p>
            </>
          ) : (
            <div></div>
          )}
          {/** === Prompt box === */}
          <p className="text-xs absolute bottom-1 text-gray-500">
            AI-generated, for reference only
          </p>
        </div>
      </div>
    </div>
  );
}
