import { Timeline } from "vis-timeline/standalone";
import { DataSet } from "vis-data";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";

export class VisTimelineEngine {
  async initialize({ container, settings = {}, onSelectionChange, onRangeChange }) {
    this.container = container; this.settings = settings; this.onSelectionChange = onSelectionChange; this.onRangeChange = onRangeChange;
    this.groups = new DataSet(); this.items = new DataSet(); this.recordItemIds = new Map();
    this.timeline = new Timeline(container, this.items, this.groups, {
      orientation: settings.orientation || "both", selectable: true, multiselect: true,
      stack: settings.stack !== false, margin: 1, zoomMax: settings.zoomMax,
      order: (a,b) => new Date(a.start) - new Date(b.start), template: item => this._template(item)
    });
    this.timeline.on("select", params => this.onSelectionChange?.(this._recordsForItems(params.items || [])));
    this.timeline.on("rangechanged", params => this.onRangeChange?.({ start: params.start, end: params.end, byUser: params.byUser === true }));
  }
  async setData({ groups = [], items = [] }) {
    this.recordItemIds.clear();
    for (const item of items) { const id = Number(item.recID); if (!this.recordItemIds.has(id)) this.recordItemIds.set(id, []); this.recordItemIds.get(id).push(item.id); }
    this.groups.clear(); this.items.clear(); this.groups.add(groups); this.items.add(items);
    this.timeline.setGroups(this.groups); this.timeline.setItems(this.items); this.zoomToAll();
  }
  async setSelection(recordIds, options = {}) {
    const itemIds = [...new Set((recordIds || []).flatMap(id => this.recordItemIds.get(Number(id)) || []))];
    this.timeline.setSelection(itemIds, { focus: false });
    if (options.zoom && itemIds.length) this.zoomToSelection();
  }
  zoomIn() { this.timeline.zoomIn(0.25); }
  zoomOut() { this.timeline.zoomOut(0.5); }
  zoomToAll() { if (this.items.length) this.timeline.fit({ animation: false }); }
  zoomToSelection() { const ids = this.timeline.getSelection(); if (ids.length) this.timeline.focus(ids, { animation: false, zoom: true }); }
  moveToStart() { const range=this.timeline.getItemRange(); if (range?.min) this.timeline.moveTo(range.min, { animation:false }); }
  moveToEnd() { const range=this.timeline.getItemRange(); if (range?.max) this.timeline.moveTo(range.max, { animation:false }); }
  setOptions(options={}) { this.settings={...this.settings,...options}; this.timeline.setOptions({ stack:this.settings.stack!==false, orientation:this.settings.orientation||"both", template:item=>this._template(item) }); this.timeline.redraw(); }
  resize() { this.timeline?.redraw(); }
  async destroy() { this.timeline?.destroy(); this.timeline=null; }
  _recordsForItems(itemIds) { return [...new Set(itemIds.map(id => Number(this.items.get(id)?.recID)).filter(id=>id>0))]; }
  _template(item) {
    const cls = `heurist-temporal heurist-temporal-${item.temporalKind || "exact"}`;
    const label = escapeHtml(this.settings.labelMode === "hidden" ? "" : item.content || "");
    const style = this.settings.labelMode === "fixed" ? ` style="--heurist-label-width:${Number(this.settings.labelWidthEm)||10}em"` : "";
    return `<span class="${cls} heurist-label-${this.settings.labelMode || "full"} heurist-label-pos-${this.settings.labelPosition || "bar"}"${style}><span class="heurist-temporal-shape"></span><span class="heurist-temporal-label">${label}</span></span>`;
  }
}
function escapeHtml(value){ return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
