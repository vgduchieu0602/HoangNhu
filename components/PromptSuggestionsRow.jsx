import React from "react";
import PromptSuggestionsButton from "./PromptSuggestionsButton";

const PromptSuggestionsRow = ({ onPromptClick }) => {
  const prompts = [
    "Cách sử dụng thuốc Exopadin như nào?",
    "Xơ vữa động mạch là gì?",
    "Tim đập nhanh thì phải làm gì?",
    "Bị nhồi máu cơ tim thì phải sơ cứu sao?",
    "Thực phẩm chức năng bổ sung Vitamin C ở trẻ em là gì?",
    "Thuốc hỗ trợ xương khớp dùng loại nào?",
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
