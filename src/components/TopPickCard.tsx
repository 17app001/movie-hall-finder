import React, { useState } from "react";
import {
  RecommendationResult
} from "../types";
import {
  Award,
  Crown,
  Volume2,
  Users,
  Clock,
  MapPin,
  ExternalLink,
  Phone,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Zap,
  Tag,
  Info,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
  Trophy
} from "lucide-react";

interface TopPickCardProps {
  recommendation: RecommendationResult;
  onInspectHall: (hallId: string) => void;
  onOpenTheaterGuide: () => void;
  onOpenCompareModal?: () => void;
}

export const TopPickCard: React.FC<TopPickCardProps> = ({
  recommendation,
  onInspectHall,
  onOpenTheaterGuide,
  onOpenCompareModal
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showtime, theater, hall, movie, recommendScore, recommendReasons, confidence, warnings, breakdown } =
    recommendation;

  const startTimeObj = new Date(showtime.startTime);
  const endTimeObj = showtime.endTime ? new Date(showtime.endTime) : null;
  const timeStr = `${startTimeObj.getHours().toString().padStart(2, "0")}:${startTimeObj.getMinutes().toString().padStart(2, "0")}`;
  const endTimeStr = endTimeObj
    ? `${endTimeObj.getHours().toString().padStart(2, "0")}:${endTimeObj.getMinutes().toString().padStart(2, "0")}`
    : "";

  const effectivePrice = showtime.promoPrice ?? showtime.standardPrice;

  const handleCopyShare = async () => {
    const text = `🎬 【Movie Hall Finder 最佳場次首選推薦】
電影：《${movie?.title || showtime.movieTitle}》
推薦首選：${theater.name} · ${hall?.hallNo || "推薦廳"} (${hall?.format || "高規格"})
開演時間：${timeStr} ${endTimeStr ? `~ ${endTimeStr}` : ""}
實惠票價：$${effectivePrice} 元 ${showtime.promoDescription ? `(${showtime.promoDescription})` : ""}
推薦理由：${recommendReasons.join(" / ")}
地址：${theater.address}
地圖導航：${theater.googleMapsUrl}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative mb-8 rounded-3xl overflow-hidden p-1 bg-gradient-to-br from-amber-500/40 via-purple-600/30 to-amber-500/20 shadow-2xl transition-all duration-300">
      {/* Outer Ambient Glow Container */}
      <div className="rounded-[22px] bg-cinema-900/95 backdrop-blur-2xl border border-white/10 p-5 sm:p-7 relative overflow-hidden">
        {/* Subtle Decorative Background Cinema Element */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Highlight Banner: Crown Jewel Badge & Mock Notice */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-glow-accent">
              <Crown className="w-4 h-4 fill-black" />
              <span>全區最高首選 · 編輯部推薦</span>
            </span>

            {/* Confidence Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                confidence === "high"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : confidence === "medium"
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>可信度：{confidence === "high" ? "已全面驗證" : confidence === "medium" ? "Demo 種子資料" : "待確認"}</span>
            </span>
          </div>

          {/* Mandatory Mock / Demo Disclaimer (Doc v1.1 Rule 5.2) */}
          {showtime.dataStatus === "mock" && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse-subtle">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo 資料，不代表影城即時場次</span>
            </div>
          )}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Big Score Dial & Movie Poster Thumbnail (3 cols) */}
          <div className="lg:col-span-3 flex lg:flex-col items-center justify-between lg:justify-center p-4 rounded-2xl bg-cinema-950/70 border border-white/5 text-center gap-4">
            {/* Score Ring */}
            <div className="relative flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-amber-500/20 to-amber-600/5 border border-amber-500/40 shadow-glow-accent">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-sans">
                {recommendScore}
              </span>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mt-0.5">
                分 · 首選場
              </span>
              <Award className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 fill-amber-400/20 filter drop-shadow" />
            </div>

            {/* Movie Title & Runtime */}
            <div className="text-left lg:text-center">
              <span className="text-xs font-mono text-slate-400 uppercase">指定電影</span>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {movie?.title || showtime.movieTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {movie?.runtime} 分鐘 · {movie?.rating}
              </p>
            </div>
          </div>

          {/* Center Column: Cinema, Hall, Time & Core Specs (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Theater & Hall Title */}
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{theater.region} · {theater.district}</span>
                <span className="text-white/20">|</span>
                <span className="text-slate-300 font-medium">{theater.transitInfo}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 flex flex-wrap items-center gap-2.5">
                <span>{theater.name}</span>
                {/* Clickable Hall Tag */}
                {hall && (
                  <button
                    onClick={() => onInspectHall(hall.id)}
                    className="inline-flex items-center gap-1 text-sm sm:text-base font-extrabold px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all hover:scale-105"
                    title="點擊檢視影廳硬體規格 (銀幕尺寸、音效、座椅)"
                  >
                    <span>{hall.hallNo}</span>
                    <Info className="w-3.5 h-3.5" />
                  </button>
                )}
              </h2>
            </div>

            {/* Showtime & Price Row */}
            <div className="flex flex-wrap items-center gap-3 py-2">
              {/* Showtime Badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cinema-850 border border-white/10 text-white">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-xl font-black tracking-tight font-mono">{timeStr}</span>
                {endTimeStr && (
                  <span className="text-xs text-slate-400 font-mono">~ {endTimeStr}</span>
                )}
              </div>

              {/* Format Badge */}
              {hall && (
                <div className="px-3.5 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                  <span>{hall.format} ({hall.soundSystem?.split(" ")[0] || "高階環繞"})</span>
                </div>
              )}

              {/* Seat Capacity Badge */}
              {hall?.seatCount ? (
                <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-bold flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{hall.hallSizeLevel} ({hall.seatCount} 席)</span>
                </div>
              ) : (
                <div className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                  席位待確認
                </div>
              )}

              {/* Price Pill */}
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-base font-black font-mono">
                  ${effectivePrice}
                </span>
                {showtime.promoPrice && showtime.standardPrice && (
                  <span className="text-[11px] text-slate-400 line-through">
                    ${showtime.standardPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Why This One? (Recommendation Reasons Pills) */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                為什麼推薦這一場？（演算法客製解析）
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recommendReasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-cinema-950/60 border border-white/5 text-xs text-slate-200"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: CTA Actions & Google Maps (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-2.5 w-full pt-2 lg:pt-0">
            {/* CTA 1: Google Maps Navigation */}
            <a
              href={theater.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm transition-all shadow-glow-accent"
            >
              <ExternalLink className="w-4 h-4" />
              <span>開啟 Google 地圖導航</span>
            </a>

            {/* CTA 2: Call Theater Hotline */}
            <a
              href={`tel:${theater.phone}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cinema-850 hover:bg-cinema-800 border border-white/10 hover:border-white/20 text-slate-200 font-bold text-xs transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>影城官方電話：{theater.phone}</span>
            </a>

            {/* CTA 3: Inspect Hall Specs */}
            {hall && (
              <button
                onClick={() => onInspectHall(hall.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cinema-850 hover:bg-cinema-800 border border-white/10 hover:border-amber-500/40 text-amber-300 font-bold text-xs transition-all"
              >
                <Info className="w-3.5 h-3.5" />
                <span>查看 {hall.hallNo} 完整硬體規格</span>
              </button>
            )}

            {/* CTA 4: Share to friends */}
            <button
              onClick={handleCopyShare}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border font-bold text-xs transition-all ${
                copied
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm"
                  : "bg-cinema-850 hover:bg-cinema-800 border-white/10 hover:border-amber-400/40 text-slate-200"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>已複製揪團資訊！直接貼到 LINE / IG</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>複製推薦結果傳給朋友 (LINE / IG)</span>
                </>
              )}
            </button>

            {/* CTA 5: Quick Compare Modal */}
            {onOpenCompareModal && (
              <button
                onClick={onOpenCompareModal}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/15 to-indigo-500/15 hover:from-amber-500/25 hover:to-indigo-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs transition-all shadow-sm"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>影廳規格深度 PK (桃園雙雄 vs 林口)</span>
              </button>
            )}

            {/* CTA 6: Theater Guide Modal */}
            <button
              onClick={onOpenTheaterGuide}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 font-medium text-xs transition-all"
            >
              <span>影城交通與停車折抵資訊</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Score Breakdown Toggle */}
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="mt-1 flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-slate-400 hover:text-slate-200 transition-all"
            >
              <span>查看 6 大維度評分計分明細</span>
              {showBreakdown ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Score Breakdown Panel */}
        {showBreakdown && (
          <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs animate-fadeIn">
            <div className="p-3 rounded-xl bg-cinema-950/80 border border-white/5">
              <span className="text-slate-400 text-[11px] block">影廳規模 (30%)</span>
              <span className="text-base font-black text-amber-400 font-mono">
                {breakdown.hallSize}
              </span>
              <span className="text-[10px] text-slate-500 block">/ 100 分</span>
            </div>
            <div className="p-3 rounded-xl bg-cinema-950/80 border border-white/5">
              <span className="text-slate-400 text-[11px] block">特殊規格 (20%)</span>
              <span className="text-base font-black text-indigo-400 font-mono">
                {breakdown.specialFormat}
              </span>
              <span className="text-[10px] text-slate-500 block">/ 100 分</span>
            </div>
            <div className="p-3 rounded-xl bg-cinema-950/80 border border-white/5">
              <span className="text-slate-400 text-[11px] block">時段符合度 (15%)</span>
              <span className="text-base font-black text-cyan-400 font-mono">
                {breakdown.timeSlot}
              </span>
              <span className="text-[10px] text-slate-500 block">/ 100 分</span>
            </div>
            <div className="p-3 rounded-xl bg-cinema-950/80 border border-white/5">
              <span className="text-slate-400 text-[11px] block">價格優勢 (15%)</span>
              <span className="text-base font-black text-emerald-400 font-mono">
                {breakdown.priceAdvantage}
              </span>
              <span className="text-[10px] text-slate-500 block">/ 100 分</span>
            </div>
            <div className="p-3 rounded-xl bg-cinema-950/80 border border-white/5">
              <span className="text-slate-400 text-[11px] block">優惠折抵 (10%)</span>
              <span className="text-base font-black text-rose-400 font-mono">
                {breakdown.promotions}
              </span>
              <span className="text-[10px] text-slate-500 block">/ 100 分</span>
            </div>
            <div className="p-3 rounded-xl bg-cinema-950/80 border border-white/5">
              <span className="text-slate-400 text-[11px] block">交通便利 (10%)</span>
              <span className="text-base font-black text-amber-300 font-mono">
                {breakdown.transitConvenience}
              </span>
              <span className="text-[10px] text-slate-500 block">/ 100 分</span>
            </div>
          </div>
        )}

        {/* Footer Meta & Source Timestamp */}
        <div className="mt-5 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>來源追蹤：{theater.source}</span>
            <span>·</span>
            <span>認證時間：{theater.verifiedAt}</span>
          </div>
          {warnings.length > 0 && (
            <div className="text-amber-400/80 text-[11px] flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{warnings[0]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

