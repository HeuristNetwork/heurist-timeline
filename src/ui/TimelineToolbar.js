export class TimelineToolbar {
  constructor({ api, settings }) { this.api=api; this.settings=settings; this.element=null; }
  mount(container) {
    if (this.settings.showToolbar === false) return;
    const bar=document.createElement("div"); bar.className="heurist-timeline-toolbar";
    const buttons=[
      ["fa-magnifying-glass-plus","Zoom in",()=>this.api.zoomIn()],
      ["fa-magnifying-glass-minus","Zoom out",()=>this.api.zoomOut()],
      ["fa-arrows-left-right-to-line","Zoom to all",()=>this.api.zoomToAll()],
      ["fa-crosshairs","Zoom to selection",()=>this.api.zoomToSelection()],
      ["fa-backward-step","Move to start",()=>this.api.moveToStart()],
      ["fa-forward-step","Move to end",()=>this.api.moveToEnd()],
      ["fa-gear","Timeline options",()=>this._toggleOptions()]
    ];
    for (const [icon,title,handler] of buttons) { const b=document.createElement("button"); b.type="button"; b.title=title; b.innerHTML=`<i class="fa-solid ${icon}"></i>`; b.addEventListener("click",handler); bar.appendChild(b); }
    container.parentElement?.insertBefore(bar, container); this.element=bar;
  }
  _toggleOptions(){ this.api.cycleLabelMode(); }
  destroy(){ this.element?.remove(); this.element=null; }
}
