type Props = {
  title: string;
  excerpt?: string;
  image?: string;
  href: string;
  tag?: string;
  readTime?: string;
  focalY?: "top" | "center" | "bottom";
};

const objectPosFromFocal = (f?: "top" | "center" | "bottom") =>
  f === "top" ? "50% 20%" : f === "bottom" ? "50% 80%" : "50% 50%"

export default function StoryCard({ title, excerpt, image, href, tag, readTime, focalY, }: Props) {
  const hasImage = Boolean(image);
  const objectPosition = objectPosFromFocal(focalY);
  return (
    <article className="reveal overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-[16/9] w-full">
        {hasImage ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
            style={{objectPosition}}
            loading="lazy"
            />
        ) : (
          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a3680] via-[#0d4ea6] to-[#f79520" />
            <div className="absolute inset-0 opacity-10 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%), radial-gradient(circle_at_80%_30%,white,transparent_35%"/>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          {tag && (
            <span className="rounded-full bg-[#f7941D] px-2 py-1 text-xs font-medium text-white">
              {tag}
              </span>
            )}
          {readTime && (
            <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-700">
              {readTime}
              </span>
            )}
        </div>
        
        <h3 className="mt-3 text-lg font-semibold text-neutral-900 line-clamp-2">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-2 text-sm text-neutral-600 line-clamp-3">
            {excerpt}
            </p>
          )}

        <a
          href={href}
          className="mt-5 inline-flex items-center justify-center rounded-md border border-[#f7941D] px-4 py-2 text-[#f7941D] transition hover:bg-[#f7941D] hover:text-white"
        >
          Read Full Story <span className="ml-2">→</span>
        </a>
      </div>
    </article>
  );
}
