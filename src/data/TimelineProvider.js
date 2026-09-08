/** Thin client for /api/{db}/time. It deliberately preserves the API response. */
export class TimelineProvider {
  constructor({ apiClient }) { this.apiClient = apiClient; }

  async load({ query, ids = [], timefields = [], fields = [], limit = 100000, offset = 0, sort, filter, resolveDetails = 1, signal } = {}) {
    if ((query == null || query === "") && !ids.length) {
      return { records: [], pagination: { total: 0, limit, offset } };
    }
    const body = { limit, offset, resolveDetails: resolveDetails ? 1 : 0 };
    if (query != null && query !== "") body.q = query;
    if (ids.length) body.ids = ids;
    if (timefields.length) body.timefields = timefields.join(",");
    if (fields.length) body.fields = fields.join(",");
    if (sort !== undefined) body.sort = sort;
    if (filter != null && filter !== "") body.filter = filter;
    const response = await this.apiClient.post("/time", { body, signal });
    if (!response || !Array.isArray(response.records)) {
      throw new TypeError("Temporal records API response is missing records");
    }
    return response;
  }
}
