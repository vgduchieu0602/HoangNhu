"use client";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

const PromptBox = ({ setIsLoading, isLoading }) => {
  const [prompt, setPrompt] = useState("");
  const { user, chats, setChats, selectedChat, setSelectedChat, apiVersion } =
    useAppContext();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const sendPrompt = async (e) => {
    const promptCopy = prompt;
    try {
      //prevent page reloading when we submit form data
      e.preventDefault();
      if (!user) {
        return toast.error("Login to send message");
      }
      if (isLoading) {
        return toast.error("Wait for the previous prompt response");
      }

      setIsLoading(true);
      setPrompt("");

      const userPrompt = {
        role: "user",
        content: prompt,
        timestamps: Date.now(),
      };

      //saving user prompt in chats array
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? {
                ...chat,
                messages: [...chat.messages, userPrompt],
              }
            : chat
        )
      );

      //saving user prompt in selected chat
      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, userPrompt],
      }));

      const { data } = await axios.post(
        `/api/chat/${apiVersion === "classic" ? "classic" : "premium"}`,
        {
          chatId: selectedChat._id,
          prompt,
        }
      );

      if (data.success) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? { ...chat, messages: [...chat.messages, data.data] }
              : chat
          )
        );

        const message = data.data.content;
        const messageTokens = message.split(" ");
        let assistantMessage = {
          role: "assistant",
          content: "",
          timestamps: Date.now(),
        };

        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));

        for (let i = 0; i < messageTokens.length; i++) {
          setTimeout(() => {
            assistantMessage.content = messageTokens.slice(0, i + 1).join(" ");
            setSelectedChat((prev) => {
              const updatedMessages = [
                ...prev.messages.slice(0, -1),
                assistantMessage,
              ];
              return { ...prev, messages: updatedMessages };
            });
          }, i * 100);
        }
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.message);
      setPrompt(promptCopy);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={sendPrompt}
      className={`w-full ${
        selectedChat?.messages.length > 0 ? "max-w-3xl" : "max-w-2xl"
      } bg-[#404045] py-4 px-6 rounded-3xl mt-4 transition-all`}
    >
      <textarea
        onKeyDown={handleKeyDown}
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent"
        row={2}
        placeholder="Message"
        required
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />

      <div className="flex items-center justify-between text-sm mt-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
              <Image
                className="h-5"
                src={assets.deepthink_icon}
                alt="Deepthing icon"
              />
              DeepThink (R1)
            </p>
            <span
              className="absolute -top-3 -right-2 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow"
              style={{ backgroundColor: "var(--color-hover)" }}
            >
              coming soon
            </span>
          </div>
          <div className="relative">
            <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
              <Image
                className="h-5"
                src={assets.search_icon}
                alt="Search icon"
              />
              Search
            </p>
            <span
              className="absolute -top-3 -right-2 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow"
              style={{ backgroundColor: "var(--color-hover)" }}
            >
              coming soon
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className={`${
              prompt ? "bg-primary" : "bg-[#71717a]"
            } rounded-full p-2 cursor-pointer`}
          >
            <Image
              className="w-3.5 aspect-square"
              src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
              alt="Arrow icon"
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;
