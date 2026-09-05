import React, { useState } from "react";
import { Hall, Theater } from "../types";
import {
  X,
  Volume2,
  Tv,
  Users,
  ShieldCheck,
  AlertTriangle,
  Phone,
  PhoneCall,
  Crown,
  ChevronDown,
  ChevronUp
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
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (!isOpen || !hall || !theater) return null;

  const isVerified = hall.dataStatus === "verified";
  const headline = hall.humanHeadline || `${theater.name} · ${hall.hallNo}`;
  const suitability = hall.humanSuitability || "適合各類熱門強檔大片";
  const goldenSeatAdvice = hall.emperorSeatAdvice || "推薦：中間偏後 2～3 排（視野水平無遮蔽）";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-[calc(100vw-24px)] sm:max-w-lg rounded-2xl sm:rounded-3xl bg-cinema-900 border border-white/10 shadow-2xl p-5 sm:p-7 space-y-4 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Header: Plain Language Title & Suitability (V2 Section 9) */}
        <div className="space-y-1 pr-8">
          <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
            <span>{theater.name}</span>
            <span>·</span>
            <span>{hall.hallNo}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {headline}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium pt-0.5">
            {suitability}
          </p>
        </div>

        {/* 2. Overview Tags: Size & Special Format */}
        <div className="flex flex-wrap gap-2 pt-1">
          {hall.seatCount ? (
            <div className="px-3 py-1.5 rounded-xl bg-cinema-950 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{hall.seatCount} 席 ({hall.hallSizeLevel || "大廳"})</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300">
              ⚠️ 目前沒有可靠座位數資料
            </div>
          )}

          <div className="px-3 py-1.5 rounded-xl bg-cinema-950 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{hall.format === "Standard" ? "標準數位" : hall.format}</span>
          </div>
        </div>

        {/* 3. Emperor Seat Advice (V2: In one plain sentence) */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>最佳座位建議：</span>
          </div>
          <p className="text-slate-200 font-medium">
            {goldenSeatAdvice}
          </p>
        </div>

        {/* 4. Screen & Audio Plain Description */}
        <div className="p-3.5 rounded-xl bg-cinema-950/80 border border-white/5 space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <Tv className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 block text-[11px]">銀幕畫面</span>
              <span className="text-slate-200 font-semibold">{hall.screenSpecs || "標準高對比銀幕"}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1 border-t border-white/5">
            <Volume2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 block text-[11px]">音響音場</span>
              <span className="text-slate-200 font-semibold">{hall.soundSystem || "標準數位環繞聲道"}</span>
            </div>
          </div>
        </div>

        {/* 5. Detailed Specs (Foldable level 2) */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 transition-all"
          >
            <span>{showTechnicalDetails ? "收合技術細節" : "看詳細放映技術與排距"}</span>
            {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showTechnicalDetails && (
            <div className="mt-2.5 p-3 rounded-xl bg-cinema-950 border border-white/10 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
              <p>• 排距與空間：{hall.specNotes || "寬敞無遮蔽排距設計。"}</p>
              <p>• 放映技術：{hall.laserProjection ? "4K 高對比雷射放映機" : "數位放映系統"}</p>
              <p>• 無障礙輪椅席：{hall.wheelchairSeats ? `${hall.wheelchairSeats} 席` : "官方未標註"}</p>
            </div>
          )}
        </div>

        {/* 6. Data Source & Credibility */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
          {isVerified ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}
          <span>
            {isVerified
              ? `資料已核實（來源：${hall.source || theater.source}）`
              : "部分規格待官方確認（遵循資料真實原則，絕不捏造）"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          {/* Rebranded: 幫我問影城 (V2 Section 11) */}
          {!isVerified && onLaunchVoiceAgent && (
            <button
              type="button"
              onClick={() => onLaunchVoiceAgent(hall)}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-cinema-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>幫我問影城 📞</span>
            </button>
          )}

          <a
            href={`tel:${theater.phone}`}
            className="flex-1 py-3 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>撥打影城專線</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white text-xs font-semibold"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
