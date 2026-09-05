import React, { useState } from "react";
import {
  X,
  Trophy,
  Volume2,
  Tv,
  Users,
  MapPin,
  CheckCircle2,
  ArrowRightLeft,
  Tag,
  Swords
} from "lucide-react";

interface HallCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHallId?: string;
}

interface CompareHallData {
  id: string;
  theaterName: string;
  hallNo: string;
  badge: string;
  badgeColor: string;
  seatsNum: number;
  seatsText: string;
  screenDesc: string;
  soundDesc: string;
  transitMinutes: number;
  transitDesc: string;
  priceNum: number;
  priceDesc: string;
  features: string;
  conclusion: string;
}

const COMPARE_HALLS: Record<string, CompareHallData> = {
  "tonlin-hall-1": {
    id: "tonlin-hall-1",
    theaterName: "桃園統領威秀影城",
    hallNo: "1 廳 (旗艦全景聲大廳)",
    badge: "桃園市區最大廳",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    seatsNum: 288,
    seatsText: "288 席 (全桃市區之冠)",
    screenDesc: "14 米 4K Barco 雷射高對比銀幕",
    soundDesc: "Dolby Atmos 64 獨立天空聲道",
    transitMinutes: 3,
    transitDesc: "桃園火車站前站步行 3 分 (直通商場)",
    priceNum: 300,
    priceDesc: "$300 (小資首選)",
    features: "排距 115cm 視野開闊無遮蔽，全景聲天空音場極度精準",
    conclusion: "想下班即刻放鬆、少奔波且享受頂級全景聲音場 → 選桃園統領 1 廳！"
  },
  "in89-hall-1": {
    id: "in89-hall-1",
    theaterName: "桃園站前 in89 豪華影城",
    hallNo: "1 廳 (LUXE 旗艦廳)",
    badge: "體感與對比極致",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    seatsNum: 236,
    seatsText: "236 席 (中大廳規格)",
    screenDesc: "LUXE 終極高增益銀幕 (92% 反射率)",
    soundDesc: "Dolby Atmos + 杜比全景聲低頻震動座椅",
    transitMinutes: 2,
    transitDesc: "火車站前站正對面步行 2 分",
    priceNum: 290,
    priceDesc: "$290 (高性價比)",
    features: "重低音帶動座椅物理震動，爆破戰鬥動作片爽度最高",
    conclusion: "想要超強低頻震動體感、動作爆破近距離衝擊 → 選 in89 1 廳！"
  },
  "linkou-imax": {
    id: "linkou-imax",
    theaterName: "林口 MITSUI OUTLET 威秀",
    hallNo: "IMAX 廳 (雙雷射巨幕)",
    badge: "跨區旗艦極限巨幕",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    seatsNum: 340,
    seatsText: "340 席 (超巨大影廳)",
    screenDesc: "4K 雙雷射 IMAX 弧形巨幕 (寬 22m x 高 13.6m)",
    soundDesc: "IMAX 12-Channel 新世代環繞音響",
    transitMinutes: 15,
    transitDesc: "機捷 A9 林口站 10 分 / 桃園開車 15 分",
    priceNum: 390,
    priceDesc: "$390 (旗艦頂規)",
    features: "北台灣商用超巨幕，無可挑剔的視覺壓迫感與天地包覆",
    conclusion: "想要大銀幕原生 IMAX 震撼感與極限沉浸視野 → 毫無懸念選林口 IMAX！"
  }
};

