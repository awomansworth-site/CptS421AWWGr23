import { NextRequest, NextResponse } from "next/server";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: { email?: unknown; name?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.trim() : undefined;

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { success: false, message: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${CMS_URL}/api/newsletter-subscribers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          email,
          name: name || null,
          subscribedAt: new Date().toISOString(),
          active: true,
          source: "website",
        },
      }),
    });

    if (res.ok) {
      return NextResponse.json({ success: true, message: "Subscribed successfully!" });
    }

    const errBody = await res.json().catch(() => ({}));

    // Strapi returns 400 with "unique" validation error on duplicate email
    const isDuplicate =
      res.status === 400 &&
      JSON.stringify(errBody).toLowerCase().includes("unique");

    if (isDuplicate) {
      // Treat duplicate as success — non-disruptive UX
      return NextResponse.json({ success: true, message: "You're already subscribed!" });
    }

    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  } catch {
    // Strapi offline — degrade gracefully
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
