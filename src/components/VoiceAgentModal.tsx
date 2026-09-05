import React, { useState, useEffect } from "react";
import { MissingInfoTask } from "../types";
import { SIMULATED_CALL_SCRIPTS, VoiceCallStep } from "../services/missingInfoService";
import {
  X,
  PhoneCall,
  CheckCircle2,
  PhoneForwarded
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
      { sender: "ai", text: `📞 正在撥打至 ${task.theaterName} 客服 (${task.suggestedPhone})...`, delayMs: 800 },
      { sender: "theater", text: `您好，這裡是 ${task.theaterName}，請問有什麼能協助您？`, delayMs: 1400 },
      { sender: "ai", text: `您好！想確認貴影城 ${task.hallNo || "指定影廳"} 的最新規格資訊，包含席位與放映設備。`, delayMs: 1800 },
      { sender: "theater", text: `好的！此廳經現場工程確認，規格已更新為官方認證標準。`, delayMs: 2000 },
      { sender: "ai", text: `謝謝您，資料已完成確認並即時更新！`, delayMs: 1200 }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-[calc(100vw-24px)] sm:max-w-md rounded-2xl sm:rounded-3xl bg-cinema-900 border border-white/10 shadow-2xl p-5 sm:p-6 space-y-4 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header (V2 Section 11: 幫我問影城 📞) */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>規格確認服務</span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            幫我問影城 📞
          </h3>
          <p className="text-xs text-slate-400">
            這個影廳資料還沒確認，系統正在幫你向影城確認
          </p>
        </div>

        {/* Status Call Strip */}
        <div className="p-3.5 rounded-2xl bg-cinema-950 border border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <PhoneForwarded className={`w-5 h-5 ${isCalling ? "animate-pulse" : ""}`} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{task.theaterName}</div>
              <div className="text-[11px] text-slate-400">
                {isCalling ? "正在確認中..." : isDone ? "✅ 已確認完成" : "準備通話"}
              </div>
            </div>
          </div>

          {/* Sound animation */}
          {isCalling && (
            <div className="flex items-center gap-1">
              {[40, 80, 50, 90, 60].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-amber-400 rounded-full animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call Content Stream */}
        <div className="space-y-2.5 max-h-56 overflow-y-auto p-3 rounded-2xl bg-cinema-950/60 border border-white/5 text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl animate-fadeIn ${
                msg.sender === "ai"
                  ? "bg-amber-500/10 text-amber-200 border border-amber-500/20 ml-2"
                  : "bg-white/[0.06] text-slate-200 border border-white/5 mr-2"
              }`}
            >
              <div className="text-[10px] font-bold text-slate-400 mb-0.5">
                {msg.sender === "ai" ? "🤖 系統智能助手" : `🏢 ${task.theaterName} 客服`}
              </div>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Success Notice */}
        {isDone && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>已確認完成！資料庫狀態已即時更新，推薦分數已重新計算。</span>
          </div>
        )}

        {/* Bottom Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 hover:text-white font-bold text-xs transition-all text-center"
        >
          {isDone ? "完成並返回" : "關閉"}
        </button>
      </div>
    </div>
  );
};
