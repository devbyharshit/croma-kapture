export interface ExcelRow {
  [key: string]: string | number | null;
}

export interface FilteredResults {
  nonFSList: ExcelRow[];
  fsCromaList: ExcelRow[];
  fsOtherList: ExcelRow[];
}

export interface ProcessingStats {
  totalEntries: number;
  nonFSEntries: number;
  fsCromaEntries: number;
  fsOtherEntries: number;
}

export const COLUMN_NAMES = {
  RSM: "RSM",
  CASE_SUB_STATUS: "Case Sub Status",
  FS_FLAG: "FS Flag",
  CASE_AGEING: "Case Ageing",
  ORDER_PRODUCT: "Order Product",
} as const;

export const CONSTANTS = {
  TARGET_SHEET: "Kapture Open Case",
  RSM_NAME: "Daljinder Saini",
  NON_FS_MIN_AGEING: 7,
  FS_MIN_AGEING: 10,
} as const;
