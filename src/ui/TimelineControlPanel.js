export class TimelineControlPanel {
  constructor({ api, container, options }) { this.api = api; this.container = container; this.options = options; }
  mount() {
    this.element = document.createElement("div");
    this.element.className = "h-timeline-toolbar";
    this.element.innerHTML = `
      <button data-action="zoom-in" title="Zoom in"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
      <button data-action="zoom-out" title="Zoom out"><i class="fa-solid fa-magnifying-glass-minus"></i></button>
      <button data-action="all" title="Zoom to all"><i class="fa-solid fa-arrows-left-right-to-line"></i></button>
      <button data-action="selection" title="Zoom to selection"><i class="fa-solid fa-crosshairs"></i></button>
      <button data-action="start" title="Move to start"><i class="fa-solid fa-backward-step"></i></button>
      <button data-action="end" title="Move to end"><i class="fa-solid fa-forward-step"></i></button>
      <button data-action="options" title="Timeline options"><i class="fa-solid fa-gear"></i></button>`;
    this.container.parentElement.insertBefore(this.element, this.container);
    this.element.addEventListener("click", e => this._action(e));
    return this;
  }
  _action(event) {
    const action = event.target.closest("button")?.dataset.action;
    if (!action) return;
    if (action === "zoom-in") this.api.zoomIn();
    else if (action === "zoom-out") this.api.zoomOut();
    else if (action === "all") this.api.zoomToAll();
    else if (action === "selection") this.api.zoomToSelection();
    else if (action === "start") this.api.moveToStart();
    else if (action === "end") this.api.moveToEnd();
    else if (action === "options") this._openOptions();
  }
  _openOptions() {
    const state = this.api.getState();
    const dialog = document.createElement("dialog");
    dialog.className = "h-timeline-options";
    dialog.innerHTML = `<form method="dialog">
      <h3>Timeline options</h3>
      <label>Labels <select name="labelMode"><option value="full">Full</option><option value="truncate">Truncate</option><option value="fixed">Fixed width</option><option value="hidden">Hidden</option></select></label>
      <label>Label position <select name="labelPosition"><option value="inside">Within bar</option><option value="above">Above bar</option></select></label>
      <label>Fixed label width <input name="labelWidth" type="number" min="5" max="100" value="10"></label>
      <label><input name="stack" type="checkbox"> Stack overlapping items</label>
      <div class="actions"><button value="cancel">Cancel</button><button value="apply">Apply</button></div>
    </form>`;
    document.body.append(dialog);
    const form = dialog.querySelector("form");
    form.labelMode.value = state.options.labelMode || "full";
    form.labelPosition.value = state.options.labelPosition || "inside";
    form.labelWidth.value = state.options.labelWidth || 10;
    form.stack.checked = state.options.stack !== false;
    dialog.addEventListener("close", () => {
      if (dialog.returnValue === "apply") this.api.applyOptions({ labelMode: form.labelMode.value, labelPosition: form.labelPosition.value, labelWidth: Number(form.labelWidth.value), stack: form.stack.checked });
      dialog.remove();
    });
    dialog.showModal();
  }
  destroy() { this.element?.remove(); }
}
