export const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";

export async function api<T>(path: string, init?: RequestInit & { revalidateSeconds?: number }): Promise<T> {
  const base = CMS_URL.replace(/\/$/, "");
  const url = `${base}${path.startsWith("/") ? path : "/" + path}`;

  const { revalidateSeconds, ...rest } = init || {};

  const res = await fetch(url, {
    cache: revalidateSeconds ? "force-cache" : "no-store",
    next: revalidateSeconds ? { revalidate: revalidateSeconds } : undefined,
    ...rest,
  });

  if (!res.ok) {
    let msg = `Strapi request failed: ${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      // Strapi often returns { error: { message } }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      msg = (data?.error?.message as string) || msg;
    } catch {}
    throw new Error(msg);
  }

  return (await res.json()) as T;
}

export function mediaUrl(path?: string | null): string {
  if (!path) return "";
  return path.startsWith("http") ? path : `${CMS_URL}${path}`;
}
