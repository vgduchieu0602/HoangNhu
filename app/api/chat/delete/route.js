import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/dist/types/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        const {chatId} = await req.json()
    
        if (!userId) {
          return NextResponse.json({
            success: false,
            message: "User not authenticated",
          });
        }
    
        //Connect to database and delete the chat
        await connectDB()
        await Chat.deleteOne({_id: chatId, userId})

        return NextResponse.json({success: true, message: "Chat deleted successfully"})
      } catch (error) {
        return NextResponse.json({success: false, message: error.message})
      }
}