import { MissingInfoTask } from "../types";

export const INITIAL_MISSING_TASKS: MissingInfoTask[] = [
  {
    id: "task-in89-hall-3",
    theaterId: "in89-taoyuan",
    theaterName: "桃園站前 in89 豪華影城",
    hallId: "in89-hall-3",
    hallNo: "3 廳",
    fieldNeeded: "screenSpecs",
    fieldLabel: "銀幕規格與音響聲道認證",
    currentValue: "待確認 (社群回報 5.1 聲道)",
    status: "pending_query",
    suggestedPhone: "(03) 331-0656",
    notes: "官方官網未詳列 3 廳近期是否升級 7.1 聲道，待客服電話或 Voice Agent 詢問確認。"
  },
  {
    id: "task-tonlin-hall-7",
    theaterId: "vscinemas-taoyuan-tonlin",
    theaterName: "桃園統領威秀影城",
    hallNo: "7 廳 (預留擴充)",
    fieldNeeded: "seatCount",
    fieldLabel: "座位排距與輪椅席席位",
    currentValue: "待建立完整規格",
    status: "pending_query",
    suggestedPhone: "(03) 333-3232",
    notes: "預備下一波納入次熱門影廳資料庫，目前列入待補查詢單。"
  }
];

export interface VoiceCallStep {
  sender: "ai" | "theater";
  text: string;
  delayMs: number;
}

export const SIMULATED_CALL_SCRIPTS: Record<string, VoiceCallStep[]> = {
  "task-in89-hall-3": [
    { sender: "ai", text: "📞 系統已接通【桃園站前 in89 豪華影城】客服電話 (03) 331-0656...", delayMs: 800 },
    { sender: "theater", text: "您好，這裡是桃園站前 in89 豪華影城，很高興為您服務！", delayMs: 1400 },
    { sender: "ai", text: "您好！我是 Movie Hall Finder 的影城情報小幫手，想向貴影城確認 3 廳目前的座位數與音效配備規格，方便提供給影迷最準確的選位參考嗎？", delayMs: 1800 },
    { sender: "theater", text: "好的！我們 3 廳共有 88 個座位（含 2 席無障礙愛心席），音響在上個月已全面升級為 JBL 7.1 環繞聲道囉！", delayMs: 2000 },
    { sender: "ai", text: "太感謝了！資料已為您結構化記錄，並註記官方客服電話已確認，祝您生意興隆！", delayMs: 1200 }
  ]
};

