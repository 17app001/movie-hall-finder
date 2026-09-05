# Movie Hall Finder — Gemini CLI 開工 Prompt v1.1

## Role & Mission
你是一位資深全端工程師。你的任務是自主建立一個名為「Movie Hall Finder（最佳影廳挑選器）」的 Web POC。

核心精神：**不要做成傳統時刻表網站；本產品的價值是替使用者從大量場次中找出「最值得去看的那一場」，並清楚說明推薦理由。**

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
   - 架構：單一 SPA，包含搜尋篩選列、推薦場次卡片（Top Pick）、完整清單、影廳規格比對彈窗與影城導航面板。
   - 資料層：先採前端 Data Store；計算與篩選邏輯封裝於獨立 service，方便未來替換成後端 API、爬蟲、人工驗證與 Voice / Realtime 客服補問服務。

---

## 2. 真實影城資料定義 (Verified Theater Seed Data)

請建立 `src/data/theaters.ts`。

```ts
export interface Theater {
  id: string;
  name: string;
  region: string;
  district: string;
  address: string;
  phone: string;
  googleMapsUrl: string;
  coordinates: { lat: number; lng: number };
  transitInfo?: string;
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
  dataStatus: DataStatus;
  source?: string;
  verifiedAt?: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  movieTitle: string;
  theaterId: string;
  hallId?: string;
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

建立 `src/services/scorer.ts`，實作 0~100 分推薦模型。V1 權重先採：

- **影廳規模：30%**
- **特殊規格（Atmos / IMAX / 4DX / LUXE 等）：20%**
- **時段符合度：15%**
- **價格優勢：15%**
- **信用卡 / 優惠：10%**
- **交通便利性：10%**

輸出：

```ts
interface RecommendationResult {
  recommendScore: number;
  recommendReasons: string[];
  confidence: "high" | "medium" | "low";
  warnings: string[];
}
```

### 評分原則
- 已驗證資料可以完整計分。
- 未驗證資料可以參與排序，但必須降低 confidence。
- Mock 資料只能用於 Demo 排序，不得對外宣稱為真實最佳場次。
- 缺資料時，不得以任意預設值偷偷補齊；應顯示「資訊不足」並降低信心。
- 推薦理由要能讓使用者理解「為什麼這場更值得」。

---

## 5. 前端 UI / UX 體驗要求

### 5.1 搜尋 / 篩選 Bar
- 電影
- 地區
- 日期 / 時段
- 優先大廳
- 優先 Atmos / IMAX / 4DX
- 優先優惠票價
- 是否接受跨區移動

### 5.2 Top Pick 推薦卡
頁面最上方突出「目前最值得看的場次」，顯示：
- 推薦分數
- 資料可信度
- 影城
- 時間
- 廳號
- 座位規模（有可靠資料才顯示）
- 特殊規格
- 價格 / 優惠
- 推薦理由
- 資料來源
- 最後更新時間

若資料為 Mock，卡片必須醒目顯示：**「Demo 資料，不代表影城即時場次」**。

### 5.3 場次候選清單
依推薦分數排序其他候選場次，並標示：
- `已驗證`
- `待確認`
- `Demo / Mock`

### 5.4 Hall Spec Inspector
點擊廳號可查看影廳規格與來源。若未確認，顯示：

> 此影廳資訊尚未完全驗證，可透過官方資料或客服再次確認。

### 5.5 Missing Info / 客服補問入口
若系統缺少「某廳座位數、影廳規格、某日播放場次」等關鍵資料，顯示待補問狀態，為未來人工或 Voice Agent 補資料預留入口。

---

## 6. 自主執行與驗收步驟 (Autonomous Action Steps)

1. 建立 Vite + React + TypeScript 專案，設定 Tailwind 與需要的 UI 套件。
2. 建立 Theater / Hall / Showtime / Promotion / MissingInfoTask 等資料模型。
3. 將真實影城資料與 Mock / 未驗證資料嚴格分流。
4. 實作評分引擎與推薦理由。
5. 完成 Cinema Dark Mode 響應式介面。
6. 建立至少一組 Demo 測試情境，例如：
   - 今天下午
   - 桃園區
   - 指定一部電影
   - 優先大廳
7. **驗收重點不是指定某間影城必須第一名。** 系統應依目前輸入資料與權重計算結果；若資料改變，Top Pick 也必須跟著改變。
8. 若真實資料不足，介面必須清楚顯示「目前無可靠資料」或「待確認」，不得自行推測。
9. `npm run build` 必須通過；重要推薦邏輯至少提供自測或單元測試。

---

## 7. V1 POC 邊界

### 這版要做
- 指定電影搜尋
- 桃園 / 林口區域概念
- 時段篩選
- 大廳與特殊規格偏好
- 推薦分數與理由
- 資料來源 / 可信狀態
- Mock / Verified 明確分流
- Missing Info 任務概念

### 這版先不做
- 全台完整影城
- 完整會員系統
- 自動購票
- 正式 Voice Agent 自動打客服電話
- 大型 AI 推薦模型

但資料模型與 UI 架構應預留未來 **OpenAI Realtime / Voice API + 電話服務 + LLM 結構化擷取** 的擴充能力。

---

## 8. 給開發 AI 的最後一句話

> **不要做成傳統電影時刻表。Movie Hall Finder 的核心是：在可信資料範圍內，替使用者找出「最值得看的那一場」，並說明原因。資料可以少，但不能假。**

