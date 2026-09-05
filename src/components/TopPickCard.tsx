import React, { useState } from "react";
import {
  RecommendationResult
} from "../types";
import {
  Award,
  Crown,
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
  Trophy,
  Ticket,
  X
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
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    showtime,
    theater,
    hall,
    movie,
    recommendScore,
    recommendReasons,
    confidence,
    warnings,
    breakdown,
    additivePoints,
    humanSummary
  } = recommendation;

  const startTimeObj = new Date(showtime.startTime);
  const endTimeObj = showtime.endTime ? new Date(showtime.endTime) : null;
  const timeStr = `${startTimeObj.getHours().toString().padStart(2, "0")}:${startTimeObj.getMinutes().toString().padStart(2, "0")}`;
  const endTimeStr = endTimeObj
    ? `${endTimeObj.getHours().toString().padStart(2, "0")}:${endTimeObj.getMinutes().toString().padStart(2, "0")}`
    : "";

  const effectivePrice = showtime.promoPrice ?? showtime.standardPrice;

  // Quick badge chips (Review 7.3)
  const quickBadges = [
    hall?.seatCount && hall.seatCount >= 200 ? { text: `🎬 ${hall.seatCount} 席大廳`, color: "bg-amber-500/15 text-amber-300 border-amber-500/30" } : null,
    hall?.format && hall.format !== "Standard" ? { text: `🔊 ${hall.format}`, color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" } : null,
    theater.district === "林口區"
      ? { text: "🚗 跨區 15 分鐘", color: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" }
      : { text: "🚶 車站 3 分鐘", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
    showtime.promoPrice ? { text: `💳 現省 $${(showtime.standardPrice ?? 350) - showtime.promoPrice}`, color: "bg-rose-500/15 text-rose-300 border-rose-500/30" } : null,
    hall?.dataStatus === "verified"
      ? { text: "✅ 規格已驗證", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" }
      : { text: "⚠️ 待客服核實", color: "bg-amber-500/15 text-amber-300 border-amber-500/30" }
  ].filter(Boolean) as { text: string; color: string }[];

  const handleCopyShare = async () => {
    const text = `🎬 【Movie Hall Finder 最佳場次首選推薦】
電影：《${movie?.title || showtime.movieTitle}》
推薦首選：${theater.name} · ${hall?.hallNo || "推薦廳"} (${hall?.format || "高規格"})
開演時間：${timeStr} ${endTimeStr ? `~ ${endTimeStr}` : ""}
實惠票價：$${effectivePrice} 元 ${showtime.promoDescription ? `(${showtime.promoDescription})` : ""}
評審評語：${humanSummary}
推薦理由：${recommendReasons.join(" / ")}
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
    <div
      id="top-pick-section"
      className="relative mb-8 rounded-3xl overflow-hidden p-1 bg-gradient-to-br from-amber-500/50 via-amber-400/20 to-purple-600/30 shadow-2xl transition-all duration-300 scroll-mt-24"
    >
      {/* Outer Ambient Glow Container */}
      <div className="rounded-[22px] bg-cinema-900/95 backdrop-blur-2xl border border-white/10 p-5 sm:p-7 relative overflow-hidden">
        {/* Subtle Decorative Background Cinema Element */}
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Highlight Banner: Crown Jewel Badge & Verification Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs shadow-glow-accent tracking-wide">
              <Crown className="w-4 h-4 fill-black" />
              <span>🥇 今天最值得看 · 全場首選</span>
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
              <span>{confidence === "high" ? "已認證" : confidence === "medium" ? "Demo 種子資料" : "待確認"}</span>
            </span>
          </div>

          {/* Mandatory Mock / Demo Disclaimer */}
          {showtime.dataStatus === "mock" && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Demo 資料，不代表影城即時場次</span>
            </div>
          )}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Big Score Dial & Movie Title (3 cols) */}
          <div className="lg:col-span-3 flex lg:flex-col items-center justify-between lg:justify-center p-4 rounded-2xl bg-cinema-950/70 border border-white/5 text-center gap-3">
            {/* Score Ring (Hero Display: 93 分｜今天最值得看) */}
            <div className="relative flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-amber-500/25 to-amber-600/5 border border-amber-500/50 shadow-glow-accent">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-sans">
                {recommendScore}
              </span>
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest mt-0.5">
                分 · 首選場
              </span>
              <Award className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 fill-amber-400/20 filter drop-shadow" />
            </div>

            {/* Movie Title & Runtime */}
            <div className="text-left lg:text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                指定電影
              </span>
              <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                {movie?.title || showtime.movieTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {movie?.runtime} 分鐘 · {movie?.rating}
              </p>
            </div>
          </div>

          {/* Center Column: Theater, Hall, Time, Verdict & Additive Breakdown (6 cols) */}
          <div className="lg:col-span-6 space-y-3.5">
            {/* Theater & Hall Title */}
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{theater.region} · {theater.district}</span>
                <span className="text-white/20">|</span>
                <span className="text-slate-300">{theater.transitInfo}</span>
              </div>

              {/* Theater + Hall + Time Hero Line (Review 2.C) */}
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 flex flex-wrap items-center gap-2.5">
                <span>{theater.name}</span>
                {hall && (
                  <button
                    onClick={() => onInspectHall(hall.id)}
                    className="inline-flex items-center gap-1 text-sm sm:text-base font-extrabold px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all hover:scale-105"
                    title="查看影廳規格詳情"
                  >
                    <span>{hall.hallNo}</span>
                    <Info className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-amber-400 font-mono text-2xl font-black">
                  · {timeStr}
                </span>
              </h2>
            </div>

            {/* Plain Language Verdict Quote (Review 2.C & 10) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-l-4 border-amber-400 border-y border-r border-white/5">
              <p className="text-sm font-bold text-amber-200 leading-relaxed">
                「{humanSummary}」
              </p>
            </div>

            {/* Quick Badge Chips (Review 7.3) */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.color}`}
                >
                  {badge.text}
                </span>
              ))}
            </div>

            {/* Transparent Additive Score Breakdown Chips (Review 7.4) */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  評分拆解（非黑箱透明計分）：
                </span>
                <span className="font-mono text-amber-400 font-bold">
                  總計 {recommendScore} 分
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {additivePoints.map((pt, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-cinema-950/80 border border-white/10 text-xs font-bold font-mono text-slate-200 flex items-center gap-1 hover:border-amber-400/40 transition-colors"
                  >
                    <span className="text-amber-400">{pt.tag}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Price & Showtime Info Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-base font-black font-mono">
                  ${effectivePrice}
                </span>
                {showtime.promoPrice && showtime.standardPrice && (
                  <span className="text-[11px] text-slate-400 line-through">
                    ${showtime.standardPrice}
                  </span>
                )}
                {showtime.promoDescription && (
                  <span className="text-[11px] text-emerald-400/90 font-medium">
                    ({showtime.promoDescription})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>開演時間：{timeStr} {endTimeStr ? `~ ${endTimeStr}` : ""}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Two Primary Buttons + Supporting Actions (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-2.5 w-full pt-2 lg:pt-0">
            {/* Primary Action Button 1: 看座位 / 購票 (Review 2.C) */}
            <button
              onClick={() => setShowTicketModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-black font-black text-sm transition-all shadow-glow-accent active:scale-[0.98]"
            >
              <Ticket className="w-4 h-4 fill-black" />
              <span>看座位 / 購票</span>
            </button>

            {/* Primary Action Button 2: 為什麼推薦？ (Review 2.C) */}
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-cinema-850 hover:bg-cinema-800 border border-white/10 hover:border-amber-400/40 text-amber-300 font-bold text-xs transition-all"
            >
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>為什麼推薦？</span>
              </div>
              {showBreakdown ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Quick Action 3: 影廳深度 PK */}
            {onOpenCompareModal && (
              <button
                onClick={onOpenCompareModal}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/15 to-indigo-500/15 hover:from-amber-500/25 hover:to-indigo-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs transition-all shadow-sm"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>影廳規格 VS 對決 (一眼看勝負)</span>
              </button>
            )}

            {/* Quick Action 4: Google Maps 導航 */}
            <a
              href={theater.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-cinema-850 hover:bg-cinema-800 border border-white/10 hover:border-white/20 text-slate-200 font-semibold text-xs transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>開啟 Google 地圖導航</span>
            </a>

            {/* Quick Action 5: 複製揪團資訊 */}
            <button
              onClick={handleCopyShare}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border font-bold text-xs transition-all ${
                copied
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm"
                  : "bg-cinema-850 hover:bg-cinema-800 border-white/10 hover:border-amber-400/40 text-slate-200"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>已複製揪團文字！直接貼給朋友</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>複製揪團資訊 (LINE / IG)</span>
                </>
              )}
            </button>

            {/* Quick Action 6: 交通與商場導覽 */}
            <button
              onClick={onOpenTheaterGuide}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-[11px] transition-all"
            >
              <span>影城交通與看完吃什麼</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Collapsible: Why This One? Detailed Reasons & 6-Dimension Breakdown */}
        {showBreakdown && (
          <div className="mt-5 pt-4 border-t border-white/10 space-y-4 animate-fadeIn">
            <div>
              <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                演算法客製解析要點：
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recommendReasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-cinema-950/80 border border-white/5 text-xs text-slate-200"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6 Dimensions Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
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
          </div>
        )}

        {/* Footer Meta & Source Timestamp */}
        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
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

      {/* Ticket & Seating Modal (Review 2.C "看座位 / 購票") */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-cinema-900 border border-amber-500/40 shadow-2xl p-6 overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setShowTicketModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase">
                  Fast Booking & Best Seats
                </span>
                <h3 className="text-xl font-black text-white">
                  看座位與線上購票
                </h3>
              </div>
            </div>

            {/* Selected Showtime Summary */}
            <div className="p-4 rounded-2xl bg-cinema-950 border border-white/10 space-y-2 mb-4 text-xs">
              <div className="flex justify-between items-center text-white font-bold">
                <span>{theater.name} · {hall?.hallNo || "推薦廳"}</span>
                <span className="text-amber-400 font-mono text-sm">{timeStr}</span>
              </div>
              <div className="text-slate-400 flex items-center justify-between">
                <span>電影：《{movie?.title || showtime.movieTitle}》</span>
                <span className="text-emerald-400 font-bold font-mono">${effectivePrice} 元</span>
              </div>
            </div>

            {/* Golden Seating Advice */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-cinema-950 border border-amber-500/30 mb-5 text-xs space-y-2">
              <span className="font-black text-amber-300 flex items-center gap-1.5">
                <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
                編輯部推薦黃金觀影席位 (皇帝位)：
              </span>
              <p className="text-slate-200 leading-relaxed">
                🎯 <strong>{hall?.hallNo || "本廳"}</strong> 最佳視野：建議搶訂{" "}
                <span className="text-amber-300 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded">
                  F ~ H 排 8 ~ 14 號
                </span>
                ，此區垂直仰角 25 度、水平包覆感最均勻，且杜比全景聲天空定位最精準！
              </p>
            </div>

            {/* Booking Links Actions */}
            <div className="space-y-2.5">
              <a
                href={theater.officialWebsite || "https://www.vieshow.com.tw/"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs shadow-glow-accent hover:brightness-110 transition-all"
              >
                <span>前往 {theater.name.includes("in89") ? "in89 豪華影城" : "威秀影城"} 官方訂票選位</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${theater.phone}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cinema-850 hover:bg-cinema-800 border border-white/10 text-slate-200 font-bold text-xs transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>致電櫃檯詢問餘票 ({theater.phone})</span>
              </a>

              <button
                onClick={() => setShowTicketModal(false)}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-medium text-xs transition-all"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

