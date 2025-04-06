"use client";
import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useState } from "react";

import { Menu } from "lucide-react";
import { MessagesSquare } from "lucide-react";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [message, setMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div className="flex h-screen">
        {/** === SIDEBAR === */}
        <Sidebar expand={expand} setExpand={setExpand} />

        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#dbc6fd] text-white relative">
          <div className="md:hidden  absolute px-4 top-6 flex items-center justify-between w-full">
            <Menu
              onClick={() => (expand ? setExpand(false) : setExpand(true))}
              className="text-white h-7 w-7"
            />
            <Image
              className="h-7.5 w-7.5"
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
                  className="h-7 w-7"
                />
                <p className="text-2xl font-medium">Hi, I'm Nuu</p>
              </div>
              <p className="text-sm mt-2">How can I help you today?</p>
            </>
          ) : (
            <div>
              <Message role="ai" content="What is next js?" />
            </div>
          )}

          {/** === PROMPT BOX === */}
          <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />

          {/** === FOOTER === */}
          <p className="text-xs absolute bottom-1 text-gray-500">
            AI-generated, for reference only
          </p>
        </div>
      </div>
    </div>
  );
}
