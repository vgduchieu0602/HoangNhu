import mongoose from "mongoose";

const ChatbotConfigSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chatbot",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const ChatbotConfig =
  mongoose.models.ChatbotConfig ||
  mongoose.model("ChatbotConfig", ChatbotConfigSchema);
export default ChatbotConfig;
