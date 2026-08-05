/**
 * Helper function to export structured tabular data to a CSV file.
 * Automatically adds UTF-8 BOM byte marker so Microsoft Excel and other tools render characters properly.
 */
export function exportToCSV(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
) {
  const escapeCell = (cell: any): string => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell);
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const headerRow = headers.map(escapeCell).join(",");
  const dataRows = rows.map((row) => row.map(escapeCell).join(","));

  const csvContent = "\uFEFF" + [headerRow, ...dataRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
