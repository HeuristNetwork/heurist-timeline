/** Loads temporal projections from /api/{db}/time without converting Heurist temporal semantics. */
export class TemporalDataProvider {
  constructor({ apiClient }) { this.apiClient = apiClient; }
  async load({ query, ids, timefields, fields = [], limit = 100000, offset = 0, sort, filter, resolveDetails = 1, signal } = {}) {
    const body = { limit, offset, resolveDetails };
    if (query != null && query !== "") body.q = query;
    if (Array.isArray(ids) && ids.length) body.ids = ids;
    if (timefields != null && timefields !== "") body.timefields = Array.isArray(timefields) ? timefields.join(",") : timefields;
    if (fields?.length) body.fields = [...new Set(fields.map(String))].join(",");
    if (sort !== undefined) body.sort = sort;
    if (filter != null && filter !== "") body.filter = filter;
    const response = await this.apiClient.post("/time", { body, signal });
    if (!response || !Array.isArray(response.records)) throw new TypeError("Temporal records API response is missing records");
    return response;
  }
}
