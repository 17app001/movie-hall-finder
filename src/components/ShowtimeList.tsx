import React from "react";
import { RecommendationResult } from "../types";
import {
  Clock,
  MapPin,
  Tag,
  Volume2,
  Users,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Info
} from "lucide-react";

interface ShowtimeListProps {
  candidates: RecommendationResult[];
  onInspectHall: (hallId: string) => void;
}

export const ShowtimeList: React.FC<ShowtimeListProps> = ({
  candidates,
  onInspectHall
}) => {
  if (candidates.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
        <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
        <p className="text-base font-bold text-white">此篩選條件下無其他候選場次</p>
        <p className="text-xs text-slate-400 mt-1">
          建議切換地區範圍（如啟用「允許跨區移動」）或選擇「全部影城」試試看！
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 mb-10">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>其餘候選場次評比</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
            {candidates.length} 場
          </span>
        </h3>
        <span className="text-xs text-slate-400">
          依演算法綜合推薦分高低排序
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {candidates.map((item, index) => {
          const { showtime, theater, hall, recommendScore, recommendReasons, confidence } = item;
          const startTimeObj = new Date(showtime.startTime);
          const timeStr = `${startTimeObj.getHours().toString().padStart(2, "0")}:${startTimeObj.getMinutes().toString().padStart(2, "0")}`;
          const effectivePrice = showtime.promoPrice ?? showtime.standardPrice;

          return (
            <div
              key={showtime.id}
              className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/5 transition-all"
            >
              {/* Col 1: Rank Score & Status */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-cinema-950/80 border border-white/10 text-center">
                  <span className="text-xl font-black text-amber-400 font-mono">
                    {recommendScore}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">
                    #{index + 2} 順位
                  </span>
                </div>

                {/* Status Badge */}
                <div className="flex flex-col gap-1">
                  {showtime.dataStatus === "verified" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" /> 已驗證
                    </span>
                  )}
                  {showtime.dataStatus === "mock" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      <HelpCircle className="w-3 h-3" /> Demo / Mock
                    </span>
                  )}
                  {showtime.dataStatus === "unverified" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                      <AlertCircle className="w-3 h-3" /> 待確認場次
                    </span>
                  )}

                  <span className="text-[11px] text-slate-400">
                    可信度: {confidence === "high" ? "高" : confidence === "medium" ? "中" : "低"}
                  </span>
                </div>
              </div>

              {/* Col 2: Theater, Hall, Time Info */}
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {theater.name}
                  </span>
                  {theater.district === "林口區" && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      跨區探索
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Time Badge */}
                  <div className="flex items-center gap-1.5 text-base font-extrabold text-white font-mono">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{timeStr}</span>
                  </div>

                  {/* Hall Name - Clickable for Inspector */}
                  {hall && (
                    <button
                      onClick={() => onInspectHall(hall.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-amber-400/50 transition-all"
                      title="點擊檢視影廳規格"
                    >
                      <span>{hall.hallNo}</span>
                      <Info className="w-3 h-3 text-slate-400" />
                    </button>
                  )}

                  {/* Hall Format */}
                  {hall && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                      <Volume2 className="w-3 h-3" />
                      {hall.format}
                    </span>
                  )}

                  {/* Seat Count */}
                  {hall?.seatCount ? (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {hall.seatCount} 席
                    </span>
                  ) : (
                    <span className="text-[11px] text-rose-400">席位待查</span>
                  )}
                </div>

                {/* Highlight Reasons */}
                {recommendReasons.length > 0 && (
                  <p className="text-xs text-slate-300 line-clamp-1 pt-0.5">
                    {recommendReasons.join(" · ")}
                  </p>
                )}
              </div>

              {/* Col 3: Price & Direct Actions */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <div className="text-right">
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

                {/* Quick Link Button */}
                <a
                  href={theater.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cinema-800 hover:bg-cinema-700 text-xs font-semibold text-slate-200 border border-white/10 hover:border-amber-400/40 transition-all shadow-sm"
                >
                  <span>地圖導航</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

