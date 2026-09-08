/** Loads the persisted Dataset presentation document used as a timeline source. */
export class DatasetProvider {
  constructor({ apiClient }) { this.apiClient = apiClient; }
  async load(datasetId, { signal } = {}) {
    const id = Number(datasetId);
    if (!Number.isInteger(id) || id < 1) throw new TypeError("Dataset ID must be positive");
    const value = await this.apiClient.get(`/records/dataset/${id}`, { signal });
    if (!value?.source?.query) throw new TypeError(`Dataset ${id} has no source query`);
    return value;
  }
}
