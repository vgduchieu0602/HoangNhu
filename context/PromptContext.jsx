"use client";

import React, { createContext, useContext, useState } from "react";

const PromptContext = createContext();

export const usePromptContext = () => useContext(PromptContext);

export const PromptProvider = ({ children }) => {
  const [prompts, setPrompts] = useState([]);

  const addPrompt = (prompt) => {
    setPrompts((prev) => [...prev, prompt]);
  };

  return (
    <PromptContext.Provider value={{ prompts, addPrompt }}>
      {children}
    </PromptContext.Provider>
  );
};
