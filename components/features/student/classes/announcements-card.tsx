import type { StreamPostData } from "@/components/features/classes/types";

type AnnouncementsCardProps = {
  posts: StreamPostData[];
  onOpenStream: () => void;
};

const dayFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

function label(iso: string) {
  const date = new Date(iso);
  return date.toDateString() === new Date().toDateString() ? "Today" : dayFormat.format(date);
}

export function AnnouncementsCard({ posts, onOpenStream }: AnnouncementsCardProps) {
  const latest = posts.filter((p) => p.body).slice(0, 2);

  return (
    <section className="flex flex-col gap-3.5 rounded-[20px] border-[1.5px] border-pace-line bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold leading-snug tracking-[-0.005em] text-pace-ink">Announcements</h2>
        <button
          type="button"
          onClick={onOpenStream}
          className="cursor-pointer text-[13px] font-semibold text-pace-green-deep"
        >
          Open stream
        </button>
      </div>
      {latest.length === 0 && <p className="text-[13px] text-pace-muted">No announcements yet.</p>}
      {latest.map((post) => (
        <div key={post.id} className="flex flex-col gap-1 text-[13px] leading-normal">
          <span className="text-pace-muted">{label(post.createdAt)}</span>
          <span className="line-clamp-3 text-pace-ink">{post.body}</span>
        </div>
      ))}
    </section>
  );
}
