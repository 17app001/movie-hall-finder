import React, { useState } from "react";
import { RecommendationResult } from "../types";
import {
  Clock,
  Swords,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react";

interface ShowtimeListProps {
  candidates: RecommendationResult[];
  onInspectHall: (hallId: string) => void;
  onOpenCompareModal?: (hallId?: string) => void;
}

export const ShowtimeList: React.FC<ShowtimeListProps> = ({
  candidates,
  onInspectHall,
  onOpenCompareModal
}) => {
  const [showAll, setShowAll] = useState(false);

  if (candidates.length === 0) {
    return (
      <div className="bg-cinema-900/60 rounded-2xl p-6 text-center text-slate-400 border border-white/[0.08]">
        <AlertCircle className="w-7 h-7 text-amber-400 mx-auto mb-2 opacity-80" />
        <p className="text-sm font-bold text-white">此條件下沒有其他替代場次</p>
        <p className="text-xs text-slate-400 mt-1">
          點擊「想更合你胃口？」可切換時段或開啟跨區林口！
        </p>
      </div>
    );
  }

  // V2 Section 7: Show top 2-3 alternatives by default
  const displayedCandidates = showAll ? candidates : candidates.slice(0, 3);

  return (
    <section id="alternatives-section" className="space-y-3.5 pt-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span>其他推薦場次</span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-semibold">
            {candidates.length} 場候選
          </span>
        </h3>
        <span className="text-xs text-slate-400">
          讓你看懂「為什麼不是第一名」
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {displayedCandidates.map((item, index) => {
          const { showtime, theater, hall, recommendScore, whyNotFirst, humanSummary } = item;
          const startTimeObj = new Date(showtime.startTime);
          const timeStr = `${startTimeObj.getHours().toString().padStart(2, "0")}:${startTimeObj.getMinutes().toString().padStart(2, "0")}`;
          const effectivePrice = showtime.promoPrice ?? showtime.standardPrice ?? 320;

          // Ranking label (#2 比較近 / #3 比較省 / etc.)
          const rankNum = index + 2;
          let rankLabel = `#${rankNum} 備選`;
          if (rankNum === 2) {
            rankLabel = theater.district === "桃園區" ? "#2 比較近" : "#2 備選旗艦";
          } else if (rankNum === 3) {
            rankLabel = effectivePrice <= 300 ? "#3 比較省" : "#3 晚場推薦";
          }

          return (
            <div
              key={showtime.id}
              className="bg-cinema-900/80 hover:bg-cinema-850/90 border border-white/[0.08] hover:border-white/20 rounded-2xl p-4 sm:p-5 transition-all shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left Info: Rank badge + Time + Theater + Hall */}
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-amber-300 font-black text-xs">
                      {rankLabel}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      {recommendScore} 分
                    </span>
                    {hall?.dataStatus === "unverified" && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400">
                        待確認
                      </span>
                    )}
                  </div>

                  {/* Showtime, Cinema, Hall */}
                  <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-bold text-white">
                    <span className="text-amber-400 flex items-center gap-1 font-black">
                      <Clock className="w-3.5 h-3.5" />
                      {timeStr}
                    </span>
                    <span className="text-white/20">·</span>
                    <span className="text-slate-200">{theater.name}</span>
                    <span className="text-white/20">·</span>
                    <span className="text-slate-300 font-normal">{hall?.hallNo || "一般廳"}</span>
                    <span className="text-white/20">·</span>
                    <span className="text-xs font-semibold text-slate-400">NT${effectivePrice}</span>
                  </div>

                  {/* Why not first? Plain language explanation (V2 Section 7) */}
                  <div className="text-xs sm:text-sm text-slate-300 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/5">
                    「{whyNotFirst || humanSummary}」
                  </div>
                </div>

                {/* Right Actions: 跟第一名 PK & 這間廳怎麼樣？ */}
                <div className="flex items-center space-x-2 pt-1 sm:pt-0 shrink-0">
                  {onOpenCompareModal && (
                    <button
                      type="button"
                      onClick={() => onOpenCompareModal(hall?.id)}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-bold text-slate-200 hover:text-white flex items-center justify-center gap-1.5 transition-all border border-white/10"
                    >
                      <Swords className="w-3.5 h-3.5 text-amber-400" />
                      <span>跟第一名 PK</span>
                    </button>
                  )}

                  {hall && (
                    <button
                      type="button"
                      onClick={() => onInspectHall(hall.id)}
                      className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-400 hover:text-slate-200 transition-all"
                    >
                      這間廳怎麼樣？
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more toggle if candidates > 3 */}
      {candidates.length > 3 && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-400 hover:text-white transition-all inline-flex items-center gap-1.5"
          >
            <span>{showAll ? "收合替代場次" : `查看其餘 ${candidates.length - 3} 場候選`}</span>
            {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </section>
  );
};
