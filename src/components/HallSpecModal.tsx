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
  Info
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
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
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
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

        {/* Verification Status Banner (Doc v1.1 Rule 5.4) */}
        <div
          className={`p-3.5 rounded-2xl mb-5 border text-xs flex items-start gap-2.5 ${
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
          <div>
            <span className="font-bold block">
              {isVerified ? "影廳硬體規格：官方認證已核實" : "此影廳資訊尚未完全官方認證"}
            </span>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {isVerified
                ? `認證來源：${hall.source || theater.source}（驗證日：${hall.verifiedAt || theater.verifiedAt}）`
                : "此影廳資訊尚未完全官方認證，可透過官方資料或客服再次確認。"}
            </p>
          </div>
        </div>

        {/* Hardware Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {/* Seat Spec */}
          <div className="p-3 rounded-xl bg-cinema-950/80 border border-white/5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              席位規模
            </span>
            <p className="text-base font-bold text-white">
              {hall.seatCount ? `${hall.seatCount} 席` : "待官方公布"}
            </p>
            <span className="text-[11px] text-slate-400 block">
              等級: {hall.hallSizeLevel || "待評定"} {hall.wheelchairSeats ? `(含輪椅席 ${hall.wheelchairSeats} 席)` : ""}
            </span>
          </div>

          {/* Sound Spec */}
          <div className="p-3 rounded-xl bg-cinema-950/80 border border-white/5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              音響系統
            </span>
            <p className="text-sm font-bold text-white leading-snug">
              {hall.soundSystem || "標準多聲道"}
            </p>
            <span className="text-[11px] text-slate-400 block">
              格式: {hall.format}
            </span>
          </div>

          {/* Screen & Projection */}
          <div className="sm:col-span-2 p-3 rounded-xl bg-cinema-950/80 border border-white/5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Tv className="w-3.5 h-3.5 text-cyan-400" />
              銀幕與放映技術
            </span>
            <p className="text-sm font-bold text-white">
              {hall.screenSpecs || "標準數位規格"}
            </p>
            <div className="flex items-center gap-2 pt-1">
              {hall.laserProjection && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  雷射高對比度放映
                </span>
              )}
              <span className="text-[11px] text-slate-400">
                比例與高增益均勻度調校
              </span>
            </div>
          </div>
        </div>

        {/* Spec Notes / Hall Impression */}
        {hall.specNotes && (
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 mb-6 text-xs text-slate-300">
            <span className="font-bold text-white block mb-1 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              影廳特色與選位筆記：
            </span>
            <p className="leading-relaxed text-slate-300">{hall.specNotes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          {/* Call Theater Button */}
          <a
            href={`tel:${theater.phone}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cinema-850 hover:bg-cinema-800 border border-white/10 text-slate-200 font-bold text-xs transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>致電影城客服核實 ({theater.phone})</span>
          </a>

          {/* AI Voice Agent Simulated Call Button (if unverified) */}
          {!isVerified && onLaunchVoiceAgent && (
            <button
              onClick={() => onLaunchVoiceAgent(hall)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs transition-all shadow-glow-neon"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>啟動 AI 客服電話外呼補查</span>
            </button>
          )}

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

