import { scaleLabels, type Scale } from "@/lib/study/sitting-form";

type Props = { part: string; title: string; subtitle?: string; scale?: Scale };

export function PartHeader({ part, title, subtitle, scale }: Props) {
  return (
    <div className="flex flex-col gap-2 pt-6">
      <p className="text-xs font-bold tracking-[0.06em] text-lp-teal">{part}</p>
      <h2 className="font-lp-serif text-[28px] font-medium leading-tight tracking-[-0.008em] text-lp-ink sm:text-[32px]">
        {title}
      </h2>
      {subtitle && <p className="text-base leading-6 text-lp-muted">{subtitle}</p>}
      {scale && (
        <ul className="flex flex-wrap gap-1.5 pt-1.5">
          {scaleLabels(scale)
            .map((label, index) => `${index + 1} = ${label}`)
            .reverse()
            .map((key) => (
              <li key={key} className="rounded-full bg-[#eae9e6] px-2.5 py-[5px] text-xs font-medium text-[#3d3d3d]">
                {key}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
