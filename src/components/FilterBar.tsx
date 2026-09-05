import React from "react";
import {
  FilterPreferences,
  Movie
} from "../types";
import {
  Sparkles,
  SlidersHorizontal,
  Film,
  MapPin,
  Clock,
  RotateCcw,
  Search
} from "lucide-react";

interface FilterBarProps {
  movies: Movie[];
  preferences: FilterPreferences;
  onPreferencesChange: (newPrefs: FilterPreferences) => void;
  resultCount: number;
  onSearchSubmit: () => void;
  isResultsMode: boolean;
  onResetSearch: () => void;
  onOpenPreferences: () => void;
  activePreferencesCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  movies,
  preferences,
  onPreferencesChange,
  resultCount,
  onSearchSubmit,
  isResultsMode,
  onResetSearch,
  onOpenPreferences,
  activePreferencesCount
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
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

  const regionLabel = preferences.region === "taoyuan" ? "桃園" : preferences.region === "linkou" ? "林口" : "附近";
  const timeLabel = preferences.dateSlot === "today-afternoon" ? "現在" : preferences.dateSlot === "today-evening" ? "今晚" : preferences.dateSlot === "tomorrow-afternoon" ? "明天" : "自訂";

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.englishTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mode 2: Results Mode — Compact Query Header (V2.1 Section 4)
  if (isResultsMode) {
    return (
      <div className="bg-cinema-900/90 border border-white/[0.08] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Film className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
              <span>《{currentMovie.title}》</span>
              <span className="text-white/20">·</span>
              <span className="text-amber-400">{regionLabel}</span>
              <span className="text-white/20">·</span>
              <span className="text-slate-300">{timeLabel}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              已為你挑出最值得看的首選 ({resultCount} 場分析)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={onOpenPreferences}
            className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>想更合你胃口？</span>
            {activePreferencesCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-cinema-950 font-bold text-[10px] flex items-center justify-center">
                {activePreferencesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onResetSearch}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-400 hover:text-white flex items-center justify-center gap-1 transition-all"
            title="返回首頁重新選擇電影與時段"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重新挑選</span>
          </button>
        </div>
      </div>
    );
  }

  // Mode 1: Pure Homepage Entry (V2.1 Section 2: 首頁只負責開始)
  return (
    <div className="w-full max-w-lg mx-auto py-4 sm:py-8 space-y-6">
      {/* Hero Header: 今晚想看什麼？ */}
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          今晚想看什麼？
        </h2>
        <p className="text-sm text-slate-400 font-medium">
          我幫你挑最值得看的那一場。
        </p>
      </div>

      {/* 3 Core Selection Box (V2.1.1 Section 2.2: 輕量化容器，去除厚重表單卡片感) */}
      <div className="bg-cinema-900/50 border border-white/[0.06] rounded-3xl p-5 sm:p-7 shadow-xl space-y-5 backdrop-blur-sm">
        {/* 1. 電影 (Movie) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-slate-400" />
              <span>想看電影</span>
            </label>
            <span className="text-[11px] text-slate-400 font-medium truncate max-w-[200px]">
              已選：{currentMovie.title}
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="搜尋電影名稱"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/60 focus:bg-white/[0.05] transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Trending / Filtered Movie Quick Select Pills (V2.1.1 Section 2.3: 沉靜選取狀態，不與主要 CTA 競爭) */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {(filteredMovies.length > 0 ? filteredMovies : movies).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  updatePreference("movieId", m.id);
                  setSearchQuery("");
                }}
                className={`px-3 py-1.5 text-xs rounded-xl border transition-all truncate max-w-full ${
                  preferences.movieId === m.id
                    ? "bg-white/15 text-white font-bold border-white/30 shadow-sm"
                    : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:text-slate-200 hover:border-white/15"
                }`}
              >
                {m.title}
              </button>
            ))}
          </div>
        </div>

        {/* 2. 地點 (Location) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>人在哪裡</span>
          </label>
          <div className="grid grid-cols-3 gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => updatePreference("region", "taoyuan")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                preferences.region === "taoyuan"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              桃園
            </button>
            <button
              type="button"
              onClick={() => updatePreference("region", "linkou")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                preferences.region === "linkou"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              林口
            </button>
            <button
              type="button"
              onClick={() => updatePreference("region", "all")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                preferences.region === "all"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              附近
            </button>
          </div>
        </div>

        {/* 3. 時間 (Time) - 現在 / 今晚 / 明天 / 自訂 */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>什麼時間</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => updatePreference("dateSlot", "today-afternoon")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                preferences.dateSlot === "today-afternoon"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              現在
            </button>
            <button
              type="button"
              onClick={() => updatePreference("dateSlot", "today-evening")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                preferences.dateSlot === "today-evening"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              今晚
            </button>
            <button
              type="button"
              onClick={() => updatePreference("dateSlot", "tomorrow-afternoon")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                preferences.dateSlot === "tomorrow-afternoon"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              明天
            </button>
            <button
              type="button"
              onClick={() => updatePreference("dateSlot", "custom")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                preferences.dateSlot === "custom" || preferences.dateSlot === "weekend"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              自訂
            </button>
          </div>
        </div>

        {/* The ONLY Primary CTA (V2.1 Section 2.1: 唯一主要 CTA) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onSearchSubmit}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-cinema-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-[0.99] transition-all"
          >
            <Sparkles className="w-5 h-5 fill-cinema-950" />
            <span>幫我挑一場 ✨</span>
          </button>
        </div>
      </div>

      {/* V2.1 Section 2.2: 首頁唯一輔助訊息 (非常淡的小字，建立信任) */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-500 font-medium">
          資料不足時會告訴你，不亂猜。
        </p>
      </div>
    </div>
  );
};
