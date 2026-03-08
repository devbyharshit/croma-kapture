import * as XLSX from "xlsx";
import { ExcelRow, FilteredResults, COLUMN_NAMES, CONSTANTS } from "../types";

/**
 * Validates if the target sheet exists in the workbook
 */
function validateSheet(workbook: XLSX.WorkBook, sheetName: string): void {
  if (!workbook.SheetNames.includes(sheetName)) {
    throw new Error(
      `Sheet "${sheetName}" not found. Available sheets: ${workbook.SheetNames.join(", ")}`
    );
  }
}

/**
 * Filters rows by RSM name and excludes rows with Case Sub Status = "acc"
 */
function filterByRSM(
  rows: ExcelRow[],
  rsmName: string
): ExcelRow[] {
  return rows.filter((row) => {
    const rsmValue = row[COLUMN_NAMES.RSM];
    const caseSubStatus = row[COLUMN_NAMES.CASE_SUB_STATUS];

    return (
      typeof rsmValue === "string" &&
      rsmValue.trim().toLowerCase() === rsmName.trim().toLowerCase() &&
      typeof caseSubStatus === "string" &&
      caseSubStatus.trim().toLowerCase() !== "acc"
    );
  });
}

/**
 * Segregates filtered results into Non-FS, FS Croma, and FS Other categories
 */
function segregateResults(results: ExcelRow[]): FilteredResults {
  // Non-FS: FS Flag = "non fs" AND Case Ageing >= 7
  const nonFSList = results.filter((row) => {
    const fsFlag = row[COLUMN_NAMES.FS_FLAG];
    const caseAgeing = row[COLUMN_NAMES.CASE_AGEING];

    return (
      typeof fsFlag === "string" &&
      fsFlag.trim().toLowerCase() === "non fs" &&
      typeof caseAgeing === "number" &&
      caseAgeing >= CONSTANTS.NON_FS_MIN_AGEING
    );
  });

  // FS: NOT "non fs" AND Case Ageing >= 10
  const fsList = results.filter((row) => {
    const fsFlag = row[COLUMN_NAMES.FS_FLAG];
    const caseAgeing = row[COLUMN_NAMES.CASE_AGEING];

    const isNotNonFS =
      !fsFlag ||
      typeof fsFlag !== "string" ||
      fsFlag.trim().toLowerCase() !== "non fs";

    return (
      isNotNonFS &&
      typeof caseAgeing === "number" &&
      caseAgeing >= CONSTANTS.FS_MIN_AGEING
    );
  });

  // FS Croma: Order Product contains "croma"
  const fsCromaList = fsList.filter((row) => {
    const orderProduct = row[COLUMN_NAMES.ORDER_PRODUCT];
    return (
      typeof orderProduct === "string" &&
      orderProduct.toLowerCase().includes("croma")
    );
  });

  // FS Other: Order Product does NOT contain "croma"
  const fsOtherList = fsList.filter((row) => {
    const orderProduct = row[COLUMN_NAMES.ORDER_PRODUCT];
    return (
      !orderProduct ||
      typeof orderProduct !== "string" ||
      !orderProduct.toLowerCase().includes("croma")
    );
  });

  return { nonFSList, fsCromaList, fsOtherList };
}

/**
 * Processes an uploaded Excel file and returns segregated results
 */
export async function processExcelFile(
  file: File,
  rsmName: string = CONSTANTS.RSM_NAME
): Promise<FilteredResults> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error("Failed to read file");
        }

        // Read the workbook
        const workbook = XLSX.read(data, { type: "binary" });

        // Validate sheet exists
        validateSheet(workbook, CONSTANTS.TARGET_SHEET);

        // Get the target sheet
        const sheet = workbook.Sheets[CONSTANTS.TARGET_SHEET];

        // Convert sheet to array of objects
        const rows: ExcelRow[] = XLSX.utils.sheet_to_json(sheet, {
          defval: null,
        });

        // Filter by RSM
        const filteredByRSM = filterByRSM(rows, rsmName);

        // Segregate results
        const segregatedResults = segregateResults(filteredByRSM);

        resolve(segregatedResults);
      } catch (error) {
        reject(
          error instanceof Error
            ? error
            : new Error("Unknown error occurred while processing file")
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Generates and downloads Excel files for the segregated results
 */
export function downloadResults(results: FilteredResults): void {
  const { nonFSList, fsCromaList, fsOtherList } = results;

  // Download individual files
  if (nonFSList.length > 0) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(nonFSList);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Non-FS Entries");
    XLSX.writeFile(workbook, "non_fs_results.xlsx");
  }

  if (fsCromaList.length > 0) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(fsCromaList);
    XLSX.utils.book_append_sheet(workbook, worksheet, "FS Croma Entries");
    XLSX.writeFile(workbook, "fs_croma_results.xlsx");
  }

  if (fsOtherList.length > 0) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(fsOtherList);
    XLSX.utils.book_append_sheet(workbook, worksheet, "FS Other Entries");
    XLSX.writeFile(workbook, "fs_other_results.xlsx");
  }

  // Download combined file with all sheets
  const combinedWorkbook = XLSX.utils.book_new();

  // Add summary sheet
  const summaryData = [
    { Category: "Total Entries", Count: nonFSList.length + fsCromaList.length + fsOtherList.length },
    { Category: "Non-FS Entries", Count: nonFSList.length },
    { Category: "FS Croma Entries", Count: fsCromaList.length },
    { Category: "FS Other Entries", Count: fsOtherList.length },
  ];
  const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(combinedWorkbook, summaryWorksheet, "Summary");

  // Add category sheets
  if (nonFSList.length > 0) {
    const nonFSSheet = XLSX.utils.json_to_sheet(nonFSList);
    XLSX.utils.book_append_sheet(combinedWorkbook, nonFSSheet, "Non-FS");
  }
  if (fsCromaList.length > 0) {
    const fsCromaSheet = XLSX.utils.json_to_sheet(fsCromaList);
    XLSX.utils.book_append_sheet(combinedWorkbook, fsCromaSheet, "FS Croma");
  }
  if (fsOtherList.length > 0) {
    const fsOtherSheet = XLSX.utils.json_to_sheet(fsOtherList);
    XLSX.utils.book_append_sheet(combinedWorkbook, fsOtherSheet, "FS Other");
  }

  XLSX.writeFile(combinedWorkbook, "all_segregated_results.xlsx");
}
