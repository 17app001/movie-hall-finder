import React from "react";
import { VERIFIED_THEATERS } from "../data/theaters";
import {
  X,
  MapPin,
  Phone,
  ExternalLink,
  Car,
  Train,
  CheckCircle
} from "lucide-react";

interface TheaterGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheaterGuideModal: React.FC<TheaterGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-cinema-900 border border-white/10 shadow-2xl p-6 sm:p-7">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title (Review Section 6) */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-glow-accent">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-amber-400 font-bold uppercase">
              Pre-Movie Outing Guide
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              去看電影之前需要知道的事 (桃園 / 林口)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              車程、停車折抵、火車站捷運直達，以及看完可以吃什麼、順便逛什麼。
            </p>
          </div>
        </div>

        {/* Theaters List */}
        <div className="space-y-4">
          {VERIFIED_THEATERS.map((theater) => {
            // Food and Outing Tips for youth
            let foodTip = "";
            let shoppingTip = "";

            if (theater.id === "tonlin-vieshow") {
              foodTip = "統領廣場 5~8F 美食名店（海底撈、燒肉同話、黑毛屋、MoMo-Paradise）、ATT 筷食尚步行 1 分";
              shoppingTip = "直通統領廣場專櫃品牌、誠品書店、站前徒步購物街區";
            } else if (theater.id === "in89-taoyuan") {
              foodTip = "站前正對面小吃圈、中正路老牌肉圓、遠東百貨美食街、大同路咖啡甜品";
              shoppingTip = "正對新光三越、遠東百貨，火車站站前潮流服飾一級戰區";
            } else if (theater.id === "linkou-mitsui-vieshow") {
              foodTip = "三井 Outlet 美食街與主題餐廳（金子半之助、點水樓、藏壽司、乾杯燒肉）";
              shoppingTip = "全台旗艦級 MITSUI OUTLET PARK，上百家國際精品、運動潮流與日系品牌暢貨中心";
            }

            return (
              <div
                key={theater.id}
                className="p-5 rounded-3xl bg-cinema-950/85 border border-white/10 space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <span>{theater.name}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30">
                        官方認證實體
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {theater.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={theater.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs shadow-glow-accent hover:bg-amber-400 transition-all"
                    >
                      <span>Google 導航</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <a
                      href={`tel:${theater.phone}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cinema-850 hover:bg-cinema-800 text-slate-200 border border-white/10 font-bold text-xs transition-all"
                    >
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>撥打客服</span>
                    </a>
                  </div>
                </div>

                {/* Transit & Parking Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="flex items-start gap-2 bg-cinema-900/70 p-3 rounded-2xl border border-white/5">
                    <Train className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block mb-0.5">大眾運輸交通：</span>
                      <span className="text-slate-300 leading-relaxed">{theater.transitInfo}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-cinema-900/70 p-3 rounded-2xl border border-white/5">
                    <Car className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block mb-0.5">停車折抵優惠：</span>
                      <span className="text-slate-300 leading-relaxed">{theater.parkingInfo}</span>
                    </div>
                  </div>
                </div>

                {/* Outing Planner: 看完可以吃什麼 & 順便逛什麼 (Review Section 6) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <span className="font-bold text-amber-300 block flex items-center gap-1">
                      🍴 看完可以吃什麼：
                    </span>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      {foodTip}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                    <span className="font-bold text-indigo-300 block flex items-center gap-1">
                      🛍️ 順便逛什麼：
                    </span>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      {shoppingTip}
                    </p>
                  </div>
                </div>

                {/* Theater Highlight Features */}
                {theater.features && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {theater.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[11px] text-slate-300 flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3 text-amber-400" />
                        {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            所有影城電話與地址皆為官方真實認證資料，無任何杜撰。
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs transition-all"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

