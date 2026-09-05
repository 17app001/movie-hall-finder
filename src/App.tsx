import { useState, useMemo, useEffect } from "react";
import {
  FilterPreferences,
  Hall,
  MissingInfoTask,
  Showtime
} from "./types";
import { THEATER_MAP } from "./data/theaters";
import { MOCK_MOVIES, MOCK_HALLS, MOCK_SHOWTIMES } from "./data/mockData";
import { rankShowtimes } from "./services/scorer";
import { INITIAL_MISSING_TASKS } from "./services/missingInfoService";

import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { TopPickCard } from "./components/TopPickCard";
import { ShowtimeList } from "./components/ShowtimeList";
import { HallSpecModal } from "./components/HallSpecModal";
import { MissingInfoPanel } from "./components/MissingInfoPanel";
import { VoiceAgentModal } from "./components/VoiceAgentModal";
import { TheaterGuideModal } from "./components/TheaterGuideModal";
import { HallCompareModal } from "./components/HallCompareModal";
import { PreferenceDrawer } from "./components/PreferenceDrawer";
import { Film, Swords, MapPin, PhoneCall, ChevronDown, ChevronUp } from "lucide-react";

export function App() {
  // State: Halls and Showtimes (allows dynamic verification updates via Voice Agent)
  const [halls, setHalls] = useState<Hall[]>(MOCK_HALLS);
  const [showtimes] = useState<Showtime[]>(MOCK_SHOWTIMES);
  const [missingTasks, setMissingTasks] = useState<MissingInfoTask[]>(INITIAL_MISSING_TASKS);
  const [showMissingPanel, setShowMissingPanel] = useState(false);

  // State: Search & Results Mode (V2.1: Homepage is pure entry; results mode convinces user)
  const [hasSearched, setHasSearched] = useState(false);
  const [isPreferenceDrawerOpen, setIsPreferenceDrawerOpen] = useState(false);

  // State: User filter preferences (default: Today afternoon, Taoyuan district, War of Hope, prefer large hall)
  const [preferences, setPreferences] = useState<FilterPreferences>({
    movieId: "movie-1",
    region: "taoyuan",
    dateSlot: "today-afternoon",
    preferLargeHall: true,
    preferSpecialFormat: false,
    preferPromoPrice: false,
    allowCrossRegion: false,
    sortBy: "score"
  });

  // State: Modals
  const [inspectingHallId, setInspectingHallId] = useState<string | null>(null);
  const [isTheaterGuideOpen, setIsTheaterGuideOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedCompareHallId, setSelectedCompareHallId] = useState<string | null>(null);
  const [voiceAgentTask, setVoiceAgentTask] = useState<MissingInfoTask | null>(null);

  // Deep linking for automated visual screenshots and QA
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const searched = params.get("searched");
      const view = params.get("view");
      if (searched === "true" || view) {
        setHasSearched(true);
      }
      if (view === "compare") setIsCompareModalOpen(true);
      if (view === "spec") setInspectingHallId("tonlin-hall-1");
      if (view === "voice") setVoiceAgentTask(missingTasks[0]);
      if (view === "guide") setIsTheaterGuideOpen(true);
      if (view === "drawer" || view === "preference") setIsPreferenceDrawerOpen(true);
    }
  }, [missingTasks]);

  // Maps for fast lookup
  const hallMap = useMemo(() => new Map<string, Hall>(halls.map((h) => [h.id, h])), [halls]);
  const theaterMap = useMemo(() => THEATER_MAP, []);

  // Compute Ranked Recommendations in real-time
  const rankedResults = useMemo(() => {
    return rankShowtimes(showtimes, theaterMap, hallMap, MOCK_MOVIES, preferences);
  }, [showtimes, theaterMap, hallMap, preferences]);

  const topPick = rankedResults.length > 0 ? rankedResults[0] : null;
  const candidateList = rankedResults.length > 1 ? rankedResults.slice(1) : [];

  // Currently inspecting hall object
  const inspectingHall = inspectingHallId ? hallMap.get(inspectingHallId) || null : null;
  const inspectingTheater = inspectingHall ? theaterMap.get(inspectingHall.theaterId) || null : null;

  // Handler for Voice Agent Task Resolution
  const handleTaskResolved = (taskId: string) => {
    setMissingTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "resolved" } : t))
    );

    // If task was for in89-hall-3, update the hall to verified & 7.1 surround
    if (taskId === "task-in89-hall-3") {
      setHalls((prev) =>
        prev.map((h) =>
          h.id === "in89-hall-3"
            ? {
                ...h,
                soundSystem: "JBL 7.1 環繞聲道 (已致電官方客服核實)",
                screenSpecs: "數位標準雷射銀幕 (已核實)",
                dataStatus: "verified",
                source: "影城官方客服電話 (03) 331-0656 核實",
                verifiedAt: "2026-09-05"
              }
            : h
        )
      );
    }
  };

  const pendingTasksCount = missingTasks.filter((t) => t.status !== "resolved").length;

  // Active lifestyle preferences count
  const activePreferencesCount = useMemo(() => {
    let count = 0;
    if (preferences.preferLargeHall) count++;
    if (preferences.preferSpecialFormat) count++;
    if (preferences.preferPromoPrice) count++;
    if (preferences.allowCrossRegion) count++;
    return count;
  }, [preferences]);

  return (
    <div className="min-h-screen bg-cinema-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Sticky Header (V2.1: Clean entry on homepage, actions in results mode) */}
      <Header
        onOpenTheaterGuide={() => setIsTheaterGuideOpen(true)}
        onOpenVoiceAgent={() => setVoiceAgentTask(missingTasks[0])}
        pendingTasksCount={pendingTasksCount}
        isResultsMode={hasSearched}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* Dynamic Filter / Search Bar (Mode 1: Pure Homepage Entry; Mode 2: Compact Results Bar) */}
        <FilterBar
          movies={MOCK_MOVIES}
          preferences={preferences}
          onPreferencesChange={setPreferences}
          resultCount={rankedResults.length}
          isResultsMode={hasSearched}
          onSearchSubmit={() => {
            setHasSearched(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onResetSearch={() => {
            setHasSearched(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onOpenPreferences={() => setIsPreferenceDrawerOpen(true)}
          activePreferencesCount={activePreferencesCount}
        />

        {/* Mode 2: Results Mode Content (V2.1 Section 4: 搜尋後才負責說服你) */}
        {hasSearched && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Pick Hero Card (V2.1: Absolute Protagonist) */}
            {topPick ? (
              <TopPickCard
                recommendation={topPick}
                onInspectHall={(hallId) => setInspectingHallId(hallId)}
                onOpenTheaterGuide={() => setIsTheaterGuideOpen(true)}
                onOpenCompareModal={() => {
                  setSelectedCompareHallId(candidateList[0]?.hall?.id || "linkou-imax");
                  setIsCompareModalOpen(true);
                }}
              />
            ) : (
              <div className="bg-cinema-900/60 rounded-3xl p-8 text-center text-slate-400 border border-white/10">
                <Film className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-80" />
                <h3 className="text-lg font-bold text-white">找不到符合此條件的場次</h3>
                <p className="text-xs text-slate-400 mt-1">
                  點擊「想更合你胃口？」切換時段或開啟「跨區林口」即可探索更多優質大廳！
                </p>
              </div>
            )}

            {/* Showtime Candidates List (Why not first? #2 / #3) */}
            <ShowtimeList
              candidates={candidateList}
              onInspectHall={(hallId) => setInspectingHallId(hallId)}
              onOpenCompareModal={(hallId) => {
                setSelectedCompareHallId(hallId || candidateList[0]?.hall?.id || "linkou-imax");
                setIsCompareModalOpen(true);
              }}
            />

            {/* Discrete Secondary Section: 影城規格補查中心 (Progressive Disclosure) */}
            <div className="pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setShowMissingPanel(!showMissingPanel)}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-xs text-slate-400 hover:text-slate-200 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <span>📞 有影廳規格尚未確認？查看「幫我問影城」排查清單</span>
                  {pendingTasksCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                      {pendingTasksCount} 廳待查
                    </span>
                  )}
                </div>
                {showMissingPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showMissingPanel && (
                <div className="mt-3 animate-fadeIn">
                  <MissingInfoPanel
                    tasks={missingTasks}
                    onStartVoiceCall={(task) => setVoiceAgentTask(task)}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Sticky Bottom Bar (Results Mode Only) */}
      {hasSearched && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-cinema-950/95 backdrop-blur-xl border-t border-white/10 px-6 py-2.5 flex items-center justify-between shadow-2xl animate-fadeIn">
          <button
            onClick={() => {
              const el = document.getElementById("top-pick-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center text-amber-400 font-bold text-[10px]"
          >
            <Film className="w-4 h-4 mb-0.5" />
            <span>今日首選</span>
          </button>

          <button
            onClick={() => {
              setSelectedCompareHallId(candidateList[0]?.hall?.id || "linkou-imax");
              setIsCompareModalOpen(true);
            }}
            className="flex flex-col items-center text-slate-300 hover:text-white font-bold text-[10px]"
          >
            <Swords className="w-4 h-4 mb-0.5 text-amber-400" />
            <span>兩場 PK</span>
          </button>

          <button
            onClick={() => setIsTheaterGuideOpen(true)}
            className="flex flex-col items-center text-slate-300 hover:text-white font-bold text-[10px]"
          >
            <MapPin className="w-4 h-4 mb-0.5 text-slate-400" />
            <span>影城指南</span>
          </button>

          <button
            onClick={() => setVoiceAgentTask(missingTasks[0])}
            className="flex flex-col items-center text-slate-300 hover:text-white font-bold text-[10px] relative"
          >
            <PhoneCall className="w-4 h-4 mb-0.5 text-amber-300" />
            <span>幫我問</span>
            {pendingTasksCount > 0 && (
              <span className="absolute -top-0.5 right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className={`border-t border-white/[0.08] bg-cinema-950 py-8 px-4 text-center text-xs text-slate-500 ${hasSearched ? "mb-14 sm:mb-0" : "mb-0"}`}>
        <div className="max-w-4xl mx-auto space-y-1.5">
          <p className="font-bold text-slate-300">
            Movie Hall Finder · 桃園 / 林口跨區 V2.1
          </p>
          <p className="text-slate-400">
            不用自己查半天，我幫你挑今天最值得看的那一場。
          </p>
          <p className="text-[11px] text-slate-500">
            資料可以少，但不能假 · 影城交通資訊皆為官方核實認證
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <PreferenceDrawer
        isOpen={isPreferenceDrawerOpen}
        onClose={() => setIsPreferenceDrawerOpen(false)}
        preferences={preferences}
        onPreferencesChange={setPreferences}
      />

      <HallSpecModal
        hall={inspectingHall}
        theater={inspectingTheater}
        isOpen={Boolean(inspectingHallId)}
        onClose={() => setInspectingHallId(null)}
        onLaunchVoiceAgent={(hall) => {
          setInspectingHallId(null);
          const relatedTask = missingTasks.find((t) => t.hallId === hall.id) || missingTasks[0];
          setVoiceAgentTask(relatedTask);
        }}
      />

      <VoiceAgentModal
        task={voiceAgentTask}
        isOpen={Boolean(voiceAgentTask)}
        onClose={() => setVoiceAgentTask(null)}
        onTaskResolved={handleTaskResolved}
      />

      <TheaterGuideModal
        isOpen={isTheaterGuideOpen}
        onClose={() => setIsTheaterGuideOpen(false)}
      />

      <HallCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => {
          setIsCompareModalOpen(false);
          setSelectedCompareHallId(null);
        }}
        initialHallId={selectedCompareHallId || undefined}
      />
    </div>
  );
}

export default App;
