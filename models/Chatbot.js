import mongoose from "mongoose";

const ChatbotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Chatbot =
  mongoose.models.Chatbot || mongoose.model("Chatbot", ChatbotSchema);
export default Chatbot;
