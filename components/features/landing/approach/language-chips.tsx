const languages = ["Python", "C", "JavaScript", "C#"];

export function LanguageChips() {
  return (
    <div className="flex flex-wrap gap-1.5">
      {languages.map((language) => (
        <span
          key={language}
          className="pace-small rounded-full bg-pace-night px-3 py-1.5 font-semibold text-pace-cream"
        >
          {language}
        </span>
      ))}
    </div>
  );
}
