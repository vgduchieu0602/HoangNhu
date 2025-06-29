import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    theme: {
      type: Object,
      default: {
        mode: "light",
        primaryColor: "#000000",
        secondaryColor: "#ffffff",
      },
    },
    language: {
      type: Object,
      default: {
        code: "en",
        name: "English",
      },
    },
  },
  { timestamps: true }
);

const Setting =
  mongoose.models.Setting || mongoose.model("Setting", SettingSchema);

export default Setting;
