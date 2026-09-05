# Movie Hall Finder — Gemini CLI 開工 Prompt v1.1 (已同步 UI/UX Review V1 修正)

> **同步備註**：本文件已依據 2026-09-05 `MOVIE_HALL_FINDER_UI_UX_REVIEW_V1.md` 審查意見全面同步修訂，最新版本為 `MOVIE_HALL_FINDER_GEMINI_CLI_PROMPT_V1.2.md`。

## Role & Mission
你是一位資深全端工程師。你的任務是自主建立一個名為「Movie Hall Finder（最佳影廳挑選器）」的 Web POC。

核心精神：**不要做成傳統時刻表網站；本產品的價值是替使用者從大量場次中找出「最值得去看的那一場」，並清楚說明推薦理由。**

> **產品一句話**：不用自己查半天，我幫你挑今天最值得看的那一場。  
> **副標**：比大廳、音效、時間、價格和距離，一次幫你選好。

> 產品最高原則：**資料可以少，但不能假。Mock 可以用於 UI / 演算法開發，但任何 Mock 資料都必須在介面與程式資料層清楚標示，不得偽裝成真實影城情報。**

---

## 1. 專案範圍與約束 (Scope Constraints)

1. **Phase 0 / UI Demo 地區**：先鎖定「桃園區」，首波可納入桃園火車站周邊影城作為介面與推薦流程展示。
2. **正式 V1 POC 範圍**：必須保留「桃園 + 林口」跨區比較能力，因為本產品的重要價值之一，就是讓使用者判斷是否值得多移動一些距離，換取更大的影廳、更好的特殊規格或更佳優惠。
3. **真實 vs Mock 原則**：
   - **影城與地理資訊必須真實且可驗證**：影城名稱、地址、官方客服電話、Google Maps 導航連結與經緯度，必須使用可靠來源。
   - **影廳、場次、票價若暫時無法取得真實資料，可使用 Mock 做開發測試**，但：
     - 欄位必須包含 `dataStatus: "mock" | "verified" | "unverified"` 或等價設計。
     - UI 上必須清楚標示「Demo / Mock 資料」或「待確認」。
     - 不得將 Mock 資料顯示為「官方已確認」。
     - 不得因 Mock 資料而宣稱某影城或某廳為真實第一名。
4. **來源追蹤**：真實資料應保留 `source`、`fetchedAt / verifiedAt` 與可信狀態。
5. **技術棧規範 (Tech Stack)**：
   - 前端：Vite + React (TypeScript) + Tailwind CSS + Lucide React。
   - 架構：單一 SPA，包含搜尋篩選列、推薦場次卡片（Top Pick）、完整清單、影廳規格比對彈窗與影城導航面板。支援行動裝置優先（Mobile-First）。
   - 資料層：先採前端 Data Store；計算與篩選邏輯封裝於獨立 service，方便未來替換成後端 API、爬蟲、人工驗證與 Voice / Realtime 客服補問服務。

---

## 2. 真實影城資料定義 (Verified Theater Seed Data)

請建立 `src/data/theaters.ts`。

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
  diningAndMall?: string;      // 商場與看完吃什麼 (Review V1 新增)
  nearbyAttractions?: string;  // 順便逛什麼 (Review V1 新增)
  source: string;
  verifiedAt: string;
}
```

### 規則
- 不要憑空產生地址、電話、座標或交通資訊。
- 若無法確認，該欄位保留空值或標記待確認，不得猜測。
- Phase 0 可先放 2 家桃園區影城；正式 V1 再擴充林口影城。

---

## 3. Hall / Showtime Seed Data

請在 `src/data/mockData.ts` 準備可用於 UI 與演算法的資料模型。

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

### Mock 規則
- Mock 只用於開發與展示推薦流程。
- 每筆 Mock 必須 `dataStatus: "mock"`。
- UI 必須看得出來它不是即時真實情報。
- 若真實欄位未知，寧可顯示「待確認」或「目前無可靠資料」，不要填虛構數字。

---

## 4. 核心演算法：推薦評分引擎 (Scoring Engine)

建立 `src/services/scorer.ts`，實作 0~100 分推薦模型。V1 權重配置：

- **影廳規模：30%**
- **特殊規格（Atmos / IMAX / 4DX / LUXE 等）：20%**
- **時段符合度：15%**
- **價格優勢：15%**
- **信用卡 / 優惠：10%**
- **交通便利性：10%**

輸出資料結構（Review V1 強化：拒絕黑箱，輸出拆解加分項與人話總結）：

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
  additivePoints: AdditivePoint[]; // 加分膠囊拆解，如：[+40 巨大廳, +19 Atmos, +15 距離]
  humanSummary: string;            // 白話人話結論
}
```

### 評分原則
- 已驗證資料可以完整計分。
- 未驗證資料可以參與排序，但必須降低 confidence。
- Mock 資料只能用於 Demo 排序，不得對外宣稱為真實最佳場次。
- 缺資料時，不得以任意預設值偷偷補齊；應顯示「資訊不足」並降低信心。
- 推薦理由要能讓使用者理解「為什麼這場更值得」。

---

## 5. 前端 UI / UX 體驗要求 (依據 Review V1 全面升級)

