import React, { useEffect, useState } from "react";
import PromptSuggestionsButton from "./PromptSuggestionsButton";
import axios from "axios";

const getRandomItems = (arr, n) => {
  const result = [];
  const taken = new Set();
  while (result.length < n && result.length < arr.length) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!taken.has(idx)) {
      taken.add(idx);
      result.push(arr[idx]);
    }
  }
  return result;
};

const PromptSuggestionsRow = ({ onPromptClick }) => {
  const [prompts, setPrompts] = useState([]);
  const [randomPrompts, setRandomPrompts] = useState([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await axios.get("/api/chat/classic");
        if (res.data.success) {
          setPrompts(res.data.data.map((q) => q.content));
        }
      } catch (error) {
        setPrompts([]);
      }
    };
    fetchPrompts();
  }, []);

  useEffect(() => {
    setRandomPrompts(getRandomItems(prompts, 6));
  }, [prompts]);

  return (
    <div className="prompt-suggestions-row">
      {randomPrompts.map((prompt, index) => (
        <PromptSuggestionsButton
          key={index}
          text={prompt}
          onClick={() => onPromptClick(prompt)}
        />
      ))}
    </div>
  );
};

export default PromptSuggestionsRow;
