"use client";

/**
 * /admin/newsletter — Simple newsletter send dashboard.
 *
 * TODO: Protect this route with authentication before going to production.
 *       Add middleware or a password gate to prevent public access.
 */

import { useEffect, useState } from "react";
import { CheckCircle, Clock, Send, AlertTriangle, RefreshCw } from "lucide-react";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";

interface NewsletterPost {
  id: number;
  documentId: string;
  title: string;
  emailStatus: string | null;
  emailSubject: string | null;
  sentAt: string | null;
  publishDate: string | null;
  slug: string;
}

type SendState = "idle" | "sending" | "success" | "error";

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  "Draft":          { bg: "bg-gray-100",   text: "text-gray-600",  icon: <Clock className="h-3.5 w-3.5" /> },
  "Ready to Send":  { bg: "bg-blue-100",   text: "text-blue-700",  icon: <Send className="h-3.5 w-3.5" /> },
  "Sent":           { bg: "bg-green-100",  text: "text-green-700", icon: <CheckCircle className="h-3.5 w-3.5" /> },
  "Failed":         { bg: "bg-red-100",    text: "text-red-700",   icon: <AlertTriangle className="h-3.5 w-3.5" /> },
};

function StatusBadge({ status }: { status: string | null }) {
  const s = STATUS_STYLES[status ?? "Draft"] ?? STATUS_STYLES["Draft"];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>
      {s.icon}
      {status ?? "Draft"}
    </span>
  );
}

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch { return "—"; }
}

export default function AdminNewsletterPage() {
  const [posts, setPosts] = useState<NewsletterPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendStates, setSendStates] = useState<Record<string, { state: SendState; message: string }>>({});

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${CMS_URL}/api/newsletter-posts?sort=publishDate:desc&pagination[pageSize]=50`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      const rows = data?.data ?? [];
      setPosts(
        rows.map((row: any) => {
          const a = row?.attributes ?? row;
          return {
            id: row.id,
            documentId: row.documentId ?? String(row.id),
            title: a?.title ?? "Untitled",
            emailStatus: a?.emailStatus ?? null,
            emailSubject: a?.emailSubject ?? null,
            sentAt: a?.sentAt ?? null,
            publishDate: a?.publishDate ?? null,
            slug: a?.slug ?? row.documentId ?? String(row.id),
          };
        })
      );
    } catch (e) {
      setError("Could not load newsletter posts. Is the CMS online?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPosts(); }, []);

  async function handleSend(post: NewsletterPost) {
    const key = post.documentId;
    setSendStates((prev) => ({ ...prev, [key]: { state: "sending", message: "" } }));

    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsletterId: post.documentId }),
      });
      const data = await res.json();
      setSendStates((prev) => ({
        ...prev,
        [key]: {
          state: data.success ? "success" : "error",
          message: data.message ?? (data.success ? "Sent!" : "Send failed."),
        },
      }));
      // Refresh list to reflect new status
      if (data.success) setTimeout(fetchPosts, 800);
    } catch {
      setSendStates((prev) => ({
        ...prev,
        [key]: { state: "error", message: "Network error. Please try again." },
      }));
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="py-10 px-4 text-white"
        style={{ background: "linear-gradient(135deg,#0a3680 0%,#0d4ea6 60%,#f79520 100%)" }}
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-medium text-white/70 uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 className="text-3xl font-extrabold">Newsletter Send Dashboard</h1>
          <p className="text-white/75 mt-2 text-sm">
            Manage and send newsletters to all active subscribers.
          </p>
          <p className="mt-3 inline-block rounded-lg bg-red-500/30 border border-red-300/40 px-3 py-1.5 text-xs font-semibold text-red-200">
            ⚠️ TODO: Protect this route before production.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Refresh */}
        <div className="flex justify-end mb-6">
          <button
            onClick={fetchPosts}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* States */}
        {loading && (
          <div className="text-center py-20 text-gray-400 text-sm">Loading newsletter posts…</div>
        )}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-red-600 text-sm">{error}</div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            {posts.length === 0 ? (
              <div className="text-center py-20 text-gray-400 text-sm">No newsletter posts found.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <th className="px-6 py-4 text-left">Title</th>
                    <th className="px-6 py-4 text-left">Email Status</th>
                    <th className="px-6 py-4 text-left">Publish Date</th>
                    <th className="px-6 py-4 text-left">Sent At</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {posts.map((post) => {
                    const ss = sendStates[post.documentId];
                    const isSending = ss?.state === "sending";
                    const canSend = post.emailStatus === "Ready to Send";

                    return (
                      <tr key={post.documentId} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800 line-clamp-1">{post.title}</p>
                          {post.emailSubject && (
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                              Subject: {post.emailSubject}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={post.emailStatus} />
                        </td>
                        <td className="px-6 py-4 text-gray-500">{fmtDate(post.publishDate)}</td>
                        <td className="px-6 py-4 text-gray-500">{fmtDate(post.sentAt)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <button
                              onClick={() => handleSend(post)}
                              disabled={!canSend || isSending}
                              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all
                                ${canSend && !isSending
                                  ? "hover:scale-[1.03] active:scale-95"
                                  : "opacity-40 cursor-not-allowed"
                                }`}
                              style={canSend && !isSending
                                ? { background: "linear-gradient(135deg,#f7941D,#F79520)", boxShadow: "0 3px 10px rgba(247,148,29,.35)" }
                                : { background: "#e5e7eb" }
                              }
                            >
                              <Send className={`h-3.5 w-3.5 ${isSending ? "animate-pulse" : ""}`} />
                              {isSending ? "Sending…" : "Send Now"}
                            </button>
                            {ss?.message && (
                              <p className={`text-xs ${ss.state === "success" ? "text-green-600" : "text-red-500"}`}>
                                {ss.message}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Guide */}
        <div className="mt-10 rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-[#004080] mb-3">How to send a newsletter</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>In Strapi, open the newsletter post you want to send.</li>
            <li>Fill in <strong>Email Subject</strong> and <strong>Email Preview Text</strong>.</li>
            <li>Change <strong>Email Status</strong> to <em>Ready to Send</em> and save.</li>
            <li>Return here and click <strong>Send Now</strong>.</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
