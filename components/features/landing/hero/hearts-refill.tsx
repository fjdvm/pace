import { LandingIcon } from "../shared/landing-icon";

const trail = [
  { name: "hero-refill-1", left: 0, top: 112, size: 10 },
  { name: "hero-refill-2", left: 30, top: 104, size: 12 },
  { name: "hero-refill-3", left: 44, top: 88, size: 9 },
  { name: "hero-refill-4", left: 66, top: 86, size: 11 },
  { name: "hero-refill-5", left: 80, top: 70, size: 9 },
  { name: "hero-refill-6", left: 104, top: 66, size: 12 },
  { name: "hero-refill-7", left: 118, top: 52, size: 10 },
  { name: "hero-refill-8", left: 140, top: 48, size: 9 },
  { name: "hero-refill-4", left: 150, top: 34, size: 11 },
];

const sparks = [
  { left: 34, top: 120 },
  { left: 92, top: 92 },
  { left: 128, top: 70 },
  { left: 166, top: 40 },
];

export function HeartsRefill() {
  return (
    <div className="absolute left-[985px] top-3.5 h-[150px] w-[220px]">
      <LandingIcon
        name="hero-refill-line"
        size={200}
        width={200}
        height={110}
        className="absolute left-1.5 top-5"
      />
      {trail.map((heart, index) => (
        <span
          key={`${heart.name}-${index}`}
          className="absolute animate-pace-twinkle"
          style={{
            left: heart.left,
            top: heart.top,
            animationDelay: `${index * 0.22}s`,
          }}
        >
          <LandingIcon name={heart.name} size={heart.size} />
        </span>
      ))}
      {sparks.map((spark, index) => (
        <span
          key={spark.left}
          className="absolute animate-pace-twinkle"
          style={{
            left: spark.left,
            top: spark.top,
            animationDelay: `${0.4 + index * 0.45}s`,
          }}
        >
          <LandingIcon name="hero-refill-spark" size={8} />
        </span>
      ))}
      <span className="absolute left-[186px] top-2.5 animate-pace-beat">
        <LandingIcon name="hero-refill-heart-big" size={30} />
      </span>
      <span className="absolute left-[-4px] top-[110px] animate-pace-float">
        <LandingIcon name="hero-refill-heart-outline" size={26} />
      </span>
    </div>
  );
}
