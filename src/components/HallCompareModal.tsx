import React from "react";
import { X, Trophy, Volume2, Tv, Users, MapPin, Sparkles, CheckCircle2 } from "lucide-react";

interface HallCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HallCompareModal: React.FC<HallCompareModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const compareList = [
    {
      theaterName: "桃園統領威秀影城",
      hallNo: "1 廳 (旗艦全景聲大廳)",
      badge: "桃園最大廳首選",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      seats: "288 席 (巨大廳)",
      screen: "14 米 4K Barco 雷射高對比銀幕",
      sound: "Dolby Atmos 64 獨立天空聲道",
      laser: "是 (4K 雷射投影)",
      features: "排距 115cm，視覺無遮蔽，開闊感全桃第一",
      transit: "火車站前站步行 3 分 (統領廣場美食街直通)",
      priceRange: "$290 ~ $340"
    },
    {
      theaterName: "桃園站前 in89 豪華影城",
      hallNo: "1 廳 (LUXE 旗艦廳)",
      badge: "體感與對比極致",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
      seats: "236 席 (中大廳)",
      screen: "LUXE 終極高增益銀幕 (92% 反射率)",
      sound: "Dolby Atmos + 杜比全景聲低頻震動座椅",
      laser: "是 (高增益終極銀幕)",
      features: "重低音直接帶動座椅震動，動作片體感衝擊力強",
      transit: "火車站前站正對面步行 2 分",
      priceRange: "$280 ~ $350"
    },
    {
      theaterName: "林口 MITSUI OUTLET 威秀",
      hallNo: "IMAX 廳 (雙雷射巨幕)",
      badge: "跨區極限巨幕",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      seats: "340 席 (超巨幕大廳)",
      screen: "4K 雙雷射 IMAX 弧形巨幕 (寬 22 米 x 高 13.6 米)",
      sound: "IMAX 12-Channel 新世代環繞音響",
      laser: "是 (IMAX 頂規雙雷射)",
      features: "北台灣頂級商用巨幕，沉浸視野無可匹敵",
      transit: "機捷 A9 林口站 10 分 / 桃園開車 15 分",
      priceRange: "$390 ~ $450"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-cinema-900 border border-white/10 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                桃園雙雄 vs 林口旗艦影廳 · 規格深度 PK 矩陣
              </h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                影迷挑廳指南
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              買票不再看運氣！挑對影廳，同樣票價享受 200% 的沉浸音畫體驗。
            </p>
          </div>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {compareList.map((item, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-cinema-950/80 border border-white/10 flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition-all shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="text-xs font-mono font-black text-emerald-400">
                    {item.priceRange}
                  </span>
                </div>

                <h3 className="text-base font-black text-white leading-tight">
                  {item.theaterName}
                </h3>
                <p className="text-xs font-bold text-amber-400 mt-0.5">
                  {item.hallNo}
                </p>

                <div className="mt-4 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                    <Users className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">座位席次：</span>
                      <span>{item.seats}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                    <Tv className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">銀幕規格：</span>
                      <span className="leading-snug block">{item.screen}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                    <Volume2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">音響設備：</span>
                      <span className="leading-snug block">{item.sound}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">核心特色亮點：</span>
                      <span className="leading-snug block">{item.features}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">交通距離：</span>
                      <span className="leading-snug block">{item.transit}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>硬體規格官方認證已核實</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            💡 評估建議：一般科幻首推「統領 1 廳 Atmos」；動作重低音大片首推「in89 1 廳震動座椅」；若為諾蘭或沙丘等原生巨幕，值得直奔「林口 IMAX」！
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs shadow-glow-accent hover:bg-amber-400 transition-all shrink-0 ml-4"
          >
            完成檢視
          </button>
        </div>
      </div>
    </div>
  );
};

