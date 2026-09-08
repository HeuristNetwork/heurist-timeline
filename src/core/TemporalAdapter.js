/** Converts the normal /time records envelope into engine-neutral timeline items. */
export class TemporalAdapter {
  static convertContext(context, response) {
    const items = [];
    for (const record of response?.records || []) {
      const whens = Array.isArray(record.when) ? record.when : [];
      whens.forEach((when, index) => {
        if (!Array.isArray(when) || when.length < 9) return;
        items.push(this.convertWhen(context, record, when, index));
      });
    }
    return items.filter(Boolean);
  }

  static convertWhen(context, record, when, index) {
    const [start, latestStart, earliestEnd, end, label, profileStart, profileEnd, determination, dtyID] = when;
    const temporal = { start, latestStart, earliestEnd, end, label, profileStart, profileEnd, determination, dtyID };
    const layout = deriveLayout(temporal);
    if (!layout.start) return null;
    return {
      id: `${context.id}:${record.rec_ID}:${index}`,
      group: context.id,
      recID: Number(record.rec_ID),
      dtyID: Number(dtyID) || dtyID,
      content: record.rec_Title || String(record.rec_ID),
      title: label || record.rec_Title || "",
      start: layout.start,
      ...(layout.end ? { end: layout.end } : {}),
      temporal,
      temporalKind: layout.kind,
      className: `heurist-time-kind-${layout.kind} heurist-profile-start-${Number(profileStart) || 0} heurist-profile-end-${Number(profileEnd) || 0} heurist-determination-${Number(determination) || 0}`,
      record
    };
  }
}

function deriveLayout(t) {
  const start = parseTemporalDate(t.start);
  const end = parseTemporalDate(t.end);
  const latestStart = parseTemporalDate(t.latestStart);
  const earliestEnd = parseTemporalDate(t.earliestEnd);
  const isRange = t.latestStart != null && String(t.latestStart) !== ""
    || t.earliestEnd != null && String(t.earliestEnd) !== "";
  const kind = classifyTemporal(t, isRange);

  // /time already supplies the outer display limits in start/end. Keep those
  // for vis layout and retain latestStart/earliestEnd for the solid/fuzzy split.
  if (!start) return { kind, start: null, end: null };
  return {
    kind,
    start,
    end: end && end.getTime() !== start.getTime() ? end : null,
    latestStart,
    earliestEnd
  };
}

function classifyTemporal(t, isRange) {
  const profileStart = Number(t.profileStart) || 0;
  const profileEnd = Number(t.profileEnd) || 0;
  if (isRange) return profileStart || profileEnd ? "fuzzy-range" : "range";
  // Temporal::getTimelineDate profile contract:
  // 0 flat/exact, 1 central/circa, 2 slow start/before, 3 slow finish/after.
  if (profileStart === 1) return "circa";
  if (profileStart === 2) return "before";
  if (profileStart === 3) return "after";
  return "exact";
}

/** ISO-like Heurist dates. JS Date is used only for vis layout; the original value remains in temporal. */
function parseTemporalDate(value) {
  if (value == null || value === "") return null;
  if (value instanceof Date) return value;
  const text = String(value).trim();
  if (!text) return null;
  const match = text.match(/^(-?\d{1,6})(?:-(\d{2})(?:-(\d{2}))?)?/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Math.max(1, Math.min(12, Number(match[2] || 1)));
  const day = Math.max(1, Math.min(31, Number(match[3] || 1)));
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0,0,0,0);
  return Number.isNaN(date.getTime()) ? null : date;
}