export const HallCompareModal: React.FC<HallCompareModalProps> = ({
  isOpen,
  onClose,
  initialHallId
}) => {
  if (!isOpen) return null;

  // Selected Hall A and Hall B for 1-on-1 visual PK
  const [hallAId, setHallAId] = useState<string>("tonlin-hall-1");
  const [hallBId, setHallBId] = useState<string>(
    initialHallId && initialHallId !== "tonlin-hall-1" ? initialHallId : "linkou-imax"
  );

  const hallA = COMPARE_HALLS[hallAId] || COMPARE_HALLS["tonlin-hall-1"];
  const hallB = COMPARE_HALLS[hallBId] || COMPARE_HALLS["linkou-imax"];

  // Swap Hall A and B
  const handleSwap = () => {
    const temp = hallAId;
    setHallAId(hallBId);
    setHallBId(temp);
  };

  // Winner calculation for each row (Review Section 3)
  const isWinnerSeatsA = hallA.seatsNum > hallB.seatsNum;
  const isWinnerSeatsB = hallB.seatsNum > hallA.seatsNum;

  const isWinnerScreenA = hallA.screenDesc.includes("22m") || (!hallB.screenDesc.includes("22m") && hallA.screenDesc.includes("LUXE"));
  const isWinnerScreenB = hallB.screenDesc.includes("22m") || (!hallA.screenDesc.includes("22m") && hallB.screenDesc.includes("LUXE"));

  const isWinnerTransitA = hallA.transitMinutes < hallB.transitMinutes;
  const isWinnerTransitB = hallB.transitMinutes < hallA.transitMinutes;

  const isWinnerPriceA = hallA.priceNum < hallB.priceNum;
  const isWinnerPriceB = hallB.priceNum < hallA.priceNum;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-cinema-900 border border-white/10 shadow-2xl p-5 sm:p-7">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-glow-accent">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                影廳規格 VS 對決 · 一眼看勝負
              </h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                PK 矩陣
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              左邊 vs 右邊！系統直接標記勝負項目，並給出明確選廳結論。
            </p>
          </div>
        </div>

        {/* Pickers to Switch Competitors */}
        <div className="p-3 rounded-2xl bg-cinema-950/80 border border-white/5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-slate-400 font-bold shrink-0">選擇擂台 A：</span>
            <select
              value={hallAId}
              onChange={(e) => setHallAId(e.target.value)}
              className="rounded-xl bg-cinema-900 border border-white/10 px-3 py-1.5 font-bold text-white focus:outline-none focus:border-amber-400 w-full sm:w-auto"
            >
              {Object.values(COMPARE_HALLS).map((h) => (
                <option key={h.id} value={h.id}>
                  {h.theaterName} · {h.hallNo}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwap}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-400 hover:text-white transition-all flex items-center gap-1 shrink-0 font-bold"
            title="交換雙方擂台位置"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span className="text-xs">對調 VS</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-slate-400 font-bold shrink-0">選擇擂台 B：</span>
            <select
              value={hallBId}
              onChange={(e) => setHallBId(e.target.value)}
              className="rounded-xl bg-cinema-900 border border-white/10 px-3 py-1.5 font-bold text-white focus:outline-none focus:border-amber-400 w-full sm:w-auto"
            >
              {Object.values(COMPARE_HALLS).map((h) => (
                <option key={h.id} value={h.id}>
                  {h.theaterName} · {h.hallNo}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Two Large Cards with Big VS Center Badge (Review Section 3) */}
        <div className="relative mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Card: Hall A */}
            <div className="p-5 rounded-3xl bg-cinema-950/90 border border-white/10 hover:border-amber-500/40 transition-all space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${hallA.badgeColor}`}>
                  {hallA.badge}
                </span>
                <span className="text-xs font-mono font-black text-amber-400">
                  {hallA.priceDesc}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">{hallA.theaterName}</h3>
                <p className="text-sm font-bold text-amber-400 mt-0.5">{hallA.hallNo}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 text-xs text-slate-300">
                <span className="font-semibold text-white block mb-0.5">影廳特點：</span>
                {hallA.features}
              </div>
            </div>

            {/* Right Card: Hall B */}
            <div className="p-5 rounded-3xl bg-cinema-950/90 border border-white/10 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${hallB.badgeColor}`}>
                  {hallB.badge}
                </span>
                <span className="text-xs font-mono font-black text-cyan-400">
                  {hallB.priceDesc}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">{hallB.theaterName}</h3>
                <p className="text-sm font-bold text-cyan-400 mt-0.5">{hallB.hallNo}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 text-xs text-slate-300">
                <span className="font-semibold text-white block mb-0.5">影廳特點：</span>
                {hallB.features}
              </div>
            </div>
          </div>

          {/* Big Center Floating VS Badge */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 border-4 border-cinema-900 shadow-glow-accent text-black font-black text-sm tracking-wider pointer-events-none">
            VS
          </div>
        </div>

        {/* Row-by-Row Winner Matrix (Review Section 3 Table) */}
        <div className="rounded-2xl overflow-hidden border border-white/10 mb-6 text-xs divide-y divide-white/5 bg-cinema-950/60">
          {/* Row 1: Seats */}
          <div className="grid grid-cols-12 p-3 sm:p-3.5 items-center">
            <div className="col-span-4 sm:col-span-3 font-bold text-slate-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              <span>座位席次</span>
            </div>
            <div className="col-span-4 sm:col-span-4 text-left sm:text-center font-bold">
              {isWinnerSeatsA ? (
                <span className="inline-flex items-center gap-1 text-amber-300 font-extrabold bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
                  🏆 {hallA.seatsText}
                </span>
              ) : (
                <span className="text-slate-300">{hallA.seatsText}</span>
              )}
            </div>
            <div className="col-span-4 sm:col-span-5 text-right font-bold">
              {isWinnerSeatsB ? (
                <span className="inline-flex items-center gap-1 text-cyan-300 font-extrabold bg-cyan-500/15 px-2 py-0.5 rounded-md border border-cyan-500/30">
                  🏆 {hallB.seatsText}
                </span>
              ) : (
                <span className="text-slate-300">{hallB.seatsText}</span>
              )}
            </div>
          </div>

          {/* Row 2: Screen */}
          <div className="grid grid-cols-12 p-3 sm:p-3.5 items-center">
            <div className="col-span-4 sm:col-span-3 font-bold text-slate-400 flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-cyan-400" />
              <span>銀幕規格</span>
            </div>
            <div className="col-span-4 sm:col-span-4 text-left sm:text-center">
              {isWinnerScreenA ? (
                <span className="inline-flex items-center gap-1 text-amber-300 font-extrabold bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
                  🏆 {hallA.screenDesc}
                </span>
              ) : (
                <span className="text-slate-300">{hallA.screenDesc}</span>
              )}
            </div>
            <div className="col-span-4 sm:col-span-5 text-right">
              {isWinnerScreenB ? (
                <span className="inline-flex items-center gap-1 text-cyan-300 font-extrabold bg-cyan-500/15 px-2 py-0.5 rounded-md border border-cyan-500/30">
                  🏆 {hallB.screenDesc}
                </span>
              ) : (
                <span className="text-slate-300">{hallB.screenDesc}</span>
              )}
            </div>
          </div>

          {/* Row 3: Sound */}
          <div className="grid grid-cols-12 p-3 sm:p-3.5 items-center">
            <div className="col-span-4 sm:col-span-3 font-bold text-slate-400 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <span>音響系統</span>
            </div>
            <div className="col-span-4 sm:col-span-4 text-left sm:text-center text-slate-300 font-medium">
              <span className="text-amber-200">{hallA.soundDesc}</span>
            </div>
            <div className="col-span-4 sm:col-span-5 text-right text-slate-300 font-medium">
              <span className="text-cyan-200">{hallB.soundDesc}</span>
            </div>
          </div>

          {/* Row 4: Transit / Travel Time */}
          <div className="grid grid-cols-12 p-3 sm:p-3.5 items-center">
            <div className="col-span-4 sm:col-span-3 font-bold text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>車程交通</span>
            </div>
            <div className="col-span-4 sm:col-span-4 text-left sm:text-center font-bold">
              {isWinnerTransitA ? (
                <span className="inline-flex items-center gap-1 text-emerald-300 font-extrabold bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  🏆 {hallA.transitDesc}
                </span>
              ) : (
                <span className="text-slate-300">{hallA.transitDesc}</span>
              )}
            </div>
            <div className="col-span-4 sm:col-span-5 text-right font-bold">
              {isWinnerTransitB ? (
                <span className="inline-flex items-center gap-1 text-emerald-300 font-extrabold bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  🏆 {hallB.transitDesc}
                </span>
              ) : (
                <span className="text-slate-300">{hallB.transitDesc}</span>
              )}
            </div>
          </div>

          {/* Row 5: Price */}
          <div className="grid grid-cols-12 p-3 sm:p-3.5 items-center">
            <div className="col-span-4 sm:col-span-3 font-bold text-slate-400 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>實惠票價</span>
            </div>
            <div className="col-span-4 sm:col-span-4 text-left sm:text-center font-bold">
              {isWinnerPriceA ? (
                <span className="inline-flex items-center gap-1 text-emerald-300 font-extrabold bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  🏆 {hallA.priceDesc}
                </span>
              ) : (
                <span className="text-slate-300">{hallA.priceDesc}</span>
              )}
            </div>
            <div className="col-span-4 sm:col-span-5 text-right font-bold">
              {isWinnerPriceB ? (
                <span className="inline-flex items-center gap-1 text-emerald-300 font-extrabold bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  🏆 {hallB.priceDesc}
                </span>
              ) : (
                <span className="text-slate-300">{hallB.priceDesc}</span>
              )}
            </div>
          </div>
        </div>

        {/* Direct Takeaway Conclusion (Review Section 3: 底部直接給一句結論) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-indigo-500/15 border border-amber-500/30 mb-6 space-y-2">
          <span className="text-xs font-black text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" />
            系統直接給結論（不用自己猜）：
          </span>
          <div className="space-y-1.5 text-xs sm:text-sm text-slate-100 font-medium">
            <p>
              👉 <strong>如果你今天想要大銀幕震撼感、沉浸視野</strong> → 毫無懸念選{" "}
              <strong className="text-cyan-300">{hallB.id === "linkou-imax" ? hallB.theaterName : hallA.theaterName}</strong>！
            </p>
            <p>
              👉 <strong>如果你想下班即刻觀影、少奔波且音效絕頂</strong> → 首選{" "}
              <strong className="text-amber-300">{hallA.id.includes("tonlin") ? hallA.theaterName : hallB.theaterName}</strong>！
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>所有影廳硬體數據皆依影城官方認證參數評比</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs shadow-glow-accent hover:bg-amber-400 transition-all shrink-0 ml-4"
          >
            完成 PK 檢視
          </button>
        </div>
      </div>
    </div>
  );
};

