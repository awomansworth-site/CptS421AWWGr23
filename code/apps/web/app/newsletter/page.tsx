import NewsletterContent, { type NewsletterPost } from "@/components/NewsletterContent";
import NewsletterSignup from "@/components/NewsletterSignup";

export const revalidate = 30;

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";

const mediaUrl = (p?: string | null) =>
  !p ? null : p.startsWith("http") ? p : `${CMS_URL}${p}`;

const pickImage = (img: any): string | null =>
  img?.url || img?.data?.attributes?.url ||
  (Array.isArray(img?.data) ? img.data[0]?.attributes?.url : null) || null;

const PLACEHOLDER_POSTS: NewsletterPost[] = [
  {
    id: 9001,
    documentId: "placeholder-1",
    slug: "placeholder-1",
    title: "Spring Gala 2026 Recap: A Night to Remember",
    excerpt:
      "Our 4th Annual Gala brought together over 200 community members for an inspiring evening of recognition, celebration, and connection. Here are the highlights.",
    category: "Event Recap",
    authorName: "AWW Team",
    publishDate: "2026-04-20T00:00:00.000Z",
    coverUrl: null,
    featured: true,
  },
  {
    id: 9002,
    documentId: "placeholder-2",
    slug: "placeholder-2",
    title: "Partner Spotlight: Spokane Workforce Council",
    excerpt:
      "Thanks to our $30,000 grant partnership with the Spokane Workforce Council, we've helped over 75 women access job training and employment resources this quarter.",
    category: "Partner Spotlight",
    authorName: "AWW Team",
    publishDate: "2026-04-10T00:00:00.000Z",
    coverUrl: null,
    featured: false,
  },
  {
    id: 9003,
    documentId: "placeholder-3",
    slug: "placeholder-3",
    title: "New Workshop Series: Financial Literacy for Women",
    excerpt:
      "Starting May 1st, AWW is launching a 6-week financial literacy workshop series designed to help women build budgeting skills, improve credit, and plan for the future.",
    category: "Announcement",
    authorName: "AWW Team",
    publishDate: "2026-04-05T00:00:00.000Z",
    coverUrl: null,
    featured: false,
  },
  {
    id: 9004,
    documentId: "placeholder-4",
    slug: "placeholder-4",
    title: "Community Update: April 2026",
    excerpt:
      "This month we welcomed 18 new program participants, hosted two community dinners, and completed our first collaboration with Unity Family Resource Center.",
    category: "Community Update",
    authorName: "AWW Team",
    publishDate: "2026-04-01T00:00:00.000Z",
    coverUrl: null,
    featured: false,
  },
  {
    id: 9005,
    documentId: "placeholder-5",
    slug: "placeholder-5",
    title: "Story: From Struggle to Strength — Amara's Journey",
    excerpt:
      "After losing her job and facing housing insecurity, Amara found AWW at a pivotal moment. Today she's employed full-time and mentoring others. Read her story.",
    category: "Story",
    authorName: "AWW Team",
    publishDate: "2026-03-25T00:00:00.000Z",
    coverUrl: null,
    featured: false,
  },
];

async function getNewsletterPosts(): Promise<NewsletterPost[]> {
  try {
    const url =
      `${CMS_URL}/api/newsletter-posts?` +
      `populate=coverImage&filters[active][$eq]=true` +
      `&sort=publishDate:desc&pagination[pageSize]=100`;
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const rows: any[] = (await res.json())?.data ?? [];
    if (!rows.length) return [];
    return rows.map((row) => {
      const a = row?.attributes ?? row;
      const img = pickImage(a?.coverImage);
      return {
        id: row.id ?? a.id,
        documentId: row.documentId ?? a.documentId ?? String(row.id),
        slug: a?.slug ?? row.documentId ?? String(row.id),
        title: a?.title ?? "Newsletter Post",
        excerpt: a?.excerpt ?? "",
        category: a?.category ?? null,
        authorName: a?.authorName ?? null,
        publishDate: a?.publishDate ?? row.createdAt ?? null,
        coverUrl: img ? mediaUrl(img) : null,
        featured: a?.featured ?? false,
      } as NewsletterPost;
    });
  } catch {
    return [];
  }
}

export default async function NewsletterPage() {
  const cms = await getNewsletterPosts();
  const posts = cms.length > 0 ? cms : PLACEHOLDER_POSTS;
  return (
    <>
      <NewsletterSignup />
      <NewsletterContent posts={posts} />
    </>
  );
}
