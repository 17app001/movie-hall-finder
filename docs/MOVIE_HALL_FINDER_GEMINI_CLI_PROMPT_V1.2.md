# Movie Hall Finder — Gemini CLI 開工 Prompt v1.2 (UI/UX Review 升級版)

> **版本資訊**：v1.2 (2026-09-05)  
> **重大升級**：依據 `MOVIE_HALL_FINDER_UI_UX_REVIEW_V1.md` 審查意見全面升級 UI/UX 節奏、人話版推薦決策、影廳 VS 決鬥矩陣、生活化三步搜尋與出遊指南。  
> **核心原則**：**資料可以少，但不能假。Mock 清楚標示，不偽裝成真實情報。先讓使用者 10 秒內得到答案，再讓有興趣的人深入規格。**

---

## 產品定位與一句話 Slogan

> **「不用自己查半天，我幫你挑今天最值得看的那一場。」**  
> *副標：比大廳、音效、時間、價格和距離，一次幫你選好。*

本產品不是傳統時刻表查詢網站；本產品的價值是替使用者從大量場次中找出「最值得去看的那一場」，並以透明加權分數與白話推薦理由，解答「為什麼這場值得去」。

---

## 1. 專案範圍與約束 (Scope Constraints)

1. **地區範圍**：以「桃園區」為核心，具備「桃園 + 林口」跨區比較能力（驗證是否值得多開 20 分鐘車換取巨幕 Atmos 旗艦廳）。
2. **真實 vs Mock 原則（最高守則）**：
   - **影城與地理資訊必須真實可驗證**：官方影城名稱、精準地址、客服專線、Google Maps 導航連結與經緯度、停車與周邊商場資訊。
   - **影廳規格與場次票價**：欄位必須包含 `dataStatus: "mock" | "verified" | "unverified"`。
   - **Mock 資料醒目標示**：UI 清楚提示「Demo / Mock 資料」，不得宣稱為官方即時資料或真實第一名。
   - **資料不足原則**：若缺乏確切資料，顯示「⚠️ 待確認」或「目前無可靠資料」，嚴禁捏造數據。
3. **技術棧**：
   - 前端：Vite + React (TypeScript) + Tailwind CSS + Lucide React。
   - 架構：Single Page Application (SPA)，支援 Mobile-First 響應式佈局與 Cinema Dark Mode。
   - 狀態與演算法：純前端模組化 Service (`src/services/scorer.ts`)，預留未來串接後端 API、爬蟲與 Realtime 語音客服架構。

---

## 2. 資料模型定義 (Data Schema)

### 2.1 影城資料 (`src/data/theaters.ts`)

```ts
export interface Theater {
  id: string;
  name: string;
  region: "taoyuan" | "linkou";
  district: string;
  address: string;
  phone: string;
  googleMapsUrl: string;
  coordinates: { lat: number; lng: number };
  transitInfo?: string;
  parkingInfo?: string;        // 停車折抵資訊 (Review V1 新增)
  diningAndMall?: string;      // 商場與餐飲指南 (Review V1 新增)
  nearbyAttractions?: string;  // 順便逛什麼 (Review V1 新增)
  source: string;
  verifiedAt: string;
}
```

### 2.2 影廳與場次資料 (`src/data/mockData.ts`)

```ts
export type DataStatus = "mock" | "verified" | "unverified";

export interface Hall {
  id: string;
  theaterId: string;
  hallNo: string;
  seatCount?: number;
  format: "IMAX" | "Dolby Atmos" | "4DX" | "LUXE" | "Standard" | "Unknown";
  hallSizeLevel?: "巨大廳" | "中大廳" | "標準廳" | "未知";
  soundSystem?: string;
  screenSpecs?: string;
  screenType?: string;
  projector?: string;
  emperorSeats?: string;       // 👑 最佳觀影皇帝位導引 (Review V1 新增)
  sweetSpot?: string;
  dataStatus: DataStatus;
  source?: string;
  verifiedAt?: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  movieTitle: string;
  theaterId: string;
  hallId: string;
  startTime: string;
  standardPrice?: number;
  promoPrice?: number;
  promoDescription?: string;
  dataStatus: DataStatus;
  source?: string;
  fetchedAt?: string;
}
```

