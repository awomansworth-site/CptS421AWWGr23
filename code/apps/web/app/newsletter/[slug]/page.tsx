import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft } from "lucide-react";

export const revalidate = 30;

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";

const mediaUrl = (p?: string | null) =>
  !p ? null : p.startsWith("http") ? p : `${CMS_URL}${p}`;

const pickImage = (img: any): string | null =>
  img?.url ||
  img?.data?.attributes?.url ||
  (Array.isArray(img?.data) ? img.data[0]?.attributes?.url : null) ||
  null;

const CATEGORY_COLORS: Record<string, string> = {
  "Community Update": "bg-blue-100 text-blue-800",
  "Event Recap": "bg-amber-100 text-amber-800",
  "Partner Spotlight": "bg-purple-100 text-purple-800",
  "Announcement": "bg-orange-100 text-orange-800",
  Story: "bg-green-100 text-green-800",
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
    const bySlug = await fetch(
      `${CMS_URL}/api/newsletter-posts?filters[slug][$eq]=${encodeURIComponent(
        slug
      )}&populate=coverImage`,
      { next: { revalidate: 30 } }
    );

    if (bySlug.ok) {
      const json = await bySlug.json();
      const row = json?.data?.[0];
      if (row) return mapRow(row);
    }

    const byDoc = await fetch(
      `${CMS_URL}/api/newsletter-posts?filters[documentId][$eq]=${encodeURIComponent(
        slug
      )}&populate=coverImage`,
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
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function renderBlocks(blocks?: any[] | null) {
  if (!blocks?.length) return null;

  return (
    <div className="prose prose-neutral max-w-none">
      {blocks.map((b: any, i: number) => {
        const text =
          (b?.children ?? []).map((c: any) => c?.text ?? "").join("") || "";

        if (b?.type === "heading") {
          const level = b?.level ?? 2;
          if (level === 1) return <h1 key={i}>{text}</h1>;
          if (level === 2) return <h2 key={i}>{text}</h2>;
          if (level === 3) return <h3 key={i}>{text}</h3>;
          return <h4 key={i}>{text}</h4>;
        }

        if (b?.type === "quote") return <blockquote key={i}>{text}</blockquote>;

        return text ? <p key={i}>{text}</p> : null;
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

  if (!post || slug.startsWith("placeholder")) return notFound();

  const dateStr = fmtDate(post.publishDate);
  const catColor = post.category
    ? CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-700"
    : null;

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <section
        className="rounded-2xl p-8 text-white shadow-lg mb-8"
        style={{
          background:
            "linear-gradient(135deg,#0a3680 0%,#0d4ea6 55%,#f79520 100%)",
        }}
      >
        <div className="flex justify-between items-start gap-4">
          <div>
            {post.category && catColor && (
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium mb-3 ${catColor}`}
              >
                {post.category}
              </span>
            )}

            <h1 className="text-3xl font-extrabold leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-4 mt-3 text-white/80 text-sm">
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
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm shrink-0 hover:bg-white/25 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </section>

      {/* Hero (image OR gradient fallback) */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-black/5 shadow">
        {post.coverUrl ? (
          <img
            src={post.coverUrl}
            alt={post.title}
            className="h-72 sm:h-96 w-full object-cover"
          />
        ) : (
          <div
            className="h-72 sm:h-96 w-full"
            style={{
              background:
                "linear-gradient(135deg,#0a3680 0%,#0d4ea6 55%,#f79520 100%)",
            }}
          />
        )}
      </div>

      {/* Content */}
      <section className="rounded-2xl bg-white shadow border border-black/5 p-8">
        {post.excerpt && (
          <p className="text-lg text-neutral-500 italic border-l-4 border-[#f7941D] pl-4 mb-6">
            {post.excerpt}
          </p>
        )}

        {renderBlocks(post.body) ?? (
          <p className="text-neutral-500">Content coming soon.</p>
        )}

        <div className="mt-10 pt-6 border-t">
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-neutral-50 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Newsletter
          </Link>
        </div>
      </section>
    </main>
  );
}