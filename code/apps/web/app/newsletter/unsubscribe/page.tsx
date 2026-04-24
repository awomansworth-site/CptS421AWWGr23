import Link from "next/link";

const STRAPI = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";
const TOKEN = process.env.STRAPI_API_TOKEN || "";

function strapiHeaders() {
  return {
    "Content-Type": "application/json",
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  };
}

async function handleUnsubscribe(token: string): Promise<"success" | "not-found" | "error"> {
  try {
    // Find the subscriber by token
    const res = await fetch(
      `${STRAPI}/api/newsletter-subscribers?filters[unsubscribeToken][$eq]=${encodeURIComponent(token)}&pagination[pageSize]=1`,
      { headers: strapiHeaders(), cache: "no-store" }
    );
    if (!res.ok) return "error";

    const data = await res.json();
    const subscriber = data?.data?.[0];
    if (!subscriber) return "not-found";

    const docId = subscriber?.documentId ?? String(subscriber?.id);
    if (!docId) return "error";

    // Mark as unsubscribed
    const update = await fetch(`${STRAPI}/api/newsletter-subscribers/${docId}`, {
      method: "PUT",
      headers: strapiHeaders(),
      body: JSON.stringify({
        data: {
          active: false,
          unsubscribedAt: new Date().toISOString(),
        },
      }),
    });

    return update.ok ? "success" : "error";
  } catch {
    return "error";
  }
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let status: "success" | "not-found" | "error" | "missing" = "missing";

  if (token && token.trim()) {
    status = await handleUnsubscribe(token.trim());
  }

  const content: Record<typeof status, { icon: string; heading: string; body: string }> = {
    success: {
      icon: "✓",
      heading: "You've been unsubscribed.",
      body: "You won't receive any more newsletters from A Woman's Worth. We're sorry to see you go.",
    },
    "not-found": {
      icon: "?",
      heading: "Link not recognised.",
      body: "This unsubscribe link may have already been used or is no longer valid.",
    },
    error: {
      icon: "!",
      heading: "Something went wrong.",
      body: "We couldn't process your request right now. Please try again later or contact us directly.",
    },
    missing: {
      icon: "!",
      heading: "Invalid link.",
      body: "No unsubscribe token was found in this link. Please use the link in your email.",
    },
  };

  const { icon, heading, body } = content[status];
  const isSuccess = status === "success";

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">
        {/* Icon badge */}
        <div
          className={`mx-auto mb-6 h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold text-white ${
            isSuccess ? "bg-[#004080]" : "bg-gray-400"
          }`}
        >
          {icon}
        </div>

        {/* Accent bar */}
        <div
          className="mx-auto mb-6 h-1 w-16 rounded-full"
          style={{ background: "linear-gradient(to right, #f7941D, #F79520)" }}
        />

        <h1 className="text-2xl font-extrabold text-[#004080] mb-3">{heading}</h1>
        <p className="text-gray-500 leading-relaxed mb-8">{body}</p>

        <Link
          href="/"
          className="inline-block rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.03] active:scale-95"
          style={{
            background: "linear-gradient(135deg, #f7941D, #F79520)",
            boxShadow: "0 4px 14px rgba(247,148,29,0.3)",
          }}
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
