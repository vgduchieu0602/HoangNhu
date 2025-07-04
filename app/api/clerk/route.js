import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/User";

import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req) {
  try {
    const wh = new Webhook(process.env.SIGNING_SECRET);
    const headerPayload = await headers();
    const svixHeaders = {
      "svix-id": headerPayload.get("svix-id"),
      "svix-timestamp": headerPayload.get("svix-timestamp"),
      "svix-signature": headerPayload.get("svix-signature"),
    };

    // Log svixHeaders để debug
    console.log("Svix Headers:", svixHeaders);

    //Get the payload and verify it
    const payload = await req.json();
    const body = JSON.stringify(payload);
    // Log payload để debug
    console.log("Webhook Payload:", payload);

    let data, type;
    try {
      ({ data, type } = wh.verify(body, svixHeaders));
    } catch (verifyError) {
      console.error("Svix verify error:", verifyError);
      return NextResponse.json(
        {
          error: "Svix signature verification failed",
          details: verifyError.message,
        },
        { status: 400 }
      );
    }
    console.log("DATA:", data);

    //Prepare the user data to be saved in the database
    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url || "",
      role: data.role || "user",
    };

    await connectDB();

    switch (type) {
      case "user.created":
        try {
          await User.create(userData);
        } catch (mongoError) {
          console.error("MongoDB create user error:", mongoError);
          return NextResponse.json(
            { error: "MongoDB create user error", details: mongoError.message },
            { status: 500 }
          );
        }
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id, userData);
        break;
      default:
        break;
    }

    return NextResponse.json({ message: "Event received" });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
