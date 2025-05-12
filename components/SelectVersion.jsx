"use client";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";

const SelectVersion = ({ expand }) => {
  const { apiVersion, setApiVersion } = useAppContext();

  const handleVersionChange = (newVersion) => {
    setApiVersion(newVersion);
  };

  return (
    <div
      className={`fixed top-6 ${
        expand ? "left-76" : "left-30"
      } flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-purple-500/80`}
    >
      <button
        onClick={() => handleVersionChange("classic")}
        className={`text-sm px-3 py-1 rounded-full transition-all border border-purple-500/40 ${
          apiVersion === "classic"
            ? "bg-white text-purple-600"
            : "text-white hover:bg-white/10"
        }`}
      >
        Classic
      </button>
      <button
        onClick={() => handleVersionChange("premium")}
        className={`text-sm px-3 py-1 rounded-full transition-all border border-purple-500/40 ${
          apiVersion === "premium"
            ? "bg-white text-purple-600"
            : "text-white hover:bg-white/10"
        }`}
      >
        Premium
      </button>
    </div>
  );
};

export default SelectVersion;
