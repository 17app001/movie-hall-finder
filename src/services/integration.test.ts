import { describe, it, expect } from "vitest";
import { rankShowtimes } from "./scorer";
import { THEATER_MAP } from "../data/theaters";
import { MOCK_MOVIES, MOCK_SHOWTIMES, HALL_MAP } from "../data/mockData";
import { FilterPreferences, Hall } from "../types";

describe("Movie Hall Finder - End-to-End User Journeys", () => {
  it("情境 A：年輕影迷想看《沙丘：第三部》，跨區到林口看 IMAX 巨幕", () => {
    const prefs: FilterPreferences = {
      movieId: "movie-2", // 沙丘：第三部
      region: "all",
      dateSlot: "today-evening",
      preferLargeHall: true,
      preferSpecialFormat: true,
      preferPromoPrice: false,
      allowCrossRegion: true,
      sortBy: "score"
    };

    const results = rankShowtimes(MOCK_SHOWTIMES, THEATER_MAP, HALL_MAP, MOCK_MOVIES, prefs);
    expect(results.length).toBeGreaterThan(0);

    const top = results[0];
    expect(top.showtime.movieId).toBe("movie-2");
    expect(top.hall?.format).toBe("IMAX");
    expect(top.recommendReasons.some((r) => r.includes("IMAX") || r.includes("巨幕"))).toBe(true);
  });

  it("情境 B：預算導向學生挑選，票價最低優先", () => {
    const prefs: FilterPreferences = {
      movieId: "movie-1",
      region: "taoyuan",
      dateSlot: "today-afternoon",
      preferLargeHall: false,
      preferSpecialFormat: false,
      preferPromoPrice: true,
      allowCrossRegion: false,
      sortBy: "price"
    };

    const results = rankShowtimes(MOCK_SHOWTIMES, THEATER_MAP, HALL_MAP, MOCK_MOVIES, prefs);
    expect(results.length).toBeGreaterThan(1);

    // 驗證按價格由低至高嚴格排序
    for (let i = 0; i < results.length - 1; i++) {
      const priceA = results[i].showtime.promoPrice ?? results[i].showtime.standardPrice ?? 999;
      const priceB = results[i + 1].showtime.promoPrice ?? results[i + 1].showtime.standardPrice ?? 999;
      expect(priceA).toBeLessThanOrEqual(priceB);
    }
  });

  it("情境 C：AI Voice Agent 補查後資料動態反應測試", () => {
    // 模擬客服確認前：in89 3 廳為 unverified
    const originalHall = HALL_MAP.get("in89-hall-3")!;
    expect(originalHall.dataStatus).toBe("unverified");

    // 模擬 AI 客服外呼更新資料庫
    const updatedHalls = new Map(HALL_MAP);
    const resolvedHall: Hall = {
      ...originalHall,
      soundSystem: "JBL 7.1 環繞聲道 (AI 客服核實更新)",
      screenSpecs: "數位標準雷射銀幕 (已核實)",
      dataStatus: "verified",
      source: "影城官方客服電話 (03) 331-0656 核實",
      verifiedAt: "2026-09-05"
    };
    updatedHalls.set("in89-hall-3", resolvedHall);

    const prefs: FilterPreferences = {
      movieId: "movie-1",
      region: "taoyuan",
      dateSlot: "today-afternoon",
      preferLargeHall: false,
      preferSpecialFormat: false,
      preferPromoPrice: false,
      allowCrossRegion: false,
      sortBy: "score"
    };

    const results = rankShowtimes(MOCK_SHOWTIMES, THEATER_MAP, updatedHalls, MOCK_MOVIES, prefs);
    const in89Hall3Result = results.find((r) => r.hall?.id === "in89-hall-3");

    expect(in89Hall3Result).toBeDefined();
    expect(in89Hall3Result?.hall?.dataStatus).toBe("verified");
    expect(in89Hall3Result?.hall?.soundSystem).toContain("7.1");
  });
});

