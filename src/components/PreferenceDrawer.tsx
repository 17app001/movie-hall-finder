import React from "react";
import { FilterPreferences } from "../types";
import { X, Check } from "lucide-react";

interface PreferenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: FilterPreferences;
  onPreferencesChange: (newPrefs: FilterPreferences) => void;
}

export const PreferenceDrawer: React.FC<PreferenceDrawerProps> = ({
  isOpen,
  onClose,
  preferences,
  onPreferencesChange
}) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-[320px] sm:max-w-md rounded-2xl sm:rounded-3xl bg-cinema-900 border border-white/10 shadow-2xl p-4 sm:p-6 space-y-3.5 overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
          <div className="min-w-0 flex-1 pr-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              想更合你胃口？
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate">
              告訴我們觀影習慣，客製推薦排序
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Plain-language Lifestyle Options (V2.1 Section 6) */}
        <div className="space-y-2">
              {/* Option 1: 我就是要大廳 */}
              <div
                onClick={() => updatePreference("preferLargeHall", !preferences.preferLargeHall)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  preferences.preferLargeHall
                    ? "bg-amber-500/15 border-amber-500/40 text-white"
                    : "bg-cinema-950/60 border-white/5 text-slate-300 hover:border-white/15"
                }`}
              >
                <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                  <span className="text-lg shrink-0">🏟️</span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white">我就是要大廳</div>
                    <div className="text-xs text-slate-400 truncate">優先推薦 250+ 席超大巨幕</div>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${
                    preferences.preferLargeHall ? "bg-amber-500 text-cinema-950 font-bold" : "border border-white/20"
                  }`}
                >
                  {preferences.preferLargeHall && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* Option 2: 音效畫質優先 */}
              <div
                onClick={() => updatePreference("preferSpecialFormat", !preferences.preferSpecialFormat)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  preferences.preferSpecialFormat
                    ? "bg-amber-500/15 border-amber-500/40 text-white"
                    : "bg-cinema-950/60 border-white/5 text-slate-300 hover:border-white/15"
                }`}
              >
                <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                  <span className="text-lg shrink-0">🔊</span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white">音效畫質優先</div>
                    <div className="text-xs text-slate-400 truncate">鎖定 Dolby Atmos 或 IMAX 規格</div>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${
                    preferences.preferSpecialFormat ? "bg-amber-500 text-cinema-950 font-bold" : "border border-white/20"
                  }`}
                >
                  {preferences.preferSpecialFormat && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* Option 3: 時間最重要 */}
              <div
                onClick={() => updatePreference("preferTimeStrict", !preferences.preferTimeStrict)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  preferences.preferTimeStrict
                    ? "bg-amber-500/15 border-amber-500/40 text-white"
                    : "bg-cinema-950/60 border-white/5 text-slate-300 hover:border-white/15"
                }`}
              >
                <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                  <span className="text-lg shrink-0">🕒</span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white">時間最重要</div>
                    <div className="text-xs text-slate-400 truncate">嚴格鎖定指定時段，不跨時段延後</div>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${
                    preferences.preferTimeStrict ? "bg-amber-500 text-cinema-950 font-bold" : "border border-white/20"
                  }`}
                >
                  {preferences.preferTimeStrict && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* Option 4: 便宜最重要 */}
              <div
                onClick={() => updatePreference("preferPromoPrice", !preferences.preferPromoPrice)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  preferences.preferPromoPrice
                    ? "bg-amber-500/15 border-amber-500/40 text-white"
                    : "bg-cinema-950/60 border-white/5 text-slate-300 hover:border-white/15"
                }`}
              >
                <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                  <span className="text-lg shrink-0">💰</span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white">便宜最重要</div>
                    <div className="text-xs text-slate-400 truncate">優先找出特惠早場或划算票價</div>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${
                    preferences.preferPromoPrice ? "bg-amber-500 text-cinema-950 font-bold" : "border border-white/20"
                  }`}
                >
                  {preferences.preferPromoPrice && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* Option 4: 不要跑太遠 */}
              <div
                onClick={() => updatePreference("allowCrossRegion", !preferences.allowCrossRegion)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  !preferences.allowCrossRegion
                    ? "bg-amber-500/15 border-amber-500/40 text-white"
                    : "bg-cinema-950/60 border-white/5 text-slate-300 hover:border-white/15"
                }`}
              >
                <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                  <span className="text-lg shrink-0">🚗</span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white">不要跑太遠</div>
                    <div className="text-xs text-slate-400 truncate">只看在地影城（關閉可跨區林口）</div>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${
                    !preferences.allowCrossRegion ? "bg-amber-500 text-cinema-950 font-bold" : "border border-white/20"
                  }`}
                >
                  {!preferences.allowCrossRegion && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* Drawer Footer CTA */}
            <div className="pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-cinema-950 font-black text-sm tracking-wide transition-all shadow-md"
            >
              確認完成，看推薦結果
            </button>
          </div>
      </div>
    </div>
  );
};
