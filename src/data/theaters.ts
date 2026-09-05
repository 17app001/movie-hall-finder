import { Theater } from "../types";

export const VERIFIED_THEATERS: Theater[] = [
  {
    id: "vscinemas-taoyuan-tonlin",
    name: "桃園統領威秀影城",
    region: "桃園市",
    district: "桃園區",
    address: "桃園市桃園區中正路61號9-12樓 (統領廣場 TONLIN PLAZA)",
    phone: "(03) 333-3232",
    googleMapsUrl: "https://maps.google.com/?q=桃園統領威秀影城",
    coordinates: { lat: 24.9912, lng: 121.3129 },
    transitInfo: "桃園火車站前站步行約 3 分鐘",
    source: "威秀影城官方網站 (vscinemas.com.tw)",
    verifiedAt: "2026-09-05",
    features: ["Dolby Atmos 旗艦全景聲", "雷射放映", "統領廣場美食街商圈", "地下停車場直達"],
    officialWebsite: "https://www.vscinemas.com.tw",
    parkingInfo: "統領廣場地下停車場（憑當日電影票根折抵消費）"
  },
  {
    id: "in89-taoyuan",
    name: "桃園站前 in89 豪華影城",
    region: "桃園市",
    district: "桃園區",
    address: "桃園市桃園區中正路56號",
    phone: "(03) 331-0656",
    googleMapsUrl: "https://maps.google.com/?q=桃園站前in89豪華影城",
    coordinates: { lat: 24.9908, lng: 121.3135 },
    transitInfo: "桃園火車站前站正對面，步行約 2 分鐘",
    source: "in89 豪華影城官方 (in89cinemas.com.tw)",
    verifiedAt: "2026-09-05",
    features: ["LUXE 終極巨幕", "杜比全景聲震動座椅", "頭等艙 Coach 沙發席", "火車站正對面"],
    officialWebsite: "https://www.in89cinemas.com.tw",
    parkingInfo: "周邊文昌公園地下停車場 / 站前收費停車場"
  },
  {
    id: "vscinemas-linkou-mitsui",
    name: "林口 MITSUI OUTLET PARK 威秀影城",
    region: "新北市",
    district: "林口區",
    address: "新北市林口區文化三路一段356號3樓 (MITSUI OUTLET PARK 林口)",
    phone: "(02) 2606-8099",
    googleMapsUrl: "https://maps.google.com/?q=林口MITSUI+OUTLET+PARK威秀影城",
    coordinates: { lat: 25.0707, lng: 121.3653 },
    transitInfo: "桃園機捷 A9 林口站步行 10 分鐘；或桃園市區開車/公車約 15-20 分鐘",
    source: "威秀影城官方網站 (vscinemas.com.tw)",
    verifiedAt: "2026-09-05",
    features: ["4K 雙雷射 IMAX 巨幕", "4DX 動態環境特效體感", "MAPPA 尊榮影廳", "三井 Outlet 購物商場"],
    officialWebsite: "https://www.vscinemas.com.tw",
    parkingInfo: "三井 Outlet 專用大型室內外停車場，平日/假日消費折抵"
  }
];

export const THEATER_MAP = new Map<string, Theater>(
  VERIFIED_THEATERS.map((t) => [t.id, t])
);

