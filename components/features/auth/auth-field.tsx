import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const authInputClass =
  "h-12 rounded-xl border-[1.5px] border-pace-line-strong bg-white px-4 text-[15px] text-pace-ink placeholder:text-pace-muted focus-visible:border-2 focus-visible:border-pace-ink focus-visible:ring-0 md:text-[15px]";

type AuthFieldProps = Omit<React.ComponentProps<"input">, "onChange"> & {
  label: string;
  onValueChange: (value: string) => void;
};

export function AuthField({ label, onValueChange, id, className, ...props }: AuthFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={fieldId} className="text-[13px] font-semibold leading-normal text-pace-ink">
        {label}
      </Label>
      <Input
        id={fieldId}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(authInputClass, className)}
        {...props}
      />
    </div>
  );
}
