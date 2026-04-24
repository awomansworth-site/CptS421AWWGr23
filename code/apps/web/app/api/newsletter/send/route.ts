/**
 * POST /api/newsletter/send
 * Body: { newsletterId: string }   ← Strapi documentId of the newsletter post
 *
 * Sends the newsletter to all active subscribers.
 * Safety: Only sends posts with emailStatus === "Ready to Send".
 *
 * Required env variables:
 *   STRAPI_API_URL      — CMS base URL (e.g. https://lively-growth-bd86934599.strapiapp.com)
 *   STRAPI_API_TOKEN    — Strapi full-access API token
 *   NEXT_PUBLIC_SITE_URL
 *   RESEND_API_KEY
 *   NEWSLETTER_FROM_EMAIL
 *
 * TODO: Protect this route with authentication before going to production.
 */

import { NextRequest, NextResponse } from "next/server";
import { sendNewsletterEmail } from "@/lib/email/sendNewsletterEmail";

const STRAPI = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";
const TOKEN = process.env.STRAPI_API_TOKEN || "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://awomansworth.co";

function strapiHeaders() {
  return {
    "Content-Type": "application/json",
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  };
}

export async function POST(req: NextRequest) {
  let body: { newsletterId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const newsletterId = typeof body.newsletterId === "string" ? body.newsletterId.trim() : "";
  if (!newsletterId) {
    return NextResponse.json({ success: false, message: "newsletterId is required." }, { status: 400 });
  }

  // ── 1. Fetch the newsletter post ──────────────────────────────────────────
  let post: any;
  try {
    const res = await fetch(
      `${STRAPI}/api/newsletter-posts?filters[documentId][$eq]=${encodeURIComponent(newsletterId)}&pagination[pageSize]=1`,
      { headers: strapiHeaders() }
    );
    if (!res.ok) {
      return NextResponse.json({ success: false, message: "Could not fetch newsletter post." }, { status: 502 });
    }
    const data = await res.json();
    post = data?.data?.[0];
  } catch {
    return NextResponse.json({ success: false, message: "CMS unreachable." }, { status: 502 });
  }

  if (!post) {
    return NextResponse.json({ success: false, message: "Newsletter post not found." }, { status: 404 });
  }

  const attrs = post?.attributes ?? post;
  const emailStatus = attrs?.emailStatus ?? attrs?.email_status;

  // ── 2. Safety checks ──────────────────────────────────────────────────────
  if (emailStatus === "Sent") {
    return NextResponse.json({ success: false, message: "This newsletter has already been sent." }, { status: 409 });
  }
  if (emailStatus !== "Ready to Send") {
    return NextResponse.json(
      { success: false, message: `Cannot send — current status is "${emailStatus || "Draft"}". Set it to "Ready to Send" first.` },
      { status: 422 }
    );
  }

  const subject = attrs?.emailSubject || attrs?.title || "Newsletter from A Woman's Worth";
  const previewText = attrs?.emailPreviewText || attrs?.excerpt || "";
  const title = attrs?.title || "Newsletter";
  const excerpt = attrs?.excerpt || "";
  const slug = attrs?.slug || post?.documentId || String(post?.id);
  const articleUrl = `${SITE_URL}/newsletter/${encodeURIComponent(slug)}`;

  // ── 3. Fetch active subscribers ───────────────────────────────────────────
  let subscribers: any[] = [];
  try {
    const res = await fetch(
      `${STRAPI}/api/newsletter-subscribers?filters[active][$eq]=true&pagination[pageSize]=1000`,
      { headers: strapiHeaders() }
    );
    if (!res.ok) {
      return NextResponse.json({ success: false, message: "Could not fetch subscribers." }, { status: 502 });
    }
    const data = await res.json();
    subscribers = data?.data ?? [];
  } catch {
    return NextResponse.json({ success: false, message: "CMS unreachable." }, { status: 502 });
  }

  if (subscribers.length === 0) {
    return NextResponse.json({ success: true, message: "No active subscribers to send to.", sent: 0, failed: 0 });
  }

  // ── 4. Send emails ────────────────────────────────────────────────────────
  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    const a = sub?.attributes ?? sub;
    const email = a?.email;
    const token = a?.unsubscribeToken;
    if (!email) { failed++; continue; }

    const unsubscribeUrl = token
      ? `${SITE_URL}/newsletter/unsubscribe?token=${encodeURIComponent(token)}`
      : `${SITE_URL}/newsletter/unsubscribe`;

    const result = await sendNewsletterEmail({
      to: email,
      subject,
      previewText,
      title,
      excerpt,
      articleUrl,
      unsubscribeUrl,
    });

    if (result.success) {
      sent++;
    } else {
      failed++;
      console.error(`[newsletter/send] Failed to email ${email}: ${result.error}`);
    }
  }

  // ── 5. Update newsletter post status ─────────────────────────────────────
  try {
    const docId = post?.documentId ?? String(post?.id);
    await fetch(`${STRAPI}/api/newsletter-posts/${docId}`, {
      method: "PUT",
      headers: strapiHeaders(),
      body: JSON.stringify({
        data: {
          emailStatus: failed === 0 ? "Sent" : "Failed",
          sentAt: new Date().toISOString(),
        },
      }),
    });
  } catch {
    // Non-fatal — emails were already sent
    console.error("[newsletter/send] Failed to update newsletter post status.");
  }

  return NextResponse.json({
    success: true,
    message: `Sent to ${sent} subscriber${sent !== 1 ? "s" : ""}${failed > 0 ? ` (${failed} failed)` : ""}.`,
    sent,
    failed,
  });
}
