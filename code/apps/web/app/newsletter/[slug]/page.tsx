import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";

export const revalidate = 30;

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";
const mediaUrl = (p?: string | null) =>
  !p ? null : p.startsWith("http") ? p : `${CMS_URL}${p}`;
const pickImage = (img: any): string | null =>
  img?.url || img?.data?.attributes?.url ||
  (Array.isArray(img?.data) ? img.data[0]?.attributes?.url : null) || null;

const CATEGORY_COLORS: Record<string, string> = {
  "Community Update":  "bg-blue-100 text-blue-800",
  "Event Recap":       "bg-amber-100 text-amber-800",
  "Partner Spotlight": "bg-purple-100 text-purple-800",
  "Announcement":      "bg-orange-100 text-orange-800",
  "Story":             "bg-green-100 text-green-800",
};

type PostData = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  body: any[] | null;
  category: string | null;
  authorName: string | null;
  publishDate: string | null;
  coverUrl: string | null;
};

async function getPost(slug: string): Promise<PostData | null> {
  try {
    // Try by slug first, then by documentId
    const bySlug = await fetch(
      `${CMS_URL}/api/newsletter-posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=coverImage`,
      { next: { revalidate: 30 } }
    );
    if (bySlug.ok) {
      const json = await bySlug.json();
      const row = json?.data?.[0];
      if (row) return mapRow(row);
    }
    // Fallback: documentId
    const byDoc = await fetch(
      `${CMS_URL}/api/newsletter-posts?filters[documentId][$eq]=${encodeURIComponent(slug)}&populate=coverImage`,
      { next: { revalidate: 30 } }
    );
    if (!byDoc.ok) return null;
    const json2 = await byDoc.json();
    const row2 = json2?.data?.[0];
    return row2 ? mapRow(row2) : null;
  } catch {
    return null;
  }
}

function mapRow(row: any): PostData {
  const a = row?.attributes ?? row;
  const img = pickImage(a?.coverImage);
  return {
    id: row.id ?? a.id,
    slug: a?.slug ?? row.documentId ?? String(row.id),
    title: a?.title ?? "Newsletter Post",
    excerpt: a?.excerpt ?? null,
    body: Array.isArray(a?.body) ? a.body : null,
    category: a?.category ?? null,
    authorName: a?.authorName ?? null,
    publishDate: a?.publishDate ?? row.createdAt ?? null,
    coverUrl: img ? mediaUrl(img) : null,
  };
}

function fmtDate(iso?: string | null) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
    });
  } catch { return null; }
}

function renderBlocks(blocks?: any[] | null) {
  if (!blocks?.length) return null;
  return (
    <div className="max-w-none text-neutral-800 leading-relaxed space-y-4
      [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-[#004080] [&_h1]:mt-6 [&_h1]:mb-3
      [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#004080] [&_h2]:mt-5 [&_h2]:mb-2
      [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#004080] [&_h3]:mt-4 [&_h3]:mb-2
      [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-3 [&_h4]:mb-1
      [&_p]:text-base [&_p]:leading-relaxed
      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1
      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1
      [&_li]:text-base
      [&_blockquote]:border-l-4 [&_blockquote]:border-[#f7941D] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-600">
      {blocks.map((b: any, i: number) => {
        if (b?.type === "paragraph") {
          const text = (b?.children ?? []).map((c: any) => c?.text ?? "").join("");
          return text ? <p key={i}>{text}</p> : null;
        }
        if (b?.type === "heading") {
          const text = (b?.children ?? []).map((c: any) => c?.text ?? "").join("");
          const level = b?.level ?? 2;
          if (level === 1) return <h1 key={i}>{text}</h1>;
          if (level === 2) return <h2 key={i}>{text}</h2>;
          if (level === 3) return <h3 key={i}>{text}</h3>;
          return <h4 key={i}>{text}</h4>;
        }
        if (b?.type === "list") {
          const items = (b?.children ?? []).map((li: any, j: number) => {
            const text = (li?.children ?? []).map((c: any) => c?.text ?? "").join("");
            return <li key={j}>{text}</li>;
          });
          return b?.format === "ordered"
            ? <ol key={i}>{items}</ol>
            : <ul key={i}>{items}</ul>;
        }
        if (b?.type === "quote") {
          const text = (b?.children ?? []).map((c: any) => c?.text ?? "").join("");
          return <blockquote key={i}>{text}</blockquote>;
        }
        // Fallback: try to get any text
        const fallback = (b?.children ?? []).map((c: any) => c?.text ?? "").join("");
        return fallback ? <p key={i}>{fallback}</p> : null;
      })}
    </div>
  );
}

export default async function NewsletterPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  // If slug starts with "placeholder" it's a fallback — just go back
  if (!post || slug.startsWith("placeholder")) return notFound();

  const dateStr = fmtDate(post.publishDate);
  const catColor = post.category ? (CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-700") : null;

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header band */}
      <section
        className="rounded-2xl p-6 text-white shadow-lg mb-6"
        style={{ background: "linear-gradient(135deg,#0a3680 0%,#0d4ea6 55%,#f79520 100%)" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            {post.category && catColor && (
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium mb-2 ${catColor}`}>
                {post.category}
              </span>
            )}
            <h1 className="text-2xl font-extrabold">{post.title}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-white/80 text-sm">
              {dateStr && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {dateStr}
                </span>
              )}
              {post.authorName && (
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" /> {post.authorName}
                </span>
              )}
            </div>
          </div>
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm shrink-0"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </section>

      {/* Cover image */}
      {post.coverUrl && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-black/5 bg-white shadow">
          <img
            src={post.coverUrl}
            alt={post.title}
            className="h-72 sm:h-96 w-full object-cover"
          />
        </div>
      )}

      {/* Body */}
      <section className="rounded-2xl border border-black/5 bg-white shadow p-6 sm:p-8">
        {post.excerpt && (
          <p className="text-lg text-neutral-500 italic border-l-4 border-[#f7941D] pl-4 mb-6">
            {post.excerpt}
          </p>
        )}
        {renderBlocks(post.body) ?? (
          <p className="text-neutral-500">Content coming soon.</p>
        )}
        <div className="mt-8">
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm hover:bg-neutral-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Newsletter
          </Link>
        </div>
      </section>
    </main>
  );
}
