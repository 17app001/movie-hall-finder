import React from "react";
import { RecommendationResult } from "../types";
import {
  Clock,
  MapPin,
  Tag,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Info,
  Trophy
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
  if (candidates.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 mb-8 border border-white/10">
        <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
        <p className="text-base font-bold text-white">此篩選條件下無其他候選場次</p>
        <p className="text-xs text-slate-400 mt-1">
          建議切換時段或點擊「偏好加權」啟用「允許跨區移動（桃園 ↔ 林口）」！
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-10">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <span>其他候選場次（評審推薦次序）</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 font-mono font-bold">
            {candidates.length} 場
          </span>
        </h3>
        <span className="text-xs text-slate-400">
          依演算法綜合推薦分高低排序
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {candidates.map((item, index) => {
          const { showtime, theater, hall, recommendScore, recommendReasons, humanSummary, additivePoints } = item;
          const startTimeObj = new Date(showtime.startTime);
          const timeStr = `${startTimeObj.getHours().toString().padStart(2, "0")}:${startTimeObj.getMinutes().toString().padStart(2, "0")}`;
          const effectivePrice = showtime.promoPrice ?? showtime.standardPrice;

          // Rank Badge Title & Colors (Review 7.2 & 8 Step 4)
          const isSecond = index === 0;
          const isThird = index === 1;

          const rankLabel = isSecond
            ? "🥈 第二選擇"
            : isThird
            ? "🥉 第三選擇"
            : `🏅 第 ${index + 2} 順位`;

          const rankBadgeStyle = isSecond
            ? "bg-slate-300/20 text-slate-200 border-slate-300/40 ring-1 ring-slate-300/30"
            : isThird
            ? "bg-amber-700/30 text-amber-300 border-amber-600/40"
            : "bg-white/5 text-slate-400 border-white/10";

          // Quick badge chips (Review 7.3)
          const quickBadges = [
            hall?.seatCount && hall.seatCount >= 200 ? `🎬 ${hall.seatCount} 席大廳` : null,
            hall?.format && hall.format !== "Standard" ? `🔊 ${hall.format}` : null,
            theater.district === "林口區" ? "🚗 跨區 15 分鐘" : "🚶 火車站步行",
            showtime.promoPrice ? "💳 有優惠" : null,
            hall?.dataStatus === "verified" ? "✅ 已驗證" : "⚠️ 待確認"
          ].filter(Boolean) as string[];

          return (
            <div
              key={showtime.id}
              className={`glass-card glass-card-hover rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border transition-all ${
                isSecond
                  ? "border-slate-400/30 bg-cinema-900/90 shadow-lg"
                  : isThird
                  ? "border-amber-700/30 bg-cinema-900/80"
                  : "border-white/5 bg-cinema-950/60"
              }`}
            >
              {/* Col 1: Rank Score & Badge */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-cinema-950/90 border border-white/10 text-center">
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {recommendScore}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    推薦分
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-lg border ${rankBadgeStyle}`}>
                    {rankLabel}
                  </span>

                  {showtime.dataStatus === "verified" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" /> 已核實
                    </span>
                  )}
                  {showtime.dataStatus === "mock" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      <HelpCircle className="w-3 h-3" /> Demo 資料
                    </span>
                  )}
                  {showtime.dataStatus === "unverified" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                      <AlertCircle className="w-3 h-3" /> 待確認場次
                    </span>
                  )}
                </div>
              </div>

              {/* Col 2: Theater, Time, Why It's Worth It & Quick Chips */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <strong>{theater.name}</strong>
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="text-xs text-slate-400">{theater.transitInfo}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Showtime */}
                  <div className="flex items-center gap-1 text-lg font-black text-white font-mono">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{timeStr}</span>
                  </div>

                  {/* Hall Name */}
                  {hall && (
                    <button
                      onClick={() => onInspectHall(hall.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-amber-400/50 transition-all"
                      title="檢視影廳規格"
                    >
                      <span>{hall.hallNo}</span>
                      <Info className="w-3 h-3 text-slate-400" />
                    </button>
                  )}

                  {/* Quick Chips (Review 7.3) */}
                  <div className="flex flex-wrap gap-1">
                    {quickBadges.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-300"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Why Worth It? (Review 7.2 & 2.C) */}
                <div className="pt-0.5">
                  <p className="text-xs text-amber-200/90 font-medium">
                    💡 <strong>為什麼值得去：</strong>「{humanSummary || recommendReasons.join(" · ")}」
                  </p>
                </div>

                {/* Transparent Additive Mini Chips */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {additivePoints.map((pt, pIdx) => (
                    <span key={pIdx} className="text-[10px] text-slate-400 font-mono bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                      {pt.tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Col 3: Price & Quick Action Buttons */}
              <div className="flex sm:flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
                <div className="text-left lg:text-right">
                  <div className="text-lg font-black text-emerald-300 font-mono flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    <span>${effectivePrice}</span>
                  </div>
                  {showtime.promoDescription && (
                    <span className="text-[11px] text-slate-400 block max-w-[140px] truncate">
                      {showtime.promoDescription}
                    </span>
                  )}
                </div>

                {/* Actions: PK VS First Place + Google Maps */}
                <div className="flex items-center gap-1.5">
                  {onOpenCompareModal && hall && (
                    <button
                      onClick={() => onOpenCompareModal(hall.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow-sm"
                      title="與第 1 名進行規格橫向 PK"
                    >
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span>與第 1 名 PK</span>
                    </button>
                  )}

                  <a
                    href={theater.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cinema-800 hover:bg-cinema-700 text-xs font-semibold text-slate-200 border border-white/10 hover:border-amber-400/40 transition-all shadow-sm"
                  >
                    <span>導航</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

