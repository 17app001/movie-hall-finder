import React from "react";
import { Film, ShieldCheck, MapPin, Sparkles } from "lucide-react";

interface HeaderProps {
  onOpenTheaterGuide: () => void;
  onOpenVoiceAgent: () => void;
  pendingTasksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTheaterGuide,
  onOpenVoiceAgent,
  pendingTasksCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-cinema-950/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Logo & Product Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 shadow-glow-accent ring-1 ring-amber-400/50">
              <Film className="w-6 h-6 text-black" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-cinema-950" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 font-sans">
                  <span>Movie Hall Finder</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold tracking-normal">
                    v1.1 POC
                  </span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                拒絕坐小廳、踩雷爛音響 · 專為影迷挑選「最值得去的那一場」
              </p>
            </div>
          </div>

          {/* Action Pills & Transparency Status */}
          <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
            {/* Principles Tag */}
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>資料可以少，但不能假</span>
            </div>

            {/* Theater Guide Button */}
            <button
              onClick={onOpenTheaterGuide}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cinema-850 hover:bg-cinema-800 border border-white/10 hover:border-amber-500/40 text-xs font-semibold text-slate-200 transition-all shadow-sm"
              title="查看桃園火車站與林口三井影城真實地址與電話"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>影城導覽 (桃園/林口)</span>
            </button>

            {/* AI Voice Agent / Missing Info Simulator */}
            <button
              onClick={onOpenVoiceAgent}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-900/60 to-purple-900/60 hover:from-indigo-800/80 hover:to-purple-800/80 border border-indigo-500/30 hover:border-indigo-400 text-xs font-semibold text-indigo-200 transition-all relative shadow-sm"
              title="模擬 AI Voice Agent 客服自動外呼補查未知影廳規格"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>AI 客服外呼補問</span>
              {pendingTasksCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                  {pendingTasksCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* High-visibility Data Disclaimer Strip (Doc v1.1 Rule 3) */}
        <div className="mt-2.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-[11px] text-amber-300/90">
          <div className="flex items-center space-x-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="font-semibold text-amber-300">資料透明度原則：</span>
            <span className="truncate text-amber-200/80">影城與地理資訊為官方真實認證；場次與部分票價為開發 Mock Seed，皆嚴格分流標記。</span>
          </div>
          <span className="hidden md:inline shrink-0 text-amber-400/80 pl-2 font-mono">
            更新時間: 2026-09-05
          </span>
        </div>
      </div>
    </header>
  );
};

