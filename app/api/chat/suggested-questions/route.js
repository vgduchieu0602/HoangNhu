import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import SuggestedQuestion from "@/models/SuggestedQuestion";

// GET: Lấy danh sách câu hỏi, hỗ trợ phân trang
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const search = searchParams.get("search");
    let filter = {};
    if (search && search.trim()) {
      filter = { content: { $regex: search.trim(), $options: "i" } };
    }

    const total = await SuggestedQuestion.countDocuments(filter);
    const questions = await SuggestedQuestion.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: questions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

// POST: Thêm câu hỏi mới
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.content || !body.content.trim()) {
      return NextResponse.json({
        success: false,
        message: "Nội dung không hợp lệ",
      });
    }
    const newQuestion = await SuggestedQuestion.create({
      content: body.content.trim(),
    });
    return NextResponse.json({ success: true, data: newQuestion });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

// PUT: Cập nhật nội dung câu hỏi (theo id)
export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, content } = body;
    if (!id || !content || !content.trim()) {
      return NextResponse.json({
        success: false,
        message: "Thiếu id hoặc nội dung",
      });
    }
    const updated = await SuggestedQuestion.findByIdAndUpdate(
      id,
      { content: content.trim() },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({
        success: false,
        message: "Không tìm thấy câu hỏi",
      });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

// DELETE: Xóa câu hỏi (theo id)
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu id" });
    }
    const deleted = await SuggestedQuestion.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({
        success: false,
        message: "Không tìm thấy câu hỏi",
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
