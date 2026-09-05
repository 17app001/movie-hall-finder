import {
  FilterPreferences,
  Hall,
  Movie,
  RecommendationResult,
  ScoreBreakdown,
  Showtime,
  Theater
} from "../types";

/**
 * 核心演算法：根據規格與使用者偏好計算 0~100 推薦分數與生成客製理由
 */
export function calculateRecommendation(
  showtime: Showtime,
  theater: Theater,
  hall: Hall | undefined,
  movie: Movie | undefined,
  preferences: FilterPreferences
): RecommendationResult {
  const warnings: string[] = [];
  const reasons: string[] = [];

  // 1. 影廳規模評分 (基準 30%)
  let hallSizeScore = 40;
  if (hall) {
    if (hall.seatCount !== undefined) {
      if (hall.seatCount >= 250 || hall.hallSizeLevel === "巨大廳") {
        hallSizeScore = 100;
        reasons.push(`🔥 巨幕大廳 (${hall.seatCount}席)：空間寬廣、視覺包覆感絕佳`);
      } else if (hall.seatCount >= 150 || hall.hallSizeLevel === "中大廳") {
        hallSizeScore = 75;
        reasons.push(`✨ 中大廳 (${hall.seatCount}席)：觀影視野適中無壓迫`);
      } else {
        hallSizeScore = 40;
      }
    } else {
      hallSizeScore = 30;
      warnings.push("此影廳座位數官方未載明，可能影響觀重視野");
    }
  } else {
    hallSizeScore = 30;
    warnings.push("缺少影廳硬體資料");
  }

  // 2. 特殊規格評分 (基準 20%)
  let specialFormatScore = 40;
  if (hall) {
    switch (hall.format) {
      case "IMAX":
        specialFormatScore = 100;
        reasons.push("⚡ 4K 雙雷射 IMAX 弧形巨幕：極致沉浸與高對比視覺");
        break;
      case "Dolby Atmos":
        specialFormatScore = 95;
        reasons.push("🔊 Dolby Atmos 杜比全景聲：天空聲道與音場精準定位");
        break;
      case "LUXE":
        specialFormatScore = 95;
        reasons.push("💎 LUXE 終極銀幕 + 震動體感座椅：重低音體感強烈");
        break;
      case "4DX":
        specialFormatScore = 92;
        reasons.push("🌪️ 4DX 全方位動態座椅與環境特效：身歷其境戰鬥感");
        break;
      case "Standard":
        specialFormatScore = 45;
        break;
      default:
        specialFormatScore = 30;
        warnings.push("特殊規格待確認");
    }
  }

  // 3. 時段符合度 (基準 15%)
  let timeSlotScore = 50;
  const showDate = new Date(showtime.startTime);
  const hour = showDate.getHours();

  const isToday = showtime.startTime.startsWith("2026-09-05");
  const isTomorrow = showtime.startTime.startsWith("2026-09-06");

  if (preferences.dateSlot === "today-afternoon") {
    if (isToday && hour >= 13 && hour < 18) {
      timeSlotScore = 100;
      reasons.push(`⏰ 完美契合今天下午時段 (${hour.toString().padStart(2, "0")}:${showDate.getMinutes().toString().padStart(2, "0")})`);
    } else if (isToday && hour >= 12 && hour <= 19) {
      timeSlotScore = 70;
    } else {
      timeSlotScore = 40;
    }
  } else if (preferences.dateSlot === "today-evening") {
    if (isToday && hour >= 18 && hour <= 23) {
      timeSlotScore = 100;
      reasons.push(`🌙 黃金晚間時段 (${hour.toString().padStart(2, "0")}:${showDate.getMinutes().toString().padStart(2, "0")})`);
    } else if (isToday && hour >= 17 && hour <= 23) {
      timeSlotScore = 70;
    } else {
      timeSlotScore = 40;
    }
  } else if (preferences.dateSlot === "tomorrow-afternoon") {
    if (isTomorrow && hour >= 13 && hour < 18) {
      timeSlotScore = 100;
      reasons.push(`🍿 完美契合明天下午場次 (${hour.toString().padStart(2, "0")}:${showDate.getMinutes().toString().padStart(2, "0")})`);
    } else if (isTomorrow) {
      timeSlotScore = 75;
    } else {
      timeSlotScore = 40;
    }
  } else if (preferences.dateSlot === "weekend") {
    if (isTomorrow || showtime.startTime.startsWith("2026-09-07")) {
      timeSlotScore = 100;
      reasons.push(`🎉 週末假日首選場次 (${hour.toString().padStart(2, "0")}:${showDate.getMinutes().toString().padStart(2, "0")})`);
    } else {
      timeSlotScore = 60;
    }
  } else {
    timeSlotScore = 80;
  }

  // 4. 價格優勢 (基準 15%)
  const effectivePrice = showtime.promoPrice ?? showtime.standardPrice ?? 320;
  let priceScore = 60;
  if (effectivePrice <= 260) {
    priceScore = 100;
    reasons.push(`💰 破盤超值價 $${effectivePrice} 元，CP值突破天際`);
  } else if (effectivePrice <= 300) {
    priceScore = 80;
    reasons.push(`🎟️ 實惠票價 $${effectivePrice} 元（符合高性價比）`);
  } else if (effectivePrice <= 350) {
    priceScore = 65;
  } else {
    // 特殊規格廳通常較貴，保留合理分數
    priceScore = 50;
  }

  // 5. 信用卡 / 優惠折抵 (基準 10%)
  let promoScore = 50;
  if (showtime.promoPrice && showtime.promoDescription) {
    promoScore = 100;
    const diff = (showtime.standardPrice ?? 350) - showtime.promoPrice;
    reasons.push(`🏷️ ${showtime.promoDescription}（現省 $${diff} 元）`);
  }

  // 6. 交通便利性 (基準 10%)
  let transitScore = 70;
  if (theater.district === "桃園區") {
    // 桃園站前商圈，火車站 2-3 分鐘內
    transitScore = 100;
    reasons.push(`🚶 ${theater.transitInfo || "近火車站商圈，交通步行即達"}`);
  } else if (theater.district === "林口區") {
    if (preferences.allowCrossRegion) {
      transitScore = 80; // 跨區可接受
      reasons.push("🚗 跨區旗艦升級：機捷/開車約 15 分鐘，換取頂規體驗");
    } else {
      transitScore = 40;
    }
  }

  // 權重動態調整（依使用者偏好 Toggle 自適應調整）
  let wHall = 0.30;
  let wFormat = 0.20;
  let wTime = 0.15;
  let wPrice = 0.15;
  let wPromo = 0.10;
  let wTransit = 0.10;

  if (preferences.preferLargeHall) {
    wHall = 0.40;
    wTransit = 0.05;
    wPrice = 0.10;
  }
  if (preferences.preferSpecialFormat) {
    wFormat = 0.35;
    wTransit = 0.05;
    wPrice = 0.10;
  }
  if (preferences.preferPromoPrice) {
    wPrice = 0.25;
    wPromo = 0.20;
    wFormat = 0.15;
    wHall = 0.20;
  }

  // 歸一化總權重
  const totalWeight = wHall + wFormat + wTime + wPrice + wPromo + wTransit;
  const rawScore =
    (hallSizeScore * wHall +
      specialFormatScore * wFormat +
      timeSlotScore * wTime +
      priceScore * wPrice +
      promoScore * wPromo +
      transitScore * wTransit) /
    totalWeight;

  const recommendScore = Math.round(Math.min(100, Math.max(0, rawScore)));

  // 可信度與警示評估 (Data Confidence)
  let confidence: "high" | "medium" | "low" = "high";

  if (showtime.dataStatus === "mock") {
    confidence = "medium";
    warnings.push("此場次為展示 Demo 資料，票價與時間請以影城現場為準");
  }

  if (hall?.dataStatus === "unverified" || showtime.dataStatus === "unverified") {
    confidence = "low";
    warnings.push("此影廳部分規格待官方再次確認");
  }

  if (!hall?.seatCount) {
    confidence = "low";
  }

  const breakdown: ScoreBreakdown = {
    hallSize: hallSizeScore,
    specialFormat: specialFormatScore,
    timeSlot: timeSlotScore,
    priceAdvantage: priceScore,
    promotions: promoScore,
    transitConvenience: transitScore
  };

  return {
    showtime,
    theater,
    hall,
    movie,
    recommendScore,
    recommendReasons: reasons.slice(0, 4), // 挑選前 4 大核心理由，俐落好讀
    confidence,
    warnings,
    breakdown
  };
}

