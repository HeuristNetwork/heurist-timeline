/**
 * @file VisTimelineEngine.js
 * @brief Wraps the vis-timeline library and maps the timeline API to the Heurist module lifecycle.
 * @project     Heurist academic knowledge management system
 * @package     heurist-timeline
 * @link        https://HeuristNetwork.org
 * @copyright   (C) 2024 onwards Heurist Network
 * @author      Artem Osmakov   <osmakov@gmail.com>
 * @author      Ian Johnson <ian.johnson.heurist@gmail.com>
 * @license     https://www.gnu.org/licenses/gpl-3.0.txt GNU License 3.0
 * @since       8.0
 */

import { Timeline } from "vis-timeline/standalone";
import { DataSet } from "vis-data";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";

/**
 * Hosts the underlying vis-timeline instance and exposes the application-facing lifecycle methods.
 */
export class VisTimelineEngine {
  /**
   * Initializes the timeline canvas and event handlers.
   *
   * @param {object} options - Runtime settings and callback handlers.
   * @returns {Promise<void>}
   */
  async initialize({ container, settings = {}, onSelectionChange, onRangeChange }) {
    this.container = container;
    this.settings = settings;
    this.onSelectionChange = onSelectionChange;
    this.onRangeChange = onRangeChange;
    this.groups = new DataSet();
    this.items = new DataSet();
    this.recordItemIds = new Map();

    this.timeline = new Timeline(container, this.items, this.groups, {
      orientation: settings.orientation || "both",
      selectable: true,
      multiselect: true,
      stack: settings.stack !== false,
      margin: 1,
      zoomMax: settings.zoomMax,
      order: (a, b) => new Date(a.start) - new Date(b.start),
      template: (item) => this._template(item),
    });

    this.timeline.on("select", (params) =>
      this.onSelectionChange?.(this._recordsForItems(params.items || [])),
    );
    this.timeline.on("rangechanged", (params) =>
      this.onRangeChange?.({
        start: params.start,
        end: params.end,
        byUser: params.byUser === true,
      }),
    );
  }

  /**
   * Replaces the data sources used by the timeline.
   *
   * @param {{ groups?: Array<object>, items?: Array<object> }} options - New groups and items.
   * @returns {Promise<void>}
   */
  async setData({ groups = [], items = [] }) {
    this.recordItemIds.clear();

    for (const item of items) {
      const id = Number(item.recID);
      if (!this.recordItemIds.has(id)) this.recordItemIds.set(id, []);
      this.recordItemIds.get(id).push(item.id);
    }

    this.groups.clear();
    this.items.clear();
    this.groups.add(groups);
    this.items.add(items);
    this.timeline.setGroups(this.groups);
    this.timeline.setItems(this.items);
    this.zoomToAll();
  }

  /**
   * Selects the supplied record IDs within the timeline.
   *
   * @param {Array<number>} recordIds - Record IDs to select.
   * @param {{ zoom?: boolean }} [options={}] - Optional selection behavior.
   * @returns {Promise<void>}
   */
  async setSelection(recordIds, options = {}) {
    const itemIds = [
      ...new Set(
        (recordIds || []).flatMap((id) => this.recordItemIds.get(Number(id)) || []),
      ),
    ];

    this.timeline.setSelection(itemIds, { focus: false });
    if (options.zoom && itemIds.length) this.zoomToSelection();
  }

  /**
   * Zooms in by a moderate step.
   */
  zoomIn() {
    this.timeline.zoomIn(0.25);
  }

  /**
   * Zooms out by a moderate step.
   */
  zoomOut() {
    this.timeline.zoomOut(0.5);
  }

  /**
   * Fits the entire dataset into the current viewport.
   */
  zoomToAll() {
    if (this.items.length) this.timeline.fit({ animation: false });
  }

  /**
   * Focuses the current selection in the timeline viewport.
   */
  zoomToSelection() {
    const ids = this.timeline.getSelection();
    if (ids.length) this.timeline.focus(ids, { animation: false, zoom: true });
  }

  /**
   * Moves the viewport to the earliest item.
   */
  moveToStart() {
    const range = this.timeline.getItemRange();
    if (range?.min) this.timeline.moveTo(range.min, { animation: false });
  }

  /**
   * Moves the viewport to the latest item.
   */
  moveToEnd() {
    const range = this.timeline.getItemRange();
    if (range?.max) this.timeline.moveTo(range.max, { animation: false });
  }

  /**
   * Updates timeline display options in place.
   *
   * @param {object} [options={}] - Partial timeline options.
   */
  setOptions(options = {}) {
    this.settings = { ...this.settings, ...options };
    this.timeline.setOptions({
      stack: this.settings.stack !== false,
      orientation: this.settings.orientation || "both",
      template: (item) => this._template(item),
    });
    this.timeline.redraw();
  }

  /**
   * Redraws the timeline.
   */
  resize() {
    this.timeline?.redraw();
  }

  /**
   * Destroys the timeline instance.
   *
   * @returns {Promise<void>}
   */
  async destroy() {
    this.timeline?.destroy();
    this.timeline = null;
  }

  /**
   * Maps item IDs back to their underlying record IDs.
   *
   * @param {Array<string>} itemIds - Timeline item identifiers.
   * @returns {Array<number>} Record IDs represented by the selected items.
   */
  _recordsForItems(itemIds) {
    return [
      ...new Set(
        itemIds
          .map((id) => Number(this.items.get(id)?.recID))
          .filter((id) => id > 0),
      ),
    ];
  }

  /**
   * Renders the HTML template used for timeline item labels.
   *
   * @param {object} item - vis-timeline item object.
   * @returns {string} Sanitized HTML string for the item label.
   */
  _template(item) {
    const cls = `heurist-temporal heurist-temporal-${item.temporalKind || "exact"}`;
    const label = escapeHtml(this.settings.labelMode === "hidden" ? "" : item.content || "");
    const style = this.settings.labelMode === "fixed"
      ? ` style="--heurist-label-width:${Number(this.settings.labelWidthEm) || 10}em"`
      : "";

    return `<span class="${cls} heurist-label-${this.settings.labelMode || "full"} heurist-label-pos-${this.settings.labelPosition || "bar"}"${style}><span class="heurist-temporal-shape"></span><span class="heurist-temporal-label">${label}</span></span>`;
  }
}

/**
 * Escapes HTML so content inserted in timeline labels stays safe.
 *
 * @param {string|number|undefined|null} value - Raw text.
 * @returns {string} Safe HTML string.
 */
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character]));
}

