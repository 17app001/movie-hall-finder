import React from "react";
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
  ChevronDown
} from "lucide-react";

interface FilterBarProps {
  movies: Movie[];
  preferences: FilterPreferences;
  onPreferencesChange: (newPrefs: FilterPreferences) => void;
  resultCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  movies,
  preferences,
  onPreferencesChange,
  resultCount
}) => {
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

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-6 border border-white/10 shadow-2xl transition-all">
      {/* Row 1: Movie Selection + Region Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Movie Selector (7 cols) */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            選擇電影
          </label>
          <div className="relative w-full">
            <select
              value={preferences.movieId}
              onChange={(e) => updatePreference("movieId", e.target.value)}
              className="w-full appearance-none rounded-xl bg-cinema-900/90 border border-white/15 px-4 py-2.5 pr-10 text-sm font-bold text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer hover:border-white/30"
            >
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id} className="bg-cinema-950 text-white py-2">
                  {movie.title} ({movie.runtime} 分鐘 · {movie.rating})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Quick Movie Info Badges */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
              {currentMovie.runtime}m
            </span>
            <span className="px-2 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-[11px] font-semibold text-amber-300">
              {currentMovie.rating}
            </span>
          </div>
        </div>

        {/* Region Scope Filter (5 cols) */}
        <div className="lg:col-span-5 flex items-center justify-between sm:justify-end gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            地區範圍
          </label>
          <div className="inline-flex rounded-xl bg-cinema-900/90 p-1 border border-white/10 text-xs">
            <button
              onClick={() => updatePreference("region", "all")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                preferences.region === "all"
                  ? "bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              全部影城
            </button>
            <button
              onClick={() => updatePreference("region", "taoyuan")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                preferences.region === "taoyuan"
                  ? "bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              桃園區 (站前)
            </button>
            <button
              onClick={() => updatePreference("region", "linkou")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                preferences.region === "linkou"
                  ? "bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              林口區 (三井)
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Time Slot Chips */}
      <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-300">時段捷徑：</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "today-afternoon", label: "今天下午 (13:00-18:00)", badge: "首選推薦" },
              { id: "today-evening", label: "今天晚上 (18:00-22:30)", badge: "熱門" },
              { id: "tomorrow-afternoon", label: "明天下午" },
              { id: "weekend", label: "週末全天" }
            ].map((slot) => {
              const active = preferences.dateSlot === slot.id;
              return (
                <button
                  key={slot.id}
                  onClick={() => updatePreference("dateSlot", slot.id as DateSlot)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-glow-accent ring-1 ring-amber-400"
                      : "bg-cinema-850 hover:bg-cinema-800 text-slate-300 border border-white/5 hover:border-white/20"
                  }`}
                >
                  <span>{slot.label}</span>
                  {slot.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        active ? "bg-black/30 text-black" : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {slot.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort Filter Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">排序方式：</span>
          <select
            value={preferences.sortBy}
            onChange={(e) => updatePreference("sortBy", e.target.value as any)}
            className="rounded-lg bg-cinema-850 border border-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="score">推薦分數最高 (演算法首選)</option>
            <option value="time">開演時間最早</option>
            <option value="price">實惠票價最低</option>
          </select>
        </div>
      </div>

      {/* Row 3: Modern Youth-Oriented Feature Toggles */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            偏好加權：
          </span>

          {/* Toggle: Prefer Large Hall */}
          <button
            onClick={() => updatePreference("preferLargeHall", !preferences.preferLargeHall)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
              preferences.preferLargeHall
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm ring-1 ring-amber-400/30"
                : "bg-cinema-850 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/15"
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${preferences.preferLargeHall ? "text-amber-400 animate-pulse" : "text-slate-500"}`} />
            <span>優先大廳 (&gt;200座)</span>
          </button>

          {/* Toggle: Special Format */}
          <button
            onClick={() => updatePreference("preferSpecialFormat", !preferences.preferSpecialFormat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
              preferences.preferSpecialFormat
                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-sm ring-1 ring-indigo-400/30"
                : "bg-cinema-850 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/15"
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 ${preferences.preferSpecialFormat ? "text-indigo-400" : "text-slate-500"}`} />
            <span>震撼音畫 (Atmos / IMAX / 4DX)</span>
          </button>

          {/* Toggle: Promo Price */}
          <button
            onClick={() => updatePreference("preferPromoPrice", !preferences.preferPromoPrice)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
              preferences.preferPromoPrice
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm ring-1 ring-emerald-400/30"
                : "bg-cinema-850 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/15"
            }`}
          >
            <Tag className={`w-3.5 h-3.5 ${preferences.preferPromoPrice ? "text-emerald-400" : "text-slate-500"}`} />
            <span>小資優惠折抵優先</span>
          </button>

          {/* Toggle: Cross Region (Linkou Comparison) */}
          <button
            onClick={() => updatePreference("allowCrossRegion", !preferences.allowCrossRegion)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
              preferences.allowCrossRegion
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm ring-1 ring-cyan-400/30"
                : "bg-cinema-850 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/15"
            }`}
            title="跨區納入林口三井 MITSUI OUTLET PARK 威秀影城 IMAX / 4DX 進行性價比與影廳規模橫向評比"
          >
            <Compass className={`w-3.5 h-3.5 ${preferences.allowCrossRegion ? "text-cyan-400" : "text-slate-500"}`} />
            <span>允許跨區移動 (桃園 ↔ 林口)</span>
          </button>
        </div>

        {/* Real-time Matching Count */}
        <div className="text-xs text-slate-400">
          符合條件場次：
          <span className="ml-1 text-sm font-bold text-amber-400 font-mono">
            {resultCount}
          </span>{" "}
          場
        </div>
      </div>
    </div>
  );
};

