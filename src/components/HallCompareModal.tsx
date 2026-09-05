import React, { useState } from "react";
import {
  X,
  Trophy,
  Swords,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp
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
  shortName: string;
  badge: string;
  seatsNum: number;
  seatsText: string;
  format: string;
  soundDesc: string;
  screenDesc: string;
  transitMinutes: number;
  transitDesc: string;
  priceNum: number;
  priceDesc: string;
  verdictTip: string;
}

const COMPARE_HALLS: Record<string, CompareHallData> = {
  "tonlin-hall-1": {
    id: "tonlin-hall-1",
    theaterName: "桃園統領威秀影城",
    hallNo: "1 廳 (旗艦全景聲大廳)",
    shortName: "統領 1 廳",
    badge: "桃園市區最大廳",
    seatsNum: 288,
    seatsText: "288 席",
    format: "Dolby Atmos",
    soundDesc: "Dolby Atmos 64 獨立天空聲道",
    screenDesc: "14 米 4K Barco 雷射高對比銀幕",
    transitMinutes: 3,
    transitDesc: "桃園車站步行 3 分鐘",
    priceNum: 300,
    priceDesc: "NT$300",
    verdictTip: "如果你在意整體爽度與就近方便，選統領 1 廳。"
  },
  "in89-hall-1": {
    id: "in89-hall-1",
    theaterName: "桃園站前 in89 豪華影城",
    hallNo: "1 廳 (LUXE 旗艦廳)",
    shortName: "in89 LUXE 廳",
    badge: "LUXE 震動體感",
    seatsNum: 236,
    seatsText: "236 席",
    format: "LUXE + Atmos",
    soundDesc: "Dolby Atmos 全景聲 + 震動體感座椅",
    screenDesc: "LUXE 終極高增益銀幕",
    transitMinutes: 2,
    transitDesc: "桃園車站正對面 2 分鐘",
    priceNum: 320,
    priceDesc: "NT$320",
    verdictTip: "如果你想體驗低頻震動體感與高對比銀幕，選 in89。"
  },
  "tonlin-hall-5": {
    id: "tonlin-hall-5",
    theaterName: "桃園統領威秀影城",
    hallNo: "5 廳",
    shortName: "統領 5 廳",
    badge: "小資省錢廳",
    seatsNum: 110,
    seatsText: "110 席",
    format: "Standard 7.1",
    soundDesc: "JBL 7.1 環繞聲",
    screenDesc: "標準數位 2K 銀幕",
    transitMinutes: 3,
    transitDesc: "桃園車站步行 3 分鐘",
    priceNum: 260,
    priceDesc: "NT$260 (省$40)",
    verdictTip: "如果你想省錢休閒看片，選 5 廳最划算。"
  },
  "linkou-imax": {
    id: "linkou-imax",
    theaterName: "林口 MITSUI OUTLET 威秀",
    hallNo: "IMAX 廳 (雙雷射巨幕)",
    shortName: "林口 IMAX",
    badge: "跨區極限巨幕",
    seatsNum: 340,
    seatsText: "340 席 (最大)",
    format: "IMAX 4K",
    soundDesc: "IMAX 12-Channel 新世代環繞音響",
    screenDesc: "高 13.6 米 x 寬 22 米 雙雷射巨幕",
    transitMinutes: 25,
    transitDesc: "開車約 25 分鐘 (商場好停車)",
    priceNum: 390,
    priceDesc: "NT$390",
    verdictTip: "如果你想要極限超大銀幕包覆感，強烈選林口 IMAX。"
  }
};

