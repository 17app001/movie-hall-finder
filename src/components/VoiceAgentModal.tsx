import { useState, useEffect } from "react";
import { MissingInfoTask } from "../types";
import { SIMULATED_CALL_SCRIPTS, VoiceCallStep } from "../services/missingInfoService";
import {
  X,
  Sparkles,
  Bot,
  UserCheck,
  CheckCircle2,
  Mic,
  Volume2
} from "lucide-react";

interface VoiceAgentModalProps {
  task: MissingInfoTask | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskResolved: (taskId: string) => void;
}

export const VoiceAgentModal: React.FC<VoiceAgentModalProps> = ({
  task,
  isOpen,
  onClose,
  onTaskResolved
}) => {
  const [messages, setMessages] = useState<VoiceCallStep[]>([]);
  const [isCalling, setIsCalling] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isOpen || !task) {
      setMessages([]);
      setIsCalling(false);
      setIsDone(false);
      return;
    }

    const script = SIMULATED_CALL_SCRIPTS[task.id] || [
      { sender: "ai", text: `📞 撥打至 ${task.theaterName} 客服 (${task.suggestedPhone})...`, delayMs: 800 },
      { sender: "theater", text: `您好，這裡是 ${task.theaterName}，請問有什麼能協助您的？`, delayMs: 1400 },
      { sender: "ai", text: `您好！想確認貴影城 ${task.hallNo || "指定影廳"} 的最新規格資訊，包含席位與投影設備。`, delayMs: 1800 },
      { sender: "theater", text: `好的！此廳經現場工程確認，規格已更新為標準認證規格。`, delayMs: 2000 },
      { sender: "ai", text: `謝謝您，資料已由 AI 語音結構化解析並完成核實！`, delayMs: 1200 }
    ];

    setIsCalling(true);
    let currentIdx = 0;
    const timeouts: NodeJS.Timeout[] = [];

    const scheduleNext = (delay: number) => {
      const t = setTimeout(() => {
        if (currentIdx < script.length) {
          const nextMsg = script[currentIdx];
          setMessages((prev) => [...prev, nextMsg]);
          currentIdx++;
          if (currentIdx < script.length) {
            scheduleNext(script[currentIdx].delayMs);
          } else {
            setIsCalling(false);
            setIsDone(true);
            onTaskResolved(task.id);
          }
        }
      }, delay);
      timeouts.push(t);
    };

    scheduleNext(script[0].delayMs);

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-cinema-900 border border-indigo-500/30 shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header (Review Section 5) */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-glow-neon">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
              影城規格自動補查系統
            </span>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>幫我確認影城規格</span>
            </h2>
          </div>
        </div>

        {/* Friendly User Explanation Strip (Review Section 5) */}
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/25 mb-4 text-xs text-indigo-200 leading-relaxed">
          💡 <strong>系統正在幫你確認：</strong>系統會透過公開資訊與影城自動電話查詢補充未驗證規格（如真實座位數、音效與放映設備），核實後即時更新評分，無須自行撥打電話。
        </div>

        {/* Audio Wave Simulation Strip */}
        <div className="p-4 rounded-2xl bg-cinema-950/90 border border-white/10 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300">
              <Mic className={`w-5 h-5 ${isCalling ? "animate-pulse text-amber-400" : ""}`} />
              {isCalling && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {task.theaterName} 客服
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {task.suggestedPhone} · {isCalling ? "通話進行中 (Audio Streaming)" : isDone ? "通話已順利結束" : "連線中"}
              </span>
            </div>
          </div>

          {/* Animated Wave Bars */}
          {isCalling && (
            <div className="flex items-center gap-1">
              {[40, 70, 30, 90, 60, 100, 50, 80].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-amber-400 rounded-full animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Real-time Transcription Stream */}
        <div className="space-y-3 max-h-60 overflow-y-auto p-3 rounded-2xl bg-cinema-950/60 border border-white/5 mb-5 text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl animate-fadeIn ${
                msg.sender === "ai"
                  ? "bg-indigo-950/40 text-indigo-200 border border-indigo-500/20"
                  : "bg-cinema-850 text-slate-200 border border-white/5"
              }`}
            >
              {msg.sender === "ai" ? (
                <Bot className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{msg.text}</span>
            </div>
          ))}
          {isCalling && (
            <div className="flex items-center gap-2 text-[11px] text-slate-500 animate-pulse pl-1">
              <Volume2 className="w-3.5 h-3.5" />
              <span>語音串流辨識中...</span>
            </div>
          )}
        </div>

        {/* Completion Notice */}
        {isDone && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 mb-4 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              已成功擷取影城客服核實資訊！資料庫狀態已由「待確認」更新為「已驗證」。
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all"
        >
          {isDone ? "完成並關閉" : "關閉面板"}
        </button>
      </div>
    </div>
  );
};

