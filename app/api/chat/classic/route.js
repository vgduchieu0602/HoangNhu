export const maxDuration = 60;
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { NextRequest, NextResponse } from "next/server";
import SuggestedQuestion from "@/models/SuggestedQuestion";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, {
  namespace: ASTRA_DB_NAMESPACE,
});

export async function POST(req) {
  try {
    const body = await req.json();
    // Nếu có content (từ suggested-questions), lưu vào DB
    if (body.content) {
      await connectDB();
      const newQuestion = await SuggestedQuestion.create({
        content: body.content,
      });
      return NextResponse.json({ success: true, data: newQuestion });
    }

    const { userId } = getAuth(req);

    //Extract chatId and prompt from the request body
    const { chatId, prompt } = body;

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }

    //Find the chat document in the database based on userId and chatId
    await connectDB();
    const data = await Chat.findOne({ userId, _id: chatId });

    //Create a user message object
    const userPrompt = {
      role: "user",
      content: prompt,
      timestamps: Date.now(),
    };

    data.messages.push(userPrompt);

    let docContext = "";

    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: prompt,
      encoding_format: "float",
    });

    try {
      const collection = await db.collection(ASTRA_DB_COLLECTION);
      const cursor = collection.find(null, {
        sort: {
          $vector: embedding.data[0].embedding,
        },
        limit: 10,
      });

      const documents = await cursor.toArray();
      const docsMap = documents?.map((doc) => doc.text);
      docContext = JSON.stringify(docsMap);
    } catch (error) {
      console.log("Error querying db...");
      docContext = "";
    }

    const systemMessage = {
      role: "system",
      content: `Bạn là trợ lý AI người mà biết tất cả mọi thứ về các sản phẩm thuốc và dịch vụ của công ty Hoàng Như cung cấp. 
        Thay thế hết cụm từ Minh Châu thành Hoàng Như.
        Nếu câu hỏi không liên quan đến lĩnh vực y tế, dữ liệu không có trong datastax thì không hỗ trợ hãy yêu cầu khách hàng hỏi câu hỏi phù hợp hơn.
        Định dạng câu trả lời bằng Markdown nếu có thể và không trả về hình ảnh.
              --------------------
              START CONTEXT
              ${docContext}
              END CONTEXT
              --------------------
              QUESTION: ${prompt}
              --------------------`,
    };

    //Call the OpenAI API to get a chat completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const message = completion.choices[0].message;

    if (!message) {
      return NextResponse.json({
        success: false,
        error: "Invalid API response",
      });
    }

    message.timestamps = Date.now();
    data.messages.push(message);
    await data.save();

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json({
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const questions = await SuggestedQuestion.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
