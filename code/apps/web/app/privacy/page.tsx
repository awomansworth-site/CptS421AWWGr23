import { CMS_URL as CMS_URL_FROM_LIB } from "@/lib/strapi";


async function fetchSingleType(path: string) {
  try {
    const res = await fetch(`${CMS_URL}${path}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data?.attributes ?? json?.data;
  } catch {
    return null;
  }
}

function renderRichText(blocks: any) {
  if (!Array.isArray(blocks)) return null;

  return blocks.map((block: any, i: number) => {
    if (block.type === "paragraph") {
      return (
        <p key={i} className="mb-4">
          {block.children?.map((c: any) => c.text).join("")}
        </p>
      );
    }

    if (block.type === "heading") {
      return (
        <h2 key={i} className="text-xl font-bold mt-6 mb-3">
          {block.children?.map((c: any) => c.text).join("")}
        </h2>
      );
    }

    return null;
  });
}

const CMS_URL =
  process.env.NEXT_PUBLIC_CMS_URL ||
  CMS_URL_FROM_LIB ||
  "http://localhost:1337";

export default async function PrivacyPage() {
  const data = await fetchSingleType("/api/privacy-policy");

  if (!data) {
    return <div className="p-10 text-center">No content available.</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>

      {data.lastUpdated && (
        <p className="text-sm text-gray-500 mb-6">
          Last updated: {new Date(data.lastUpdated).toLocaleDateString()}
        </p>
      )}

      <div className="text-gray-700 leading-relaxed">
        {renderRichText(data.content)}
      </div>
    </main>
  );
}