import React, { useState } from "react";
import {
  FilterPreferences,
  Movie
} from "../types";
import {
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  X,
  Check,
  Film,
  MapPin,
  Clock
} from "lucide-react";

interface FilterBarProps {
  movies: Movie[];
  preferences: FilterPreferences;
  onPreferencesChange: (newPrefs: FilterPreferences) => void;
  resultCount: number;
  onPickClick?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  movies,
  preferences,
  onPreferencesChange,
  resultCount,
  onPickClick
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(() =>
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("view") === "drawer"
  );

  const updatePreference = <K extends keyof FilterPreferences>(
    key: K,
    value: FilterPreferences[K]
  ) => {
    onPreferencesChange({
      ...preferences,
      [key]: value
    });
  };

  const handlePickClick = () => {
    if (onPickClick) {
      onPickClick();
    } else {
      const el = document.getElementById("top-pick-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Active lifestyle preferences count
  const activePreferencesCount = [
    preferences.preferLargeHall,
    preferences.preferSpecialFormat,
    preferences.preferPromoPrice,
    preferences.allowCrossRegion
  ].filter(Boolean).length;

  return (
    <div className="w-full">
      {/* V2 Hero Section: 今晚想看什麼？ */}
      <div className="text-center pt-4 pb-5 sm:pt-6 sm:pb-6 space-y-1.5">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          今晚想看什麼？
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          我幫你挑最值得看的那一場。
        </p>
      </div>

      {/* 3 Core Selection Box (Mobile First, Single Clean Card) */}
      <div className="bg-cinema-900/90 border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 1. 電影 (Movie) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>想看電影</span>
            </label>
            <div className="relative">
              <select
                value={preferences.movieId}
                onChange={(e) => updatePreference("movieId", e.target.value)}
                className="w-full appearance-none bg-cinema-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-amber-400 transition-all cursor-pointer truncate pr-8"
              >
                {movies.map((m) => (
                  <option key={m.id} value={m.id} className="bg-cinema-950 text-white">
                    {m.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. 地點 (Location) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>人在哪裡</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-cinema-950 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => updatePreference("region", "taoyuan")}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  preferences.region === "taoyuan"
                    ? "bg-amber-500 text-cinema-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                桃園
              </button>
              <button
                type="button"
                onClick={() => updatePreference("region", "linkou")}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  preferences.region === "linkou"
                    ? "bg-amber-500 text-cinema-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                林口
              </button>
              <button
                type="button"
                onClick={() => updatePreference("region", "all")}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  preferences.region === "all"
                    ? "bg-amber-500 text-cinema-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                附近皆可
              </button>
            </div>
          </div>

          {/* 3. 時間 (Time) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>什麼時間</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-cinema-950 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => updatePreference("dateSlot", "today-afternoon")}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  preferences.dateSlot === "today-afternoon"
                    ? "bg-amber-500 text-cinema-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                現在 / 下午
              </button>
              <button
                type="button"
                onClick={() => updatePreference("dateSlot", "today-evening")}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  preferences.dateSlot === "today-evening"
                    ? "bg-amber-500 text-cinema-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                今晚
              </button>
              <button
                type="button"
                onClick={() => updatePreference("dateSlot", "tomorrow-afternoon")}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  preferences.dateSlot === "tomorrow-afternoon"
                    ? "bg-amber-500 text-cinema-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                明天
              </button>
            </div>
          </div>
        </div>

        {/* Action Row: Primary CTA & Lifestyle Preferences */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          {/* Main Decision CTA: 幫我挑一場 ✨ */}
          <button
            type="button"
            onClick={handlePickClick}
            className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-400 text-cinema-950 font-black text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all"
          >
            <Sparkles className="w-4 h-4 fill-cinema-950" />
            <span>幫我挑一場 ✨</span>
            <span className="text-xs font-normal opacity-80 pl-1">
              ({resultCount} 場分析中)
            </span>
          </button>

          {/* Lifestyle Preference Button: 想更合你胃口？ */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs sm:text-sm font-semibold text-slate-200 flex items-center justify-center gap-2 transition-all whitespace-nowrap"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>想更合你胃口？</span>
            {activePreferencesCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-cinema-950 font-bold text-xs flex items-center justify-center">
                {activePreferencesCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Slide-over / Bottom Drawer: 想更合你胃口？ */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-cinema-900 border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
              {/* Drawer Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>想更合你胃口？</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      告訴我們你的觀影習慣，為你客製推薦排序
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Plain-language lifestyle options (V2 Section 6) */}
                <div className="space-y-3">
                  {/* Option 1: 我就是要大廳 */}
                  <div
                    onClick={() => updatePreference("preferLargeHall", !preferences.preferLargeHall)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      preferences.preferLargeHall
                        ? "bg-amber-500/15 border-amber-500/40 text-white"
                        : "bg-cinema-950/60 border-white/5 text-slate-300 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">🏟️</span>
                      <div>
                        <div className="text-sm font-bold">我就是要大廳</div>
                        <div className="text-xs text-slate-400">優先推薦 250+ 席超大巨幕，視野包覆感最好</div>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        preferences.preferLargeHall ? "bg-amber-500 text-cinema-950 font-bold" : "border border-white/20"
                      }`}
                    >
                      {preferences.preferLargeHall && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Option 2: 音效畫質優先 */}
                  <div
                    onClick={() => updatePreference("preferSpecialFormat", !preferences.preferSpecialFormat)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      preferences.preferSpecialFormat
                        ? "bg-amber-500/15 border-amber-500/40 text-white"
                        : "bg-cinema-950/60 border-white/5 text-slate-300 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">🔊</span>
                      <div>
                        <div className="text-sm font-bold">音效畫質優先</div>
                        <div className="text-xs text-slate-400">鎖定 Dolby Atmos 杜比全景聲或 IMAX 雷射規格</div>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        preferences.preferSpecialFormat ? "bg-amber-500 text-cinema-950 font-bold" : "border border-white/20"
                      }`}
                    >
                      {preferences.preferSpecialFormat && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Option 3: 便宜最重要 */}
                  <div
                    onClick={() => updatePreference("preferPromoPrice", !preferences.preferPromoPrice)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      preferences.preferPromoPrice
                        ? "bg-amber-500/15 border-amber-500/40 text-white"
                        : "bg-cinema-950/60 border-white/5 text-slate-300 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">💰</span>
                      <div>
                        <div className="text-sm font-bold">便宜最重要</div>
                        <div className="text-xs text-slate-400">小資首選，優先找出特惠早場或信用卡划算票價</div>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        preferences.preferPromoPrice ? "bg-amber-500 text-cinema-950 font-bold" : "border border-white/20"
                      }`}
                    >
                      {preferences.preferPromoPrice && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Option 4: 不要跑太遠 */}
                  <div
                    onClick={() => updatePreference("allowCrossRegion", !preferences.allowCrossRegion)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      !preferences.allowCrossRegion
                        ? "bg-amber-500/15 border-amber-500/40 text-white"
                        : "bg-cinema-950/60 border-white/5 text-slate-300 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">🚗</span>
                      <div>
                        <div className="text-sm font-bold">不要跑太遠</div>
                        <div className="text-xs text-slate-400">只看在地影城（關閉時可接受跨區到林口看 IMAX）</div>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        !preferences.allowCrossRegion ? "bg-amber-500 text-cinema-950 font-bold" : "border border-white/20"
                      }`}
                    >
                      {!preferences.allowCrossRegion && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer CTA */}
              <div className="pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-cinema-950 font-black text-sm tracking-wide transition-all shadow-md"
                >
                  確認完成，看推薦結果
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
