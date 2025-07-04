import mongoose from "mongoose";

const SuggestedQuestionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SuggestedQuestion =
  mongoose.models.SuggestedQuestion ||
  mongoose.model("SuggestedQuestion", SuggestedQuestionSchema);

export default SuggestedQuestion;
