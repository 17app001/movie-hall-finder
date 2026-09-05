import React, { useState } from "react";
import {
  RecommendationResult
} from "../types";
import {
  Trophy,
  Clock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  Share2,
  Ticket,
  Swords,
  ExternalLink,
  X
} from "lucide-react";

interface TopPickCardProps {
  recommendation: RecommendationResult;
  onInspectHall: (hallId: string) => void;
  onOpenTheaterGuide: () => void;
  onOpenCompareModal?: () => void;
  onScrollToAlternatives?: () => void;
}

export const TopPickCard: React.FC<TopPickCardProps> = ({
  recommendation,
  onInspectHall,
  onOpenTheaterGuide,
  onOpenCompareModal,
  onScrollToAlternatives
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    showtime,
    theater,
    hall,
    movie,
    recommendScore,
    additivePoints,
    humanSummary
  } = recommendation;

  const startTimeObj = new Date(showtime.startTime);
  const endTimeObj = showtime.endTime ? new Date(showtime.endTime) : null;
  const timeStr = `${startTimeObj.getHours().toString().padStart(2, "0")}:${startTimeObj.getMinutes().toString().padStart(2, "0")}`;
  const endTimeStr = endTimeObj
    ? `${endTimeObj.getHours().toString().padStart(2, "0")}:${endTimeObj.getMinutes().toString().padStart(2, "0")}`
    : "";

  const effectivePrice = showtime.promoPrice ?? showtime.standardPrice ?? 320;

  const handleShare = () => {
    const text = `今天推薦去這場！《${movie?.title}》${timeStr} 在 ${theater.name} ${hall?.hallNo || ""}，推薦指數 ${recommendScore}分！`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleScrollDown = () => {
    if (onScrollToAlternatives) {
      onScrollToAlternatives();
    } else {
      const el = document.getElementById("alternatives-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="top-pick-section" className="w-full">
      {/* Hero Card Container (V2: Absolute Protagonist, Film-first layout) */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-cinema-900 via-cinema-900 to-cinema-950 border border-amber-500/30 p-5 sm:p-7 shadow-2xl overflow-hidden">
        {/* Subtle Ambient Backlight Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badge Strip: 🏆 今天最值得看 + 輔助分數 */}
        <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-cinema-950 font-black text-xs tracking-wide">
              <Trophy className="w-3.5 h-3.5 fill-cinema-950" />
              <span>今天最值得看</span>
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              綜合大廳、音效、時間與距離最佳解
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Score as Tasteful Support Badge (V2: not dominating benchmark) */}
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-xs font-bold text-amber-300">
              <span className="text-white font-black text-sm">{recommendScore}</span>
              <span className="text-[10px] text-slate-400">分推薦</span>
            </div>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs"
              title="複製推薦文字分享給朋友"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Main Content: Movie Poster + Hero Details */}
        <div className="flex flex-col md:flex-row gap-5 lg:gap-7 items-start">
          {/* Movie Poster Artwork */}
          {movie && (
            <div className="relative w-full md:w-44 lg:w-48 shrink-0 aspect-[2/3] rounded-xl overflow-hidden bg-cinema-950 border border-white/10 shadow-lg group">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-amber-300 border border-amber-500/30">
                  {movie.rating} · {movie.runtime}分
                </span>
              </div>
            </div>
          )}

          {/* Hero Core Text Information */}
          <div className="flex-1 space-y-3.5 w-full">
            {/* Movie Title */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {movie?.title || showtime.movieTitle}
              </h3>
              <p className="text-xs text-slate-400 pt-0.5">
                {movie?.englishTitle} · {movie?.genre.slice(0, 3).join(" / ")}
              </p>
            </div>

            {/* Crucial Decision Line: Time · Theater · Hall */}
            <div className="p-3 rounded-xl bg-cinema-950/80 border border-white/[0.08] flex flex-wrap items-center gap-x-3 gap-y-1 text-sm sm:text-base font-bold text-white">
              <div className="flex items-center text-amber-400 font-black">
                <Clock className="w-4 h-4 mr-1.5" />
                <span>{timeStr}</span>
                {endTimeStr && <span className="text-xs font-normal text-slate-400 pl-1">~ {endTimeStr}</span>}
              </div>
              <span className="text-white/20">·</span>
              <div className="text-slate-200">
                {theater.name}
              </div>
              <span className="text-white/20">·</span>
              <div className="text-amber-300 font-black">
                {hall?.hallNo || "主力旗艦廳"}
              </div>
            </div>

            {/* Plain Language Verdict Quote (V2 Section 5) */}
            <div className="text-sm sm:text-base font-medium text-slate-200 bg-amber-500/[0.08] border-l-4 border-amber-500 px-3.5 py-2.5 rounded-r-xl">
              「{humanSummary}」
            </div>

            {/* Quick Spec Tags */}
            <div className="flex flex-wrap gap-1.5 pt-0.5 text-xs">
              {hall?.seatCount && (
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] text-slate-200 border border-white/10 font-semibold">
                  🏟️ {hall.seatCount} 席大廳
                </span>
              )}
              {hall?.format && hall.format !== "Standard" && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                  🔊 {hall.format}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] text-slate-300 border border-white/10">
                💰 NT${effectivePrice}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] text-slate-300 border border-white/10">
                📍 {theater.district} (火車站旁)
              </span>
            </div>

            {/* Emperor Seat Advice (V2 Section 9) */}
            <div className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
              <span className="text-amber-400 font-bold">👑 建議座位：</span>
              <span>{hall?.emperorSeatAdvice || "中間偏後 2～3 排（推薦 G/H 排中段）"}</span>
            </div>

            {/* 3 Core Action Buttons (V2 Section 4) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Primary CTA: 就看這場 */}
              <button
                type="button"
                onClick={() => setShowTicketModal(true)}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-cinema-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all"
              >
                <Ticket className="w-4 h-4" />
                <span>就看這場</span>
              </button>

              {/* Secondary CTA: 跟別場 PK */}
              {onOpenCompareModal && (
                <button
                  type="button"
                  onClick={onOpenCompareModal}
                  className="py-3 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-xs sm:text-sm font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Swords className="w-4 h-4 text-amber-400" />
                  <span>跟別場 PK</span>
                </button>
              )}

              {/* Tertiary CTA: 看其他推薦 */}
              <button
                type="button"
                onClick={handleScrollDown}
                className="py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 transition-all"
              >
                <span>看其他推薦</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Progressive Disclosure: 為什麼推薦？ (展開評分細節與資料真實來源) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <span>為什麼推薦？ (展開看各項加分與官方資料來源)</span>
                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showDetails && (
                <div className="mt-3 p-4 rounded-xl bg-cinema-950/90 border border-white/10 space-y-3 animate-fadeIn">
                  <div>
                    <div className="text-xs font-bold text-slate-300 pb-1.5">推薦加分拆解：</div>
                    <div className="flex flex-wrap gap-1.5">
                      {additivePoints.map((pt, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300"
                        >
                          {pt.tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>資料狀態：{hall?.dataStatus === "verified" ? "影城官方核實資料" : "Demo 示範資料"}</span>
                      <span className="text-slate-500">({hall?.source || theater.source})</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => hall && onInspectHall(hall.id)}
                      className="text-amber-400 hover:underline font-semibold text-left sm:text-right"
                    >
                      這間廳怎麼樣？看完整規格 →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket / Booking Quick Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-cinema-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowTicketModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Ticket className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">準備出發！最佳場次</h4>
              <p className="text-xs text-slate-400">
                {movie?.title} · {timeStr} · {theater.name}
              </p>
            </div>

            {/* Emperor Seat Tip */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1">
                <span>👑 選位帝王位指引：</span>
              </div>
              <p className="text-slate-300">
                {hall?.emperorSeatAdvice || "進入影城訂票時，建議選 G/H 排 10~15 號正中位置，包覆感最佳！"}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={theater.officialWebsite || "https://www.vscinemas.com.tw"}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-cinema-950 font-black text-sm flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>前往影城官方看座位 / 購票</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setShowTicketModal(false);
                  onOpenTheaterGuide();
                }}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                查看這間影城交通與停車折抵指南
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
