import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

/**Đây là một pattern phổ biến trong Mongoose để tránh việc tạo lại model khi code được hot-reload hoặc
 * khi file được import nhiều lần.
 * - mongoose.models.User: kiểm tra model User đã được định nghĩa trước đó chưa
 * - mongoose.model('User', UserSchema): tạo model User nếu chưa tồn tại
 */
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