---

## 3. 推薦評分引擎 (Scoring Engine Specification)

評分邏輯封裝於 `src/services/scorer.ts`，滿分 100 分。

### 3.1 權重配置
- **影廳規模（Seat Count / Size Level）：30%** (巨大廳最高 30 分，中大廳 20 分，標準廳 10 分)
- **特殊規格（IMAX / Atmos / 4DX / LUXE）：20%** (IMAX/Atmos 滿額加分)
- **時段符合度（Time Alignment）：15%** (完全符合使用者選定時段給予滿分)
- **價格優勢與優惠（Price & Promos）：15%** (票價親民、特早場或刷卡優惠)
- **交通便利與距離（Proximity / Transit）：10%** (在地影城加分；若接受跨區則林口特規廳不扣分)
- **資料可信度修正（Confidence Discount）：10%** (未驗證或缺漏資訊扣除信心分)

### 3.2 評分輸出模型 (Review V1 強化)

> **拒絕黑箱計分**：必須提供各項加分膠囊（`additivePoints`）與一句白話人話結論（`humanSummary`）。

```ts
export interface AdditivePoint {
  category: string;
  label: string;
  points: number;
  color: string;
}

export interface RecommendationResult {
  recommendScore: number;
  recommendReasons: string[];
  confidence: "high" | "medium" | "low";
  warnings: string[];
  additivePoints: AdditivePoint[]; // 例如：[+40 大廳, +19 特規, +15 距離, +10 價格]
  humanSummary: string;            // 例如：「林口 10 廳時間剛好，大廳音效佳，票價僅多 20 元。」
}
```

---

## 4. 前端 UI / UX 核心體驗規格 (Review V1 落地實作)

### 4.1 生活化三步搜尋 (Conversational 3-Step Search)
- 第一眼絕不擺放複雜後台表格，僅呈現生活化三要素：
  1. **「我想看」**：下拉選擇當期熱門強檔（例如：《奧本海默：終極導讀版》、《沙丘：第二部》...）。
  2. **「我在」**：快速切換所在區域（桃園車站 / 藝文特區 / 林口長庚）。
  3. **「我想」**：直覺時段選單（今天下午 12:00-18:00 / 今晚黃金場 18:00-22:00 / 隨時都行）。
- **主要動作按鈕**：**「幫我挑一場」**（高辨識度琥珀橘漸層按鈕，取代冷冰冰的「搜尋」）。
- **偏好加權按鈕**：提供「偏好加權」按鈕，點擊彈出 Slide-over Drawer / Bottom Sheet，設定：
  - 🎬 大廳巨幕優先
  - 🔊 Dolby Atmos / IMAX 特規優先
  - 💳 信用卡優惠優先
  - 🚗 接受跨區林口（車程 20-30 分）

### 4.2 Top Pick 巨星英雄卡 (Hero Focus Card)
- 置於搜尋結果第一位，視覺面積最大、層級最高。
- **英雄標題**：`93 分｜今天最值得看`。
- **人話推薦語錄**：以引言氣泡顯示白話結論（如：*「大廳、時間剛好，而且票價只多 20 元，視聽效果完全碾壓！」*）。
- **加分膠囊拆解**：直接列出 `+40 巨大廳 (280席)`、`+19 Dolby Atmos`、`+15 距離適中`、`+10 早場優惠`。
- **雙核心行動按鈕 (CTAs)**：
  - `看座位 / 購票`（附帶 👑 最佳帝王座位排號提示）。
  - `為什麼推薦？`（展開深度推薦理由與減分警示）。

### 4.3 階梯式場次推薦清單 (Showtime Ranking Hierarchy)
- 依推薦分數排序其餘場次，清楚賦予階級名份：
  - 🥈 **第二選擇**：備選方案（如在地老牌省時選擇）。
  - 🥉 **第三選擇**：平價或特早場方案。
