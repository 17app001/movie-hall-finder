export type DataStatus = "mock" | "verified" | "unverified";

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
  features?: string[];
  officialWebsite?: string;
  parkingInfo?: string;
}

export type FormatType = "IMAX" | "Dolby Atmos" | "4DX" | "LUXE" | "Standard" | "Unknown";
export type HallSizeLevel = "巨大廳" | "中大廳" | "標準廳" | "未知";

export interface Hall {
  id: string;
  theaterId: string;
  hallNo: string;
  seatCount?: number;
  format: FormatType;
  hallSizeLevel?: HallSizeLevel;
  soundSystem?: string;
  screenSpecs?: string;
  wheelchairSeats?: number;
  laserProjection?: boolean;
  dataStatus: DataStatus;
  source?: string;
  verifiedAt?: string;
  specNotes?: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  movieTitle: string;
  theaterId: string;
  hallId?: string;
  startTime: string; // ISO string: "2026-09-05T14:30:00"
  endTime?: string;
  standardPrice?: number;
  promoPrice?: number;
  promoDescription?: string;
  dataStatus: DataStatus;
  source?: string;
  fetchedAt?: string;
}

export interface Movie {
  id: string;
  title: string;
  englishTitle: string;
  runtime: number; // minutes
  rating: "普遍級" | "保護級" | "輔12級" | "輔15級" | "限制級";
  posterUrl: string;
  backdropUrl?: string;
  genre: string[];
  synopsis: string;
  recommendedFormat: FormatType[];
  releaseDate: string;
}

export type DateSlot = "today-afternoon" | "today-evening" | "tomorrow-afternoon" | "weekend";

export interface FilterPreferences {
  movieId: string;
  region: "all" | "taoyuan" | "linkou";
  dateSlot: DateSlot;
  preferLargeHall: boolean;
  preferSpecialFormat: boolean;
  preferPromoPrice: boolean;
  allowCrossRegion: boolean;
  sortBy: "score" | "time" | "price";
}

export interface ScoreBreakdown {
  hallSize: number; // 30%
  specialFormat: number; // 20%
  timeSlot: number; // 15%
  priceAdvantage: number; // 15%
  promotions: number; // 10%
  transitConvenience: number; // 10%
}

export interface AdditivePoint {
  label: string;
  points: number;
  tag: string;
  type: "hall" | "format" | "time" | "price" | "promo" | "transit";
}

export interface RecommendationResult {
  showtime: Showtime;
  theater: Theater;
  hall?: Hall;
  movie?: Movie;
  recommendScore: number; // 0 - 100
  recommendReasons: string[];
  confidence: "high" | "medium" | "low";
  warnings: string[];
  breakdown: ScoreBreakdown;
  additivePoints: AdditivePoint[];
  humanSummary: string;
  isTopPick?: boolean;
}

export interface MissingInfoTask {
  id: string;
  theaterId: string;
  theaterName: string;
  hallId?: string;
  hallNo?: string;
  fieldNeeded: "seatCount" | "soundSystem" | "screenSpecs" | "showtimeConfirmation";
  fieldLabel: string;
  currentValue: string;
  status: "pending_query" | "calling_agent" | "resolved";
  suggestedPhone: string;
  notes: string;
}