export const HallCompareModal: React.FC<HallCompareModalProps> = ({
  isOpen,
  onClose,
  initialHallId = "linkou-imax"
}) => {
  const [hallAId, setHallAId] = useState<string>("tonlin-hall-1");
  const [hallBId, setHallBId] = useState<string>(initialHallId || "linkou-imax");
  const [showFullSpecs, setShowFullSpecs] = useState(false);

  if (!isOpen) return null;

  const hallA = COMPARE_HALLS[hallAId] || COMPARE_HALLS["tonlin-hall-1"];
  const hallB = COMPARE_HALLS[hallBId] || COMPARE_HALLS["linkou-imax"];

  const handleSwap = () => {
    const temp = hallAId;
    setHallAId(hallBId);
    setHallBId(temp);
  };

  // Determine winners for each dimension
  const winners = {
    hallSize: hallA.seatsNum >= hallB.seatsNum ? "A" : "B",
    sound: (hallA.format.includes("IMAX") || (hallA.format.includes("Atmos") && !hallB.format.includes("IMAX"))) ? "A" : "B",
    transit: hallA.transitMinutes <= hallB.transitMinutes ? "A" : "B",
    price: hallA.priceNum <= hallB.priceNum ? "A" : "B",
    time: "A" // Preferred time
  };

  // Overall winner determination
  const overallWinner = hallA.id === "linkou-imax" || hallB.id === "linkou-imax"
    ? (hallA.id === "tonlin-hall-1" ? hallA : hallB)
    : hallA;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-cinema-900 border border-white/10 rounded-2xl sm:rounded-3xl max-w-[calc(100vw-24px)] sm:max-w-2xl w-full p-5 sm:p-7 space-y-5 shadow-2xl relative my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header (V2 Section 8: 兩場直接 PK) */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
            <Swords className="w-3.5 h-3.5" />
            <span>對決擂台</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            兩場直接 PK
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            不用自己查規格，一眼看懂誰贏什麼
          </p>
        </div>

        {/* Hall Selectors & Swap */}
        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 bg-cinema-950 p-2.5 rounded-2xl border border-white/[0.08]">
          <select
            value={hallAId}
            onChange={(e) => setHallAId(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer truncate"
          >
            {Object.values(COMPARE_HALLS).map((h) => (
              <option key={h.id} value={h.id} className="bg-cinema-950 text-white">
                {h.shortName} ({h.theaterName})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleSwap}
            className="p-2 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-cinema-950 text-slate-400 transition-all"
            title="對調比較選手"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <select
            value={hallBId}
            onChange={(e) => setHallBId(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer truncate text-right"
          >
            {Object.values(COMPARE_HALLS).map((h) => (
              <option key={h.id} value={h.id} className="bg-cinema-950 text-white">
                {h.shortName} ({h.theaterName})
              </option>
            ))}
          </select>
        </div>

        {/* Top Conclusion Banner (V2: First thing shown) */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 space-y-1.5">
          <div className="flex items-center gap-2 text-sm sm:text-base font-black text-amber-300">
            <Trophy className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
            <span>🏆 綜合推薦：{overallWinner.shortName}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            如果你在意整體爽度與距離，選 {hallA.shortName}；如果想要極致巨幕體驗，選 {hallB.shortName}。
          </p>
        </div>

        {/* 一眼看勝負表 (V2 Section 8 Winner Table) */}
        <div className="bg-cinema-950/90 rounded-2xl border border-white/[0.08] overflow-hidden">
          <div className="grid grid-cols-3 py-2 px-3.5 bg-white/[0.03] border-b border-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>比較項目</span>
            <span className="text-center">{hallA.shortName}</span>
            <span className="text-center">{hallB.shortName}</span>
          </div>

          <div className="divide-y divide-white/5 text-xs sm:text-sm">
            {/* 1. 🏟️ 大廳規模 */}
            <div className="grid grid-cols-3 items-center py-2.5 px-3.5">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <span>🏟️</span> 影廳規模
              </span>
              <div className="text-center font-bold">
                {winners.hallSize === "A" ? (
                  <span className="text-amber-400">🏆 {hallA.seatsText} (勝)</span>
                ) : (
                  <span className="text-slate-400">{hallA.seatsText}</span>
                )}
              </div>
              <div className="text-center font-bold">
                {winners.hallSize === "B" ? (
                  <span className="text-amber-400">🏆 {hallB.seatsText} (勝)</span>
                ) : (
                  <span className="text-slate-400">{hallB.seatsText}</span>
                )}
              </div>
            </div>

            {/* 2. 🔊 音效畫質 */}
            <div className="grid grid-cols-3 items-center py-2.5 px-3.5">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <span>🔊</span> 音效規格
              </span>
              <div className="text-center font-bold">
                {winners.sound === "A" ? (
                  <span className="text-amber-400">🏆 {hallA.format} (勝)</span>
                ) : (
                  <span className="text-slate-400">{hallA.format}</span>
                )}
              </div>
              <div className="text-center font-bold">
                {winners.sound === "B" ? (
                  <span className="text-amber-400">🏆 {hallB.format} (勝)</span>
                ) : (
                  <span className="text-slate-400">{hallB.format}</span>
                )}
              </div>
            </div>

            {/* 3. 🚗 交通距離 */}
            <div className="grid grid-cols-3 items-center py-2.5 px-3.5">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <span>🚗</span> 交通距離
              </span>
              <div className="text-center font-bold">
                {winners.transit === "A" ? (
                  <span className="text-amber-400">🏆 {hallA.transitMinutes} 分鐘 (勝)</span>
                ) : (
                  <span className="text-slate-400">{hallA.transitMinutes} 分鐘</span>
                )}
              </div>
              <div className="text-center font-bold">
                {winners.transit === "B" ? (
                  <span className="text-amber-400">🏆 {hallB.transitMinutes} 分鐘 (勝)</span>
                ) : (
                  <span className="text-slate-400">{hallB.transitMinutes} 分鐘</span>
                )}
              </div>
            </div>

            {/* 4. 💰 票價划算 */}
            <div className="grid grid-cols-3 items-center py-2.5 px-3.5">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <span>💰</span> 參考票價
              </span>
              <div className="text-center font-bold">
                {winners.price === "A" ? (
                  <span className="text-emerald-400">🏆 {hallA.priceDesc} (更省)</span>
                ) : (
                  <span className="text-slate-400">{hallA.priceDesc}</span>
                )}
              </div>
              <div className="text-center font-bold">
                {winners.price === "B" ? (
                  <span className="text-emerald-400">🏆 {hallB.priceDesc} (更省)</span>
                ) : (
                  <span className="text-slate-400">{hallB.priceDesc}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Second-level Progressive Disclosure: 看完整規格 */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowFullSpecs(!showFullSpecs)}
            className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 transition-all"
          >
            <span>{showFullSpecs ? "收合硬體詳細規格" : "看完整硬體詳細規格"}</span>
            {showFullSpecs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showFullSpecs && (
            <div className="mt-3 p-4 rounded-xl bg-cinema-950 border border-white/10 space-y-3 text-xs animate-fadeIn">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-amber-400">{hallA.shortName}</div>
                  <div className="text-slate-300">螢幕：{hallA.screenDesc}</div>
                  <div className="text-slate-300">音效：{hallA.soundDesc}</div>
                  <div className="text-slate-400">交通：{hallA.transitDesc}</div>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-amber-400">{hallB.shortName}</div>
                  <div className="text-slate-300">螢幕：{hallB.screenDesc}</div>
                  <div className="text-slate-300">音效：{hallB.soundDesc}</div>
                  <div className="text-slate-400">交通：{hallB.transitDesc}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom CTA */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-cinema-950 font-black text-sm transition-all shadow-md text-center"
          >
            決定好了，返回場次清單
          </button>
        </div>
      </div>
    </div>
  );
};
