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
import { Film } from "lucide-react";

export function App() {
  // State: Halls and Showtimes (allows dynamic verification updates via Voice Agent)
  const [halls, setHalls] = useState<Hall[]>(MOCK_HALLS);
  const [showtimes] = useState<Showtime[]>(MOCK_SHOWTIMES);
  const [missingTasks, setMissingTasks] = useState<MissingInfoTask[]>(INITIAL_MISSING_TASKS);

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
  const [voiceAgentTask, setVoiceAgentTask] = useState<MissingInfoTask | null>(null);

  // Deep linking for automated visual screenshots and QA
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const view = params.get("view");
      if (view === "compare") setIsCompareModalOpen(true);
      if (view === "spec") setInspectingHallId("tonlin-hall-1");
      if (view === "voice") setVoiceAgentTask(missingTasks[0]);
      if (view === "guide") setIsTheaterGuideOpen(true);
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
                soundSystem: "JBL 7.1 環繞聲道 (AI 客服核實更新)",
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

  return (
    <div className="min-h-screen bg-cinema-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Sticky Header */}
      <Header
        onOpenTheaterGuide={() => setIsTheaterGuideOpen(true)}
        onOpenVoiceAgent={() => setVoiceAgentTask(missingTasks[0])}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Dynamic Filter / Search Bar */}
        <FilterBar
          movies={MOCK_MOVIES}
          preferences={preferences}
          onPreferencesChange={setPreferences}
          resultCount={rankedResults.length}
        />

        {/* Top Pick "The Crown Jewel" Recommendation Card */}
        {topPick ? (
          <TopPickCard
            recommendation={topPick}
            onInspectHall={(hallId) => setInspectingHallId(hallId)}
            onOpenTheaterGuide={() => setIsTheaterGuideOpen(true)}
            onOpenCompareModal={() => setIsCompareModalOpen(true)}
          />
        ) : (
          <div className="glass-panel rounded-3xl p-10 text-center text-slate-400 mb-8 border border-white/10">
            <Film className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white">找不到符合當前篩選條件的場次</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
              建議切換時段或開啟「允許跨區移動（桃園 ↔ 林口）」來探索更多高規格影廳！
            </p>
          </div>
        )}

        {/* Showtime Candidates List */}
        <ShowtimeList
          candidates={candidateList}
          onInspectHall={(hallId) => setInspectingHallId(hallId)}
        />

        {/* Missing Info / Voice Agent Query Panel */}
        <MissingInfoPanel
          tasks={missingTasks}
          onStartVoiceCall={(task) => setVoiceAgentTask(task)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-cinema-950 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-semibold text-slate-400">
            Movie Hall Finder (最佳影廳挑選器) · 桃園 / 林口跨區 Web POC v1.1
          </p>
          <p>
            核心理念：資料可以少，但不能假。Mock 資料僅用於演算法與 UI 展示，絕不偽裝成真實情報。
          </p>
          <p className="text-slate-600">
            © 2026 Movie Hall Finder. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Modals */}
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
        onClose={() => setIsCompareModalOpen(false)}
      />
    </div>
  );
}

export default App;

