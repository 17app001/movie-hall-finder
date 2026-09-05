import React from "react";
import { MissingInfoTask } from "../types";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

interface MissingInfoPanelProps {
  tasks: MissingInfoTask[];
  onStartVoiceCall: (task: MissingInfoTask) => void;
}

export const MissingInfoPanel: React.FC<MissingInfoPanelProps> = ({
  tasks,
  onStartVoiceCall
}) => {
  return (
    <div className="glass-panel rounded-3xl p-6 mb-10 border border-indigo-500/20 shadow-xl relative overflow-hidden">
      {/* Background Neon Flare */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-black text-white">
              影城規格補查中心（幫我問影城）
            </h3>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              AI 自動電話查詢
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            資料可以少，但不能假。缺少影廳規格時，由系統代你向影城客服核實，絕不胡亂猜測。
          </p>
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {tasks.map((task) => {
          const isResolved = task.status === "resolved";

          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all ${
                isResolved
                  ? "bg-emerald-500/5 border-emerald-500/25"
                  : "bg-cinema-900/80 border-white/10 hover:border-indigo-500/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {task.theaterName} {task.hallNo ? `· ${task.hallNo}` : ""}
                  </span>
                  <span className="text-[11px] text-amber-400 font-medium">
                    待查項目：{task.fieldLabel}
                  </span>
                </div>

                {isResolved ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3" /> 已核實更新
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3" /> 待補查
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 mb-3 bg-cinema-950/60 p-2 rounded-lg border border-white/5">
                {task.notes}
              </p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400 font-mono">
                  客服專線: {task.suggestedPhone}
                </span>

                {!isResolved ? (
                  <button
                    onClick={() => onStartVoiceCall(task)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-glow-neon transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>幫我確認</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    資料庫已核實
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

