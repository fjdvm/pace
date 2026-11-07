import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@/components/features/assignments/workspace-chat/chat-bubble";
import { OutOfHeartsCard } from "./out-of-hearts-card";
import { TutorComposer } from "./tutor-composer";
import { TutorHeader } from "./tutor-header";
import { TutorMessages } from "./tutor-messages";

type TutorPanelProps = {
  tieredHintsEnabled?: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  isSubmitted: boolean;
  hearts: number;
  maxHearts: number;
  regenMinutes?: number;
  failedTest?: number;
  heartsSpent: number;
  timeToRegen: string;
  refillMinutes: number | null;
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onSend: (text: string) => void;
};

export function TutorPanel(props: TutorPanelProps) {
  const outOfHearts = props.hearts <= 0 && !props.isSubmitted;

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden lg:border-l border-pace-line bg-white">
      <TutorHeader
        tieredHintsEnabled={props.tieredHintsEnabled}
        hearts={props.hearts}
        maxHearts={props.maxHearts}
        heartsSpent={props.heartsSpent}
        timeToRegen={props.timeToRegen}
      />
      <TutorMessages
        tieredHintsEnabled={props.tieredHintsEnabled}
        messages={props.messages}
        isLoading={props.isLoading}
        isStreaming={props.isStreaming}
      >
        {props.messages.length === 0 && !props.isSubmitted && (
          <div className="flex flex-col items-start gap-2 pt-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted">
              Try asking
            </p>
            {(props.failedTest ? [`Why is test ${props.failedTest} failing?`, "Explain what my code does", "What concept does this use?"] : ["Explain what my code does", "What concept does this use?", "How do I start?"]).map((text) => (
              <Button
                key={text}
                variant="outline"
                disabled={outOfHearts || props.isLoading}
                onClick={() => props.onSend(text)}
                className="h-auto rounded-[16px] border-pace-purple px-3 py-2 text-[13px] font-bold text-pace-purple"
              >
                {text}
              </Button>
            ))}
          </div>
        )}
        {outOfHearts && <OutOfHeartsCard timeToRegen={props.timeToRegen} maxHearts={props.maxHearts} />}
      </TutorMessages>
      <TutorComposer
        hearts={props.hearts}
        refillMinutes={props.refillMinutes}
        disabled={outOfHearts}
        isLoading={props.isLoading}
        isSubmitted={props.isSubmitted}
        timeToRegen={props.timeToRegen}
        value={props.chatInput}
        onChange={props.onChatInputChange}
        onSubmit={(e) => {
          e.preventDefault();
          if (props.chatInput.trim()) props.onSend(props.chatInput);
        }}
        regenMinutes={props.regenMinutes ?? 30}
      />
    </div>
  );
}
