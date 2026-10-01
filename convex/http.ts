import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";

type ClerkUserEvent = {
  type:
    | "user.created"
    | "user.updated"
    | "user.deleted"
    | "email_address.created"
    | "email_address.updated"
    | string;
  data: {
    id: string;
    // Present on user.created / user.updated, absent on user.deleted.
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
    primary_email_address_id?: string | null;
    email_addresses?: Array<{ id: string; email_address: string }>;
  };
};

/** Primary email address of a Clerk user, falling back to the first on file. */
function primaryEmailOf(data: ClerkUserEvent["data"]): string | undefined {
  const addresses = data.email_addresses ?? [];
  return (
    addresses.find((e) => e.id === data.primary_email_address_id)?.email_address ??
    addresses[0]?.email_address
  );
}

const http = httpRouter();

// Clerk webhook: POST /webhook/clerk
// Signature headers are svix-id / svix-timestamp / svix-signature, signed with
// this endpoint's CLERK_WEBHOOK_SECRET. Keeps the `users` mirror in sync for
// every sign-in method (Google OAuth included), since JWT claims may not carry
// profile data.
http.route({
  path: "/webhook/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      return new Response("Webhook not configured", { status: 500 });
    }

    const rawBody = await request.text();
    const svixHeaders = {
      "svix-id": request.headers.get("svix-id") ?? "",
      "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
      "svix-signature": request.headers.get("svix-signature") ?? "",
    };

    // verify() throws on a bad signature and returns nothing on success, so
    // the body is parsed only after verification passes.
    try {
      new Webhook(secret).verify(rawBody, svixHeaders);
    } catch {
      return new Response("Invalid signature", { status: 401 });
    }

    let event: ClerkUserEvent;
    try {
      event = JSON.parse(rawBody) as ClerkUserEvent;
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    if (
      event.type === "user.created" ||
      event.type === "user.updated" ||
      event.type === "email_address.created" ||
      event.type === "email_address.updated"
    ) {
      // An email change arrives as its own event, so all four funnel into the
      // same idempotent upsert. Fields absent from an event are left
      // undefined and the mutation skips them rather than clearing them.
      const { id, first_name, last_name, image_url } = event.data;
      const name = [first_name, last_name].filter(Boolean).join(" ").trim();

      await ctx.runMutation(internal.users.upsertFromClerk, {
        clerkId: id,
        email: primaryEmailOf(event.data),
        name: name || undefined,
        imageUrl: image_url || undefined,
      });
    } else if (event.type === "user.deleted") {
      // user.deleted carries only an id. Jobs, contracts and profiles are
      // left intact so records stay readable.
      await ctx.runMutation(internal.users.deleteFromClerk, {
        clerkId: event.data.id,
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
