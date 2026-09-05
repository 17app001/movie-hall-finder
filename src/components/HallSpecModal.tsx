import React from "react";
import { Hall, Theater } from "../types";
import {
  X,
  Volume2,
  Tv,
  Users,
  ShieldCheck,
  AlertTriangle,
  Phone,
  Sparkles,
  Crown,
  HelpCircle
} from "lucide-react";

interface HallSpecModalProps {
  hall: Hall | null;
  theater: Theater | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchVoiceAgent?: (hall: Hall) => void;
}

export const HallSpecModal: React.FC<HallSpecModalProps> = ({
  hall,
  theater,
  isOpen,
  onClose,
  onLaunchVoiceAgent
}) => {
  if (!isOpen || !hall || !theater) return null;

  const isVerified = hall.dataStatus === "verified";
  const hasMissingSeats = !hall.seatCount;

  // 人話版影廳點評 (Review Section 4)
  let plainHumanVerdict = "";
  let goldenSeatAdvice = "F ~ H 排中央座位為最佳視角";

  if (hall.id === "tonlin-hall-1") {
    plainHumanVerdict = "這是一個桃園站前旗艦超大廳，配備 64 獨立天空聲道杜比全景聲，音場包覆感極佳，特別適合科幻與大場面電影。";
    goldenSeatAdvice = "推薦 G 排 10~14 號（水平視角與天空音響交會中心）";
  } else if (hall.id === "in89-hall-1") {
    plainHumanVerdict = "這是一個中大型體感旗艦廳，具備 LUXE 終極高反射銀幕與重低音震動座椅，爆炸重擊會直接撼動座椅，動作片爽度極高。";
    goldenSeatAdvice = "推薦 F 排 8~12 號（震動座椅感應最佳甜蜜點）";
  } else if (hall.id === "linkou-imax") {
    plainHumanVerdict = "這是一個頂級超巨幕大廳，寬達 22 米的 4K 雙雷射 IMAX 弧形銀幕，視野壓迫感無可匹敵，專為好萊塢原生巨幕大作而生。";
    goldenSeatAdvice = "推薦 H ~ J 排中段（視角包覆且不仰角疲勞）";
  } else {
    plainHumanVerdict = `這是一個${hall.hallSizeLevel || "中型"}規格廳，空間適中無壓迫感，適合各類型熱門電影觀賞。`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-cinema-900 border border-white/10 shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-glow-accent">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <span>{theater.name}</span>
              <span>·</span>
              <span>{theater.district}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{hall.hallNo}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-extrabold">
                {hall.format}
              </span>
            </h2>
          </div>
        </div>

        {/* 1. Top Plain Language Human Verdict Banner (Review Section 4) */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-cinema-950 border border-amber-500/30 mb-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>人話版影廳點評：</span>
          </div>
          <p className="text-sm text-white font-bold leading-snug">
            「{plainHumanVerdict}」
          </p>
        </div>

        {/* 2. Verification Status Banner (Review Section 4: 保留已驗證/待確認/資料不足) */}
        <div
          className={`p-3 rounded-xl mb-4 border text-xs flex items-start gap-2.5 ${
            isVerified
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-amber-500/15 border-amber-500/40 text-amber-300"
          }`}
        >
          {isVerified ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <span className="font-bold block">
              {isVerified ? "✅ 影廳規格：官方認證已核實" : "⚠️ 此影廳部分硬體規格待確認"}
            </span>
            <p className="text-[11px] text-slate-300">
              {isVerified
                ? `資料來源：${hall.source || theater.source}（核實日：${hall.verifiedAt || theater.verifiedAt}）`
                : "遵循「資料可以少，但不能假」原則。未確認欄位絕不偽造，可點擊下方按鈕由系統代為向影城確認。"}
            </p>
          </div>
        </div>

        {/* 3. Hardware Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Seat Spec */}
          <div className="p-3 rounded-xl bg-cinema-950/80 border border-white/5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              席位規模
            </span>
            {hall.seatCount ? (
              <p className="text-base font-bold text-white">
                {hall.seatCount} 席
                <span className="text-xs text-slate-400 font-normal ml-1">
                  ({hall.hallSizeLevel})
                </span>
              </p>
            ) : (
              <p className="text-xs font-bold text-rose-400 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                ⚠️ 目前沒有可靠座位數資料
              </p>
            )}
            <span className="text-[10px] text-slate-500 block">
              輪椅席：{hall.wheelchairSeats ? `${hall.wheelchairSeats} 席` : "官方未標註"}
            </span>
          </div>

          {/* Sound Spec */}
          <div className="p-3 rounded-xl bg-cinema-950/80 border border-white/5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              音響音場設備
            </span>
            <p className="text-xs font-bold text-white leading-snug">
              {hall.soundSystem || "標準數位環繞聲道"}
            </p>
            <span className="text-[10px] text-indigo-300 block">
              格式標籤: {hall.format}
            </span>
          </div>

          {/* Screen & Projection */}
          <div className="sm:col-span-2 p-3 rounded-xl bg-cinema-950/80 border border-white/5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Tv className="w-3.5 h-3.5 text-cyan-400" />
              銀幕與放映技術
            </span>
            <p className="text-xs font-bold text-white">
              {hall.screenSpecs || "標準規格銀幕"}
            </p>
            <div className="flex items-center gap-2 pt-0.5">
              {hall.laserProjection && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  雷射高對比放映
                </span>
              )}
              <span className="text-[11px] text-slate-400">
                比例適中無死角
              </span>
            </div>
          </div>
        </div>

        {/* 4. Golden Seating Tip */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 mb-5 text-xs text-slate-300 space-y-1">
          <span className="font-bold text-amber-300 flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            最佳觀影座位建議：
          </span>
          <p className="text-slate-200">{goldenSeatAdvice}</p>
        </div>

        {/* 5. Actions (Review Section 4 & 5: 提供「幫我確認」按鈕) */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* Rebranded Action: 幫我確認 (Review Section 5) */}
          {(!isVerified || hasMissingSeats) && onLaunchVoiceAgent && (
            <button
              onClick={() => onLaunchVoiceAgent(hall)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs transition-all shadow-glow-neon"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>幫我確認影廳規格</span>
            </button>
          )}

          {/* Call Theater Button */}
          <a
            href={`tel:${theater.phone}`}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-cinema-850 hover:bg-cinema-800 border border-white/10 text-slate-200 font-bold text-xs transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>撥打影城 ({theater.phone})</span>
          </a>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs transition-all"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