### 5.1 生活化三步搜尋 (Conversational Search Bar)
- 第一眼不擺放繁複表單，改為 3 個生活化問題：
  - 我想看：選擇電影
  - 我在：選擇區域（桃園、林口）
  - 我想：選擇時段（今天下午、今晚黃金場、隨時）
- 大按鈕 CTA：**「幫我挑一場」**（高辨識度琥珀橘按鈕）。
- 偏好條件（大廳巨幕、Atmos/IMAX 特規、優惠票價、跨區接受度）收納進 **「偏好加權」** Drawer / Bottom Sheet。

### 5.2 Top Pick 巨星推薦英雄卡 (Hero Focus)
頁面最上方以大面積突出「目前最值得看的第一名」，顯示：
- 推薦分數與英雄標題：`93 分｜今天最值得看`
- 白話人話結論：引言式推薦理由（如：*「大廳、時間剛好，而且票價只多 20 元。」*）
- 加分膠囊拆解標籤（如 `+40 大廳 (280席)`、`+19 Dolby Atmos`）
- 雙主要行動按鈕：`看座位 / 購票`（附帶 👑 最佳觀影帝王位指引）與 `為什麼推薦？`
- 資料來源與 Mock 警示標章

### 5.3 階梯式場次清單 (Showtime Ranking)
- 依推薦分數排序其餘場次：
  - 🥈 **第二選擇**：備選優質方案
  - 🥉 **第三選擇**：平價或特早場方案
- 每張卡片直接回答一句：**「為什麼值得去？」**
- 卡片內建 **「與第 1 名 PK」** 按鈕，點擊立刻直通對決比對窗。

### 5.4 影廳 PK 視覺化決鬥矩陣 (Hall Compare Visual VS Battle)
- 左右雙大卡佈局，中間放置醒目的 `VS` 徽章。
- 各項規格直接標記 🏆 勝負標籤（座位數、音效規格、投影銀幕、預估車程、標準票價）。
- 底部直接提供人話結論（例如：*「如果你今天想要大銀幕感 → 強烈推薦選 林口三井威秀 10 廳。」*），讓使用者一眼看出勝負。

### 5.5 人話版影廳規格檢視 (Humanized Hall Spec Modal)
- 點擊廳號查看規格時，頂部第一行先提供人話定位（如：*「這是一個超大型旗艦廳，適合大場面動作片。」*）。
- 標註 👑 **帝王皇帝位導引**（最佳觀影排號與視角）。
- 規格標記：`已驗證`、`待確認`、`資料不足`，嚴禁虛構。
- 提供「幫我確認影城規格」直接入口。

### 5.6 幫我問影城 / 規格確認助手 (Rebranded Voice Agent)
- 名稱從生硬的「AI Voice Agent」改為 **「幫我確認影城規格」/「幫我問影城」**。
- 當影廳資訊待確認或資料不足時，使用者點擊「幫我確認」，由系統啟動電話語音模擬詢問或檔案查詢，自動將規格補充入庫。

### 5.7 看電影前出遊指南 (Pre-movie Outing Guide)
- 點擊影城資訊時觸發，定位為「去看電影前需要知道的事」：
  - 距離、車程與 Google Maps 一鍵導航。
  - 🅿️ **停車折抵資訊**（憑票根折抵時數）。
  - 🚇 **大眾運輸與捷運 / 火車站步行路線**。
  - 🍿 **商場與看完可以吃什麼**（美食推薦）。
  - 🛍️ **順便逛什麼**（購物與商圈特色）。

---

## 6. 自主執行與驗收步驟 (Autonomous Action Steps)

1. 建立 Vite + React + TypeScript 專案，設定 Tailwind 與 Lucide React。
2. 建立 Theater / Hall / Showtime / Promotion / MissingInfoTask 等資料模型。
3. 將真實影城資料與 Mock / 未驗證資料嚴格分流。
4. 實作評分引擎、加分膠囊拆解與人話總結。
5. 完成 Cinema Dark Mode 響應式介面，支援手機優先與直覺卡片排版。
6. 建立至少一組 Demo 測試情境（今天下午、桃園區、指定電影、優先大廳）。
7. **驗收重點不是指定某間影城必須第一名**，而是評分計算邏輯正確且隨條件動態更新。
8. 若真實資料不足，介面必須清楚顯示「目前無可靠資料」或「待確認」，不得自行推測。
9. `npm run build` 與 `npm test` 必須全數通過。

---

## 7. V1 POC 邊界

### 這版要做
- 指定電影搜尋與三步生活化問答
- 桃園 / 林口跨區比較
- 時段篩選與偏好加權抽屜
- 推薦分數、加分拆解與人話理由
- 視覺化影廳 VS PK 矩陣
- 人話版影廳規格與帝王位提示
- 影城出遊指南（停車折抵、交通、商場美食）
- 幫我問影城 / 規格確認模擬工作流
- Mock / Verified 明確分流標示

### 這版先不做
- 全台完整影城
- 完整會員系統
- 真實第三方自動刷卡購票
- 正式打電話到影城電信線路
- 大型 LLM 線上即時推理

---

## 8. 給開發 AI 的最後一句話

> **「不要做成傳統電影時刻表。Movie Hall Finder 的核心是：在可信資料範圍內，替使用者找出『今天最值得看的那一場』，並說明原因。資料可以少，但不能假。」**
