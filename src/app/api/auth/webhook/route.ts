import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
// import { createUser } from "@/actions/createUser";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  console.log("Webhook received");
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.log("Missing CLERK_WEBHOOK_SECRET");
    throw new Error(
      "Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env"
    );
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  console.log("Headers received:", { svix_id, svix_timestamp, svix_signature });

  // if there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create new Svix instance with secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.log("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  const eventType = evt.type;
  console.log("Event type:", eventType);

  if (eventType === "user.created") {
    const { id, first_name, last_name } = evt.data;

    try {
      const newUser = await prisma.user.upsert({
        where: { clerkId: id },
        create: {
          clerkId: id,
          fullname: `${first_name || ""} ${last_name || ""}`.trim(),
          type: "user",
        },
        update: {},
      });

      console.log("User created successfully:", newUser);

      return new Response(JSON.stringify({ success: true, newUser }), {
        status: 200,
      });
    } catch (error) {
      console.error("Error inserting user in database:", error);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to insert user" }),
        { status: 500 }
      );
    }
  }

  return new Response("Webhook processed", { status: 200 });
}
