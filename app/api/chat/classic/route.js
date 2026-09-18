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

const EXTERNAL_TIMEOUT_MS = 15_000;

const isTimeoutError = (error) =>
  error instanceof Error && error.name.includes("Timeout");

const anonymizeUserId = (userId) =>
  typeof userId === "string" ? `${userId.slice(0, 6)}...` : undefined;

export async function POST(req) {
  let stage = "validation";
  let userId;
  let chatId;
  const requestId = crypto.randomUUID();
  const requestStartedAt = Date.now();
  const requestContext = () => ({
    requestId,
    chatId,
    userId: anonymizeUserId(userId),
    stage,
    durationMs: Date.now() - requestStartedAt,
  });

  console.info("Classic chat request received", requestContext());

  try {
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.warn("Classic chat request rejected", {
        ...requestContext(),
        reason: "Invalid JSON body",
      });
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      console.warn("Classic chat request rejected", {
        ...requestContext(),
        reason: "Invalid request body",
      });
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    stage = "authentication";
    const authenticationStartedAt = Date.now();
    userId = getAuth(req).userId;

    if (!userId) {
      console.warn("Classic chat request rejected", {
        ...requestContext(),
        reason: "User not authenticated",
      });
      return NextResponse.json(
        {
          success: false,
          message: "User not authenticated",
        },
        { status: 401 }
      );
    }

    console.info("Classic chat authentication completed", {
      ...requestContext(),
      stageDurationMs: Date.now() - authenticationStartedAt,
    });
    // Nếu có content (từ suggested-questions), lưu vào DB
    if (body.content) {
      stage = "mongodb";
      const mongoConnection = await connectDB();
      if (!mongoConnection) {
        throw new Error("MongoDB connection unavailable");
      }
      const newQuestion = await SuggestedQuestion.create({
        content: body.content,
      });
      return NextResponse.json({ success: true, data: newQuestion });
    }

    //Extract chatId and prompt from the request body
    chatId = body.chatId;
    const { prompt } = body;

    if (
      typeof chatId !== "string" ||
      !chatId ||
      typeof prompt !== "string" ||
      !prompt.trim()
    ) {
      stage = "validation";
      console.warn("Classic chat request rejected", {
        ...requestContext(),
        reason: "Invalid chatId or prompt",
      });
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    //Find the chat document in the database based on userId and chatId
    stage = "mongodb";
    const mongoLookupStartedAt = Date.now();
    const mongoConnection = await connectDB();
    if (!mongoConnection) {
      throw new Error("MongoDB connection unavailable");
    }
    const data = await Chat.findOne({ userId, _id: chatId });

    console.info("Classic chat lookup completed", {
      ...requestContext(),
      provider: "mongodb",
      stageDurationMs: Date.now() - mongoLookupStartedAt,
      chatFound: Boolean(data),
    });

    if (!data) {
      console.warn("Classic chat request rejected", {
        ...requestContext(),
        reason: "Chat not found",
      });
      return NextResponse.json(
        { success: false, message: "Chat not found" },
        { status: 404 }
      );
    }

    //Create a user message object
    const userPrompt = {
      role: "user",
      content: prompt,
      timestamps: Date.now(),
    };

    data.messages.push(userPrompt);

    const recentMessages = data.messages
      .slice(-7, -1)
      .map(({ role, content }) => ({ role, content }));

    let docContext = "";

    stage = "embedding";
    const embeddingStartedAt = Date.now();
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: prompt,
      encoding_format: "float",
    }, { timeout: EXTERNAL_TIMEOUT_MS, maxRetries: 0 });

    console.info("Classic chat embedding completed", {
      ...requestContext(),
      provider: "openai",
      model: "text-embedding-3-small",
      stageDurationMs: Date.now() - embeddingStartedAt,
    });

    stage = "astra retrieval";
    const retrievalStartedAt = Date.now();
    const collection = await db.collection(ASTRA_DB_COLLECTION, {
      defaultMaxTimeMS: EXTERNAL_TIMEOUT_MS,
    });
    const cursor = collection.find(null, {
      sort: {
        $vector: embedding.data[0].embedding,
      },
      limit: 10,
    });

    const documents = await cursor.toArray();
    const docsMap = documents?.map((doc) => doc.text);
    docContext = JSON.stringify(docsMap);

    console.info("Classic chat vector retrieval completed", {
      ...requestContext(),
      provider: "astra",
      retrievedDocumentCount: documents.length,
      stageDurationMs: Date.now() - retrievalStartedAt,
    });

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
              --------------------`,
    };

    //Call the OpenAI API to get a chat completion
    stage = "llm completion";
    const completionStartedAt = Date.now();
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        systemMessage,
        ...recentMessages,
        { role: "user", content: prompt },
      ],
    }, { timeout: EXTERNAL_TIMEOUT_MS, maxRetries: 0 });

    const message = completion.choices[0].message;

    if (!message) {
      throw new Error("LLM completion returned no message");
    }

    console.info("Classic chat llm completion completed", {
      ...requestContext(),
      provider: "openai",
      model: "gpt-4",
      stageDurationMs: Date.now() - completionStartedAt,
    });

    message.timestamps = Date.now();
    data.messages.push(message);
    stage = "mongodb";
    const saveStartedAt = Date.now();
    await data.save();

    console.info("Classic chat conversation saved", {
      ...requestContext(),
      provider: "mongodb",
      stageDurationMs: Date.now() - saveStartedAt,
    });

    console.info("Classic chat response sent", {
      ...requestContext(),
      status: 200,
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    const isTimeout = isTimeoutError(error);
    console.error("Classic chat request failed", {
      ...requestContext(),
      timeout: isTimeout,
      error:
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : error,
    });
    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "External service timed out"
          : "Unable to process chat request",
      },
      { status: isTimeout ? 504 : 500 }
    );
  }
}

export async function GET(req) {
  try {
    const mongoConnection = await connectDB();
    if (!mongoConnection) {
      throw new Error("MongoDB connection unavailable");
    }
    const questions = await SuggestedQuestion.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    console.error("Classic chat suggested questions failed", {
      stage: "mongodb",
      error:
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : error,
    });
    return NextResponse.json(
      { success: false, message: "Unable to load suggested questions" },
      { status: 500 }
    );
  }
}
