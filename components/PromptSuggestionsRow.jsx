import React from "react";
import PromptSuggestionsButton from "./PromptSuggestionsButton";

const PromptSuggestionsRow = ({ onPromptClick }) => {
  const prompts = [
    "Thuốc Exopadin có tác dụng gì?",
    "Thuốc Cetirizin có tác dụng gì?",
    "Thuốc Clorpheniramin có tác dụng gì?",
    "Thuốc Allerphast có tác dụng gì?",
    "Thuốc Histalong có tác dụng gì?",
  ];
  return (
    <div className="prompt-suggestions-row">
      {prompts.map((prompt, index) => (
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
