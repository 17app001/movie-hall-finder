import React, { useState } from "react";
import { VERIFIED_THEATERS } from "../data/theaters";
import {
  X,
  Car,
  Utensils,
  ExternalLink,
  Phone,
  Compass
} from "lucide-react";

interface TheaterGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheaterGuideModal: React.FC<TheaterGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedTheaterId, setSelectedTheaterId] = useState<string>("vscinemas-taoyuan-tonlin");

  if (!isOpen) return null;

  const currentTheater = VERIFIED_THEATERS.find((t) => t.id === selectedTheaterId) || VERIFIED_THEATERS[0];

  // Specific 3-section guides for each theater (V2 Section 10)
  const guides: Record<string, {
    howToGetThere: { driveTime: string; transit: string; note: string };
    whereToPark: { spot: string; discount: string; tips: string };
    whatToEat: { recommendations: string[]; lateNight: string; hours: string };
  }> = {
    "vscinemas-taoyuan-tonlin": {
      howToGetThere: {
        driveTime: "桃園市區 5~10 分鐘，林口出發約 25 分鐘",
        transit: "桃園火車站前站出站步行約 3 分鐘即達統領廣場 9F",
        note: "站前商圈尖峰時段車流量大，搭火車最快最省時。"
      },
      whereToPark: {
        spot: "統領廣場地下停車場 (B3-B4)",
        discount: "憑當日威秀電影票根可折抵 2~3 小時停車費",
        tips: "假日午後 14:00~17:00 較容易滿位，可停附近文昌公園地下公有停車場。"
      },
      whatToEat: {
        recommendations: ["海底撈火鍋 (統領 8F)", "涓豆腐韓式料理 (5F)", "Mo-Mo-Paradise 壽喜燒"],
        lateNight: "看完晚場可走 3 分鐘至大同路熱炒或中正路宵夜豆漿。",
        hours: "商場餐廳營業至 21:30，部分鍋物營業至深夜 02:00。"
      }
    },
    "in89-taoyuan": {
      howToGetThere: {
        driveTime: "桃園市區 5~10 分鐘",
        transit: "桃園火車站正對面，出站走過斑馬線即達 (步行 2 分鐘)",
        note: "全桃園離火車站最近的影城，趕場最無負擔。"
      },
      whereToPark: {
        spot: "影城周邊特約停車場 / 站前地下停車場",
        discount: "持當日票根配合特定信用卡或特約場享優惠折抵",
        tips: "建議搭乘大眾運輸直達正門，無尋找車位煩惱。"
      },
      whatToEat: {
        recommendations: ["站前商圈老字號潤餅", "正一排骨飯", "站前新光三越美食街"],
        lateNight: "影城樓下即為站前小吃街，手搖飲、鹹酥雞選擇極多。",
        hours: "周邊街邊小吃多數營業至 23:00 以後。"
      }
    },
    "vscinemas-linkou-mitsui": {
      howToGetThere: {
        driveTime: "國道一號林口交流道下 5 分鐘即可抵達；桃園市區開車約 20~25 分鐘",
        transit: "桃園機捷 A9 林口站，步行約 8 分鐘或搭接駁公車",
        note: "跨區首選，路大好開，極具出遊渡假感。"
      },
      whereToPark: {
        spot: "MITSUI OUTLET PARK 大型專用地下與立體停車場 (千個車位)",
        discount: "憑威秀電影票根一張折抵 2 小時，最高可合併商場消費折抵 5 小時",
        tips: "車位充裕，極度適合開車族或情侶出遊。"
      },
      whatToEat: {
        recommendations: ["金子半之助天丼", "靜岡勝政日式豬排", "Kua'Aina 夏威夷漢堡"],
        lateNight: "OUTLET 商場餐廳至 21:30，文化三路周邊有深夜熱炒與居酒屋。",
        hours: "商場美食街 11:00 ~ 21:30。"
      }
    }
  };

  const currentGuide = guides[currentTheater.id] || guides["vscinemas-taoyuan-tonlin"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-[calc(100vw-24px)] sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-cinema-900 border border-white/10 shadow-2xl p-5 sm:p-7 space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
            <Compass className="w-3.5 h-3.5" />
            <span>出遊交通指南</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            去這間影城 🚗
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            看電影前需要知道的事：怎麼去、停哪裡、看完吃什麼
          </p>
        </div>

        {/* Theater Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-cinema-950 p-1 rounded-xl border border-white/10">
          {VERIFIED_THEATERS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTheaterId(t.id)}
              className={`py-2 px-1 text-xs font-bold rounded-lg transition-all truncate text-center ${
                selectedTheaterId === t.id
                  ? "bg-amber-500 text-cinema-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.district === "林口區" ? "林口三井" : t.name.replace("桃園", "").replace("影城", "")}
            </button>
          ))}
        </div>

        {/* Theater Card Header */}
        <div className="p-3.5 rounded-2xl bg-cinema-950 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-bold text-white">{currentTheater.name}</h4>
            <p className="text-xs text-slate-400">{currentTheater.address}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={currentTheater.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-cinema-950 text-xs font-bold flex items-center gap-1 transition-all"
            >
              <span>Google 導航</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={`tel:${currentTheater.phone}`}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all"
              title="撥打電話"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
            </a>
          </div>
        </div>

        {/* V2 Section 10: 3 Clean Pillars */}
        <div className="space-y-3">
          {/* 1. 🚗 怎麼去 */}
          <div className="p-4 rounded-2xl bg-cinema-950/80 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
              <Car className="w-4 h-4 text-amber-400" />
              <span>🚗 怎麼去</span>
            </div>
            <p className="text-xs text-slate-200">
              <span className="font-semibold text-slate-400">大眾運輸：</span>
              {currentGuide.howToGetThere.transit}
            </p>
            <p className="text-xs text-slate-300">
              <span className="font-semibold text-slate-400">開車時間：</span>
              {currentGuide.howToGetThere.driveTime}
            </p>
            <p className="text-[11px] text-slate-400 pt-0.5">
              💡 {currentGuide.howToGetThere.note}
            </p>
          </div>

          {/* 2. 🅿️ 停哪裡 */}
          <div className="p-4 rounded-2xl bg-cinema-950/80 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
              <span>🅿️</span>
              <span>停哪裡</span>
            </div>
            <p className="text-xs text-slate-200 font-semibold">
              {currentGuide.whereToPark.spot}
            </p>
            <p className="text-xs text-emerald-300">
              🎫 電影折抵：{currentGuide.whereToPark.discount}
            </p>
            <p className="text-[11px] text-slate-400 pt-0.5">
              💡 車位提醒：{currentGuide.whereToPark.tips}
            </p>
          </div>

          {/* 3. 🍜 看完吃什麼 */}
          <div className="p-4 rounded-2xl bg-cinema-950/80 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>🍜 看完吃什麼</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {currentGuide.whatToEat.recommendations.map((food, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-lg bg-white/5 text-slate-200 text-xs border border-white/10"
                >
                  {food}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-300 pt-1">
              🌙 宵夜場：{currentGuide.whatToEat.lateNight}
            </p>
            <p className="text-[11px] text-slate-400">
              ⏰ 營業時間：{currentGuide.whatToEat.hours}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all text-center"
          >
            關閉指南
          </button>
        </div>
      </div>
    </div>
  );
};
