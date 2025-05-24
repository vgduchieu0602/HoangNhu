import { assets } from "@/assets/assets";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import Prism from "prismjs";
import toast from "react-hot-toast";

import { Copy } from "lucide-react";
import { SquarePen } from "lucide-react";
import { RefreshCcw } from "lucide-react";
import { ThumbsDown } from "lucide-react";
import { ThumbsUp } from "lucide-react";

const Message = ({ role, content }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      Prism.highlightAll();
    }
  }, [content]);

  const copyMessage = () => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied to clipboard");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl text-sm">
      <div
        className={`flex flex-col w-full mb-8 ${
          role === "user" && "items-end"
        }`}
      >
        <div
          className={`group relative flex max-w-2xl py-3 rounded-xl ${
            role === "user" ? "bg-[#414158] px-5" : "gap-3"
          }`}
        >
          <div
            className={`opacity-0 group-hover:opacity-100 absolute ${
              role === "user" ? "-left-16 top-2.5" : "left-9 -bottom-6"
            } transition-all`}
          >
            <div className="flex items-center gap-2 opacity-70">
              {role === "user" ? (
                <>
                  <Copy
                    onClick={copyMessage}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <SquarePen className="w-5 h-5 cursor-pointer" />
                </>
              ) : (
                <>
                  <Copy
                    onClick={copyMessage}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <RefreshCcw className="w-5 h-5 cursor-pointer" />
                  <ThumbsDown className="w-5 h-5 cursor-pointer" />
                  <ThumbsUp className="w-5 h-5 cursor-pointer" />
                </>
              )}
            </div>
          </div>

          {role === "user" ? (
            <span className="text-white">{content}</span>
          ) : (
            <>
              <Image
                src={assets.logo_icon}
                alt=""
                className="h-9 w-9 p-1 border border-white rounded-full"
              />
              <div className="space-y-4 w-full overflow-scroll bg-[#414158]/25 px-10 py-5 rounded-xl">
                <Markdown>{content}</Markdown>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
