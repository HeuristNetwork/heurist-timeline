/** Parse Heurist ISO-ish values into Date instances accepted by vis.timeline. */
export function toVisDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === "number" && Number.isFinite(value)) return yearToDate(value);
  const text = String(value ?? "").trim();
  if (!text) return null;
  if (/^-?\d+(?:\.\d+)?$/.test(text) && !text.includes("-", 1)) {
    return yearToDate(Number(text));
  }
  const iso = normalizeIso(text);
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeIso(value) {
  if (/^[+-]\d{6}(?:-\d{2}(?:-\d{2})?)?$/.test(value)) {
    const parts = value.match(/^([+-]\d{6})(?:-(\d{2}))?(?:-(\d{2}))?$/);
    return `${parts[1]}-${parts[2] || "01"}-${parts[3] || "01"}T00:00:00.000Z`;
  }
  if (/^\d{4}$/.test(value)) return `${value}-01-01T00:00:00.000Z`;
  if (/^\d{4}-\d{2}$/.test(value)) return `${value}-01T00:00:00.000Z`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00:00.000Z`;
  return value;
}

function yearToDate(year) {
  if (!Number.isFinite(year)) return null;
  const wholeYear = Math.trunc(year);
  const date = new Date(0);
  date.setUTCFullYear(wholeYear, 0, 1);
  date.setUTCHours(0, 0, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}
