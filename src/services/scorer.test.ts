import { describe, it, expect } from "vitest";
import { rankShowtimes, calculateRecommendation } from "./scorer";
import { THEATER_MAP } from "../data/theaters";
import { MOCK_MOVIES, MOCK_SHOWTIMES, HALL_MAP } from "../data/mockData";
import { FilterPreferences } from "../types";

describe("Movie Hall Finder - Scoring Engine (v1.1 Specs)", () => {
  it("情境測試 1：今天下午 + 桃園區 + 《希望：末日血戰》 + 優先大廳，應推薦桃園雙雄旗艦大廳 (統領 1 廳或 in89 1 廳)", () => {
    const preferences: FilterPreferences = {
      movieId: "movie-1",
      region: "taoyuan",
      dateSlot: "today-afternoon",
      preferLargeHall: true,
      preferSpecialFormat: false,
      preferPromoPrice: false,
      allowCrossRegion: false,
      sortBy: "score"
    };

    const results = rankShowtimes(
      MOCK_SHOWTIMES,
      THEATER_MAP,
      HALL_MAP,
      MOCK_MOVIES,
      preferences
    );

    expect(results.length).toBeGreaterThan(0);
    const topPick = results[0];

    // 驗證 Top Pick 必須是旗艦大廳 (統領威秀 1 廳 288 席 或 in89 1 廳 236 席)
    expect(["tonlin-hall-1", "in89-hall-1"]).toContain(topPick.hall?.id);
    expect(topPick.isTopPick).toBe(true);
    expect(topPick.recommendScore).toBeGreaterThanOrEqual(85);

    // 驗證推薦理由清晰且具體
    expect(topPick.recommendReasons.length).toBeGreaterThanOrEqual(2);
    expect(
      topPick.recommendReasons.some((r) => r.includes("巨幕") || r.includes("大廳") || r.includes("席"))
    ).toBe(true);

    // 驗證 Mock 資料在警告與可信度中正確標註
    expect(topPick.warnings.some((w) => w.includes("Demo") || w.includes("即時"))).toBe(true);
  });

  it("情境測試 2：當使用者切換為『小資優惠票價優先』，具備促銷低價與折扣者排名應顯著上升", () => {
    const preferencesPriceFocused: FilterPreferences = {
      movieId: "movie-1",
      region: "taoyuan",
      dateSlot: "today-afternoon",
      preferLargeHall: false,
      preferSpecialFormat: false,
      preferPromoPrice: true,
      allowCrossRegion: false,
      sortBy: "score"
    };

    const results = rankShowtimes(
      MOCK_SHOWTIMES,
      THEATER_MAP,
      HALL_MAP,
      MOCK_MOVIES,
      preferencesPriceFocused
    );

    expect(results.length).toBeGreaterThan(0);
    // 所有回傳場次的價格優勢評分與理由應被凸顯
    expect(results[0].breakdown.priceAdvantage).toBeGreaterThanOrEqual(80);
    expect(results[0].recommendReasons.some((r) => r.includes("省") || r.includes("價") || r.includes("元"))).toBe(true);
  });

  it("情境測試 3：跨區移動測試 (桃園 ↔ 林口)，啟用時林口 340 席 IMAX 巨幕應納入比較並獲高分", () => {
    const preferencesCrossRegion: FilterPreferences = {
      movieId: "movie-1",
      region: "all",
      dateSlot: "today-afternoon",
      preferLargeHall: true,
      preferSpecialFormat: true,
      preferPromoPrice: false,
      allowCrossRegion: true,
      sortBy: "score"
    };

    const results = rankShowtimes(
      MOCK_SHOWTIMES,
      THEATER_MAP,
      HALL_MAP,
      MOCK_MOVIES,
      preferencesCrossRegion
    );

    // 必須包含林口三井威秀
    const linkouImax = results.find((r) => r.hall?.id === "linkou-imax");
    expect(linkouImax).toBeDefined();
    expect(linkouImax!.recommendScore).toBeGreaterThanOrEqual(85);
    expect(linkouImax!.hall?.format).toBe("IMAX");
  });

  it("情境測試 4：未驗證資料 (in89 3 廳) 必須標註 low confidence 與相應警告", () => {
    const unverifiedShowtime = MOCK_SHOWTIMES.find((s) => s.hallId === "in89-hall-3")!;
    const theater = THEATER_MAP.get(unverifiedShowtime.theaterId)!;
    const hall = HALL_MAP.get(unverifiedShowtime.hallId!)!;

    const result = calculateRecommendation(unverifiedShowtime, theater, hall, MOCK_MOVIES[0], {
      movieId: "movie-1",
      region: "taoyuan",
      dateSlot: "today-afternoon",
      preferLargeHall: false,
      preferSpecialFormat: false,
      preferPromoPrice: false,
      allowCrossRegion: false,
      sortBy: "score"
    });

    // 驗證未驗證場次不可標為高可信度
    expect(result.confidence).toBe("low");
    expect(result.warnings.some((w) => w.includes("待") || w.includes("確認"))).toBe(true);
  });
});

