import React from "react";
import { Film, MapPin, PhoneCall } from "lucide-react";

interface HeaderProps {
  onOpenTheaterGuide: () => void;
  onOpenVoiceAgent: () => void;
  pendingTasksCount: number;
  isResultsMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTheaterGuide,
  onOpenVoiceAgent,
  pendingTasksCount,
  isResultsMode = false
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-cinema-950/90 backdrop-blur-md transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500 text-cinema-950 font-black shadow-sm">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-white font-sans">
                Movie Hall Finder
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-medium">
                V2.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              不用自己查半天，我幫你挑今天最值得看的那一場。
            </p>
          </div>
        </div>

        {/* Action Buttons (Results Mode Only) */}
        {isResultsMode && (
          <div className="flex items-center space-x-2 animate-fadeIn">
            <button
              onClick={onOpenTheaterGuide}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-slate-300 hover:text-white transition-all"
              title="去這間影城：停車折抵、交通與商場美食"
            >
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden xs:inline">去這間影城</span>
              <span className="xs:hidden">影城</span>
            </button>

            <button
              onClick={onOpenVoiceAgent}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/20 transition-all relative"
              title="幫我問影城：影廳資料還沒確認，請 AI 撥電話確認"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>幫我問影城</span>
              {pendingTasksCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                  {pendingTasksCount}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
