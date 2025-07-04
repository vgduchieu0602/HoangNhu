import connectDB from "@/config/db";
import User from "@/models/User";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10;

  const query = search ? { name: { $regex: search, $options: "i" } } : {};

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  return Response.json({ users, total });
}