- 每張卡片直接回答一句：**「為什麼值得去？」**
- 卡片內建 **「與第 1 名 PK」** 按鈕，一鍵直通比對彈窗。

### 4.4 視覺化影廳 VS 決鬥矩陣 (Hall Compare Battle Matrix)
- 左右雙欄卡片佈局，中央醒目 `VS` 徽章。
- 一眼看勝負：座位數、音效規格、投影銀幕、預估車程、標準票價各欄位自動標記 🏆 勝者標籤。
- **底部白話決策結論**：不讓使用者自己費力看表格，系統直接下結論（例如：*「如果你今天想要大銀幕聲光包覆感 → 強烈推薦選 林口三井威秀 10 廳。」*）。

### 4.5 人話版影廳規格檢視 (Humanized Hall Spec Modal)
- 頂部第一眼呈現人話版定位：**「這是一個超大型旗艦廳，適合大場面動作片與視效大片。」**
- **👑 最佳觀影皇帝位導引**：明確指出最佳行排數與視野角度（如：`H 排 11-16 號 (視線水平置中)`）。
- 完整硬體規格清單（銀幕寬度、放映機、音響聲道、座位數）。
- **可信度提示**：若未驗證，醒目提醒「⚠️ 資料不足，絕不造假」，並提供「幫我確認」按鈕。

### 4.6 幫我問影城 / 規格確認助手 (Rebranded Voice Agent Helper)
- 揚棄生硬名詞「AI Voice Agent」，改名為 **「幫我確認影城規格」/「幫我問影城」**。
- 使用者流程：
  - 當點擊「缺資料待確認」或「幫我確認」時觸發。
  - 模擬 AI 客服自動致電影城售票處或檢索公開授權檔案庫。
  - 即時動畫顯示波形與對話模擬紀錄。
  - 成功擷取後立即同步回補影廳資料庫，並標示來源與時間戳。

### 4.7 看電影前出遊指南 (Pre-movie Outing Guide)
- 點擊影城資訊時觸發，定位為「去看電影之前需要知道的事」：
  - 🚗 **交通與車程**（距離公里數、車程預估、即時 Google Maps 導航連結）。
  - 🅿️ **停車折抵資訊**（憑票根折抵時數、地下停車場位置）。
  - 🚇 **捷運 / 火車站步行指引**。
  - 🍿 **商場與看完可以吃什麼**（美食街熱門餐飲推薦）。
  - 🛍️ **順便逛什麼**（OUTLET 購物、百貨專櫃、周邊景點）。

---

## 5. 驗收標準 (Acceptance Criteria)

1. **視覺風格**：符合年輕族群喜好的 Cinema Dark Mode，使用 Slate-900 / Amber-500 / Emerald-500 色彩體系，無生硬後台感。
2. **決策速度**：首頁 10 秒內能讓使用者完成「挑一部電影 → 按下挑一場 → 看見 Top Pick 與人話結論」。
3. **資料誠實性**：所有 Mock 資料均有 `Demo 資料` 徽章，缺失欄位標示「待確認」，絕不造假。
4. **功能閉環**：
   - 篩選切換時評分與排名即時連動。
   - 點擊「與第 1 名 PK」正確喚起左右對決視窗。
   - 點擊影廳規格與影城出遊指南均能正常開關 Modal。
   - 語音確認模擬流程運作流暢無阻塞。
5. **程式碼品質**：
   - TypeScript 編譯零錯誤（`npm run build` 通過）。
   - 單元測試全面覆蓋（`npm test` 7/7 通過）。
   - 支援行動裝置直式瀏覽（響應式斷點完善）。

---

## 6. Slogan 與產品精神總結

> **「不要做成傳統電影時刻表。Movie Hall Finder 的核心是：在可信資料範圍內，替使用者找出今天最值得看的那一場，並清楚說明原因。資料可以少，但不能假。」**
