import React from "react";

const PromptSuggestionsButton = ({ text, onClick }) => {
  return (
    <button className="prompt-suggestions-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default PromptSuggestionsButton;
