export function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-semibold text-pace-ink">
      {children}
    </label>
  );
}
