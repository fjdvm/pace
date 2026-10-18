import { LandingIcon } from "../shared/landing-icon";

export function HeartRow() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="animate-pace-beat"
            style={{ animationDelay: `${index * 0.25}s` }}
          >
            <LandingIcon name="heart-red" size={20} />
          </span>
        ))}
        {[3, 4].map((index) => (
          <span
            key={index}
            className="animate-pace-twinkle"
            style={{ animationDelay: `${(index - 3) * 1.2}s` }}
          >
            <LandingIcon name="heart-cream-outline" size={20} />
          </span>
        ))}
      </div>
      <span className="pace-small text-pace-cream">+1 in 30 min</span>
    </div>
  );
}
