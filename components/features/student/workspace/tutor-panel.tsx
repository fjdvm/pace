import type { ChatMessage } from "@/components/features/assignments/workspace-chat/chat-bubble";
import { OutOfHeartsCard } from "./out-of-hearts-card";
import { TutorComposer } from "./tutor-composer";
import { TutorHeader } from "./tutor-header";
import { TutorMessages } from "./tutor-messages";

type TutorPanelProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  isSubmitted: boolean;
  hearts: number;
  maxHearts: number;
  heartsSpent: number;
  timeToRegen: string;
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onSend: (text: string) => void;
};

export function TutorPanel(props: TutorPanelProps) {
  const outOfHearts = props.hearts <= 0 && !props.isSubmitted;

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden border-l border-pace-line bg-white">
      <TutorHeader
        hearts={props.hearts}
        maxHearts={props.maxHearts}
        heartsSpent={props.heartsSpent}
        timeToRegen={props.timeToRegen}
      />
      <TutorMessages messages={props.messages} isLoading={props.isLoading} isStreaming={props.isStreaming}>
        {outOfHearts && <OutOfHeartsCard timeToRegen={props.timeToRegen} />}
      </TutorMessages>
      <TutorComposer
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
        onQuickPrompt={props.onSend}
      />
    </div>
  );
}
