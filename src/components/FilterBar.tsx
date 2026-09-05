import React, { useState } from "react";
import {
  DateSlot,
  FilterPreferences,
  Movie
} from "../types";
import {
  Flame,
  Volume2,
  Tag,
  Compass,
  Clock,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  X,
  Check,
  Film
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
  const currentMovie = movies.find((m) => m.id === preferences.movieId) || movies[0];

  const updatePreference = <K extends keyof FilterPreferences>(
    key: K,
    value: FilterPreferences[K]
  ) => {
    onPreferencesChange({
      ...preferences,
      [key]: value
    });
  };

  // Count active preference boosters
  const activeBoostersCount = [
    preferences.preferLargeHall,
    preferences.preferSpecialFormat,
    preferences.preferPromoPrice,
    preferences.allowCrossRegion
  ].filter(Boolean).length;

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

  return (
    <>
      <div className="glass-panel rounded-3xl p-5 sm:p-6 mb-6 border border-white/10 shadow-2xl transition-all">
        {/* Step 1, 2, 3 Conversational Query Strip */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          {/* Question 1: 我想看 (Movie) - 5 cols */}
          <div className="md:col-span-5 flex flex-col justify-center space-y-1.5 p-3 rounded-2xl bg-cinema-950/70 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                我想看：
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {currentMovie.runtime}m · {currentMovie.rating}
              </span>
            </div>

            <div className="relative">
              <select
                value={preferences.movieId}
                onChange={(e) => updatePreference("movieId", e.target.value)}
                className="w-full appearance-none rounded-xl bg-cinema-900/90 border border-white/15 px-3 py-2 pr-9 text-sm font-black text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer hover:border-white/30"
              >
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id} className="bg-cinema-950 text-white py-2">
                    {movie.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Question 2: 我在 (Region) - 3 cols */}
          <div className="md:col-span-3 flex flex-col justify-center space-y-1.5 p-3 rounded-2xl bg-cinema-950/70 border border-white/5">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              我在：
            </span>

            <div className="grid grid-cols-3 gap-1 bg-cinema-900 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => updatePreference("region", "taoyuan")}
                className={`py-1.5 rounded-lg font-bold transition-all text-center ${
                  preferences.region === "taoyuan"
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                桃園
              </button>
              <button
                onClick={() => updatePreference("region", "linkou")}
                className={`py-1.5 rounded-lg font-bold transition-all text-center ${
                  preferences.region === "linkou"
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                林口
              </button>
              <button
                onClick={() => updatePreference("region", "all")}
                className={`py-1.5 rounded-lg font-bold transition-all text-center ${
                  preferences.region === "all"
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                全部
              </button>
            </div>
          </div>

          {/* Question 3: 我想 (Time Slot) - 4 cols */}
          <div className="md:col-span-4 flex flex-col justify-center space-y-1.5 p-3 rounded-2xl bg-cinema-950/70 border border-white/5">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              我想：
            </span>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: "today-afternoon", label: "今天下午", desc: "13~18點" },
                { id: "today-evening", label: "今天晚上", desc: "18~23點" },
                { id: "tomorrow-afternoon", label: "明天下午", desc: "週日場" },
                { id: "weekend", label: "週末全天", desc: "假日時段" }
              ].map((slot) => {
                const active = preferences.dateSlot === slot.id;
                return (
                  <button
                    key={slot.id}
                    onClick={() => updatePreference("dateSlot", slot.id as DateSlot)}
                    className={`px-2.5 py-1.5 rounded-xl font-bold transition-all text-left flex items-center justify-between ${
                      active
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-glow-accent ring-1 ring-amber-400"
                        : "bg-cinema-900 hover:bg-cinema-850 text-slate-300 border border-white/10"
                    }`}
                  >
                    <span>{slot.label}</span>
                    <span className={`text-[10px] ${active ? "text-black/80" : "text-slate-500"}`}>
                      {slot.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Row: Big CTA "幫我挑一場" + Preferences Trigger + Active Chips */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3.5">
          {/* Active Boosters Tags & Drawer Trigger Button */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Slide-over Drawer / Bottom Sheet Trigger Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cinema-850 hover:bg-cinema-800 border border-white/15 hover:border-amber-400/50 text-xs font-bold text-slate-200 transition-all shadow-sm group"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
              <span>偏好加權</span>
              {activeBoostersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-black">
                  {activeBoostersCount}
                </span>
              )}
            </button>

            {/* Quick Active Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {preferences.preferLargeHall && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <Flame className="w-3 h-3 text-amber-400" />
                  大廳優先
                </span>
              )}
              {preferences.preferSpecialFormat && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                  <Volume2 className="w-3 h-3 text-indigo-400" />
                  Atmos/IMAX
                </span>
              )}
              {preferences.preferPromoPrice && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <Tag className="w-3 h-3 text-emerald-400" />
                  小資優惠
                </span>
              )}
              {preferences.allowCrossRegion && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                  <Compass className="w-3 h-3 text-cyan-400" />
                  跨區 (桃園↔林口)
                </span>
              )}
            </div>
          </div>

          {/* Right Side: Big CTA Button "幫我挑一場" + Count */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-slate-400">
              符合條件：<strong className="text-amber-400 font-mono text-sm">{resultCount}</strong> 場
            </span>

            {/* Prominent Cinema Hero Action Button (Review 2.B) */}
            <button
              onClick={handlePickClick}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-black text-sm tracking-wide shadow-glow-accent hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>幫我挑一場</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Drawer / Bottom Sheet for Preferences (Review 2.A & 7.1) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => setIsDrawerOpen(false)} />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-cinema-900 border-l border-white/10 shadow-2xl h-full flex flex-col p-6 overflow-y-auto animate-slideInRight z-10">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">影迷偏好加權設定</h3>
                  <p className="text-xs text-slate-400">客製微調演算法評分權重</p>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body - Booster Switches */}
            <div className="space-y-4 flex-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                核心偏好加權 (點擊切換)
              </span>

              {/* 1. Prefer Large Hall */}
              <div
                onClick={() => updatePreference("preferLargeHall", !preferences.preferLargeHall)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  preferences.preferLargeHall
                    ? "bg-amber-500/15 border-amber-500/50 shadow-sm"
                    : "bg-cinema-950/60 border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${preferences.preferLargeHall ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-slate-500"}`}>
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">優先巨幕大廳 (&gt;200 席)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">拒絕小廳！放大影廳規模與開闊視覺之評分權重</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${preferences.preferLargeHall ? "bg-amber-500 border-amber-400 text-black" : "border-slate-600"}`}>
                  {preferences.preferLargeHall && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* 2. Prefer Special Format */}
              <div
                onClick={() => updatePreference("preferSpecialFormat", !preferences.preferSpecialFormat)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  preferences.preferSpecialFormat
                    ? "bg-indigo-500/15 border-indigo-500/50 shadow-sm"
                    : "bg-cinema-950/60 border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${preferences.preferSpecialFormat ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-slate-500"}`}>
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">震撼頂級音畫 (Atmos / IMAX / 4DX)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">優先挑選杜比全景聲、雙雷射 IMAX 或體感低頻座椅</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${preferences.preferSpecialFormat ? "bg-indigo-500 border-indigo-400 text-white" : "border-slate-600"}`}>
                  {preferences.preferSpecialFormat && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* 3. Prefer Promo Price */}
              <div
                onClick={() => updatePreference("preferPromoPrice", !preferences.preferPromoPrice)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  preferences.preferPromoPrice
                    ? "bg-emerald-500/15 border-emerald-500/50 shadow-sm"
                    : "bg-cinema-950/60 border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${preferences.preferPromoPrice ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-500"}`}>
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">小資優惠與高性價比優先</h4>
                    <p className="text-xs text-slate-400 mt-0.5">提升信用卡折抵、促銷折扣與平價場次之權重</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${preferences.preferPromoPrice ? "bg-emerald-500 border-emerald-400 text-black" : "border-slate-600"}`}>
                  {preferences.preferPromoPrice && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* 4. Allow Cross Region */}
              <div
                onClick={() => updatePreference("allowCrossRegion", !preferences.allowCrossRegion)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  preferences.allowCrossRegion
                    ? "bg-cyan-500/15 border-cyan-500/50 shadow-sm"
                    : "bg-cinema-950/60 border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${preferences.allowCrossRegion ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-slate-500"}`}>
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">允許跨區移動 (桃園 ↔ 林口)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">跨區納入林口三井 MITSUI 威秀 IMAX 旗艦巨幕評比</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${preferences.allowCrossRegion ? "bg-cyan-500 border-cyan-400 text-black" : "border-slate-600"}`}>
                  {preferences.allowCrossRegion && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* Sorting Mode */}
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  場次排序方式
                </label>
                <select
                  value={preferences.sortBy}
                  onChange={(e) => updatePreference("sortBy", e.target.value as any)}
                  className="w-full appearance-none rounded-xl bg-cinema-950 border border-white/10 px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="score">演算法推薦分數最高 (首選)</option>
                  <option value="time">開演時間最早</option>
                  <option value="price">實惠票價最低</option>
                </select>
              </div>
            </div>

            {/* Drawer Footer CTA */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-3 rounded-xl bg-amber-500 text-black font-black text-xs shadow-glow-accent hover:bg-amber-400 transition-all"
              >
                儲存偏好並返回
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