/**
 * 批量篩選、評分與排序所有場次
 */
export function rankShowtimes(
  showtimes: Showtime[],
  theaters: Map<string, Theater>,
  halls: Map<string, Hall>,
  movies: Movie[],
  preferences: FilterPreferences
): RecommendationResult[] {
  const movieMap = new Map(movies.map((m) => [m.id, m]));

  // 1. 初步篩選 (Filter)
  const filtered = showtimes.filter((st) => {
    // 電影過濾
    if (preferences.movieId && st.movieId !== preferences.movieId) {
      return false;
    }

    const theater = theaters.get(st.theaterId);
    if (!theater) return false;

    // 跨區與地區過濾
    if (!preferences.allowCrossRegion) {
      if (theater.district === "林口區") return false;
    }

    if (preferences.region === "taoyuan" && theater.district !== "桃園區") {
      return false;
    }
    if (preferences.region === "linkou" && theater.district !== "林口區") {
      return false;
    }

    return true;
  });

  // 2. 評分計算 (Score)
  const results: RecommendationResult[] = filtered.map((st) => {
    const theater = theaters.get(st.theaterId)!;
    const hall = st.hallId ? halls.get(st.hallId) : undefined;
    const movie = movieMap.get(st.movieId);

    return calculateRecommendation(st, theater, hall, movie, preferences);
  });

  // 3. 排序 (Sort)
  results.sort((a, b) => {
    if (preferences.sortBy === "time") {
      return new Date(a.showtime.startTime).getTime() - new Date(b.showtime.startTime).getTime();
    }
    if (preferences.sortBy === "price") {
      const priceA = a.showtime.promoPrice ?? a.showtime.standardPrice ?? 999;
      const priceB = b.showtime.promoPrice ?? b.showtime.standardPrice ?? 999;
      return priceA - priceB;
    }
    // 預設依推薦分數排序
    if (b.recommendScore !== a.recommendScore) {
      return b.recommendScore - a.recommendScore;
    }
    // 同分時優先大廳與時間早者
    const seatA = a.hall?.seatCount ?? 0;
    const seatB = b.hall?.seatCount ?? 0;
    return seatB - seatA;
  });

  // 標記 Top Pick
  if (results.length > 0) {
    results[0].isTopPick = true;
  }

  return results;
}

