/** One independently loaded timeline band/context. */
export class TimelineContext {
  constructor(value = {}, index = 0) {
    this.id = String(value.id || `context-${index + 1}`);
    this.title = String(value.title || `Band ${index + 1}`);
    this.query = value.query ?? null;
    this.ids = normalizeIds(value.ids);
    this.datasetId = positiveId(value.datasetId);
    this.source = value.source || (this.datasetId ? "dataset" : "query");
    this.timefields = normalizeFields(value.timefields);
    this.fields = normalizeFields(value.fields);
    this.visible = value.visible !== false;
    this.options = { ...(value.options || {}) };
    this.response = null;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      query: this.query,
      ids: [...this.ids],
      datasetId: this.datasetId,
      source: this.source,
      timefields: [...this.timefields],
      fields: [...this.fields],
      visible: this.visible,
      options: { ...this.options }
    };
  }
}

function normalizeFields(value) {
  if (Array.isArray(value)) return [...new Set(value.map(String).map(v => v.trim()).filter(Boolean))];
  if (typeof value === "string") return [...new Set(value.split(",").map(v => v.trim()).filter(Boolean))];
  return [];
}
function normalizeIds(value) {
  return [...new Set((Array.isArray(value) ? value : []).map(Number).filter(id => Number.isInteger(id) && id > 0))];
}
function positiveId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
