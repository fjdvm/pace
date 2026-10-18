import { Button } from "@/components/ui/button";

type AuthSubmitButtonProps = {
  isLoading: boolean;
  label: string;
  loadingLabel: string;
};

export function AuthSubmitButton({ isLoading, label, loadingLabel }: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className="h-[52px] w-full cursor-pointer rounded-full border-0 bg-pace-ink px-7 text-[15px] font-bold leading-[1.2] text-white hover:bg-pace-ink/85"
    >
      {isLoading ? loadingLabel : label}
    </Button>
  );
}
