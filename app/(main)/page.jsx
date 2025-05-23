"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { Mesage } from "ai";

import Image from "next/image";

import { useAppContext } from "@/context/AppContext";

import { assets } from "@/assets/assets";

import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import SelectVersion from "@/components/SelectVersion";
import PromptSuggestionsRow from "@/components/PromptSuggestionsRow";

import { Menu } from "lucide-react";
import { MessagesSquare } from "lucide-react";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const {
    apiVersion,
    setApiVersion,
    selectedChat,
    isLoading: isContextLoading,
  } = useAppContext();
  const containerRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePromptClick = (promptText) => {
    setIsLoading(true);
    setMessages([...messages, { role: "user", content: promptText }]);
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (!isMounted) {
    return null;
  }

  if (isContextLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#dbc6fd]">
        <div className="loader flex justify-center items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-white animate-bounce"></div>
          <div className="w-3 h-3 rounded-full bg-white animate-bounce"></div>
          <div className="w-3 h-3 rounded-full bg-white animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex h-screen">
        {/** === SIDEBAR === */}
        <Sidebar expand={expand} setExpand={setExpand} />

        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#dbc6fd] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
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

          {/* ===== Select Version ===== */}
          <SelectVersion expand={expand} />

          {/* ===== Messages ===== */}
          {!messages || messages.length === 0 ? (
            <>
              <div className="flex items-center gap-3">
                <Image
                  src={assets.logo_icon}
                  alt="Logo icon"
                  className="h-7 w-7"
                />
                <p className="text-2xl font-medium">
                  Xin chào, Tôi là trợ lý Nuu
                </p>
              </div>
              <p className="text-base mt-2 mb-4">
                Hôm nay tôi có thể giúp gì cho bạn?
              </p>
              {/** Suggestions Prompt */}
              {apiVersion === "classic" && (
                <PromptSuggestionsRow onPromptClick={handlePromptClick} />
              )}
            </>
          ) : (
            <div
              ref={containerRef}
              className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto"
            >
              <p className="fixed top-8 border border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6">
                {selectedChat?.name}
              </p>
              {messages.map((msg, index) => (
                <Message key={index} role={msg.role} content={msg.content} />
              ))}
              {isLoading && (
                <div className="flex gap-4 max-w-3xl w-full py-3">
                  <Image
                    className="h-9 w-9 p-1 border border-white/15 rounded-full"
                    src={assets.logo_icon}
                    alt="Logo"
                  />
                  <div className="loader flex justify-center items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/** ===== PROMPT BOX ===== */}
          <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />

          {/** ===== FOOTER ===== */}
          <p className="text-xs absolute bottom-1 text-gray-500">
            AI-generated, for reference only
          </p>
        </div>
      </div>
    </div>
  );
}
