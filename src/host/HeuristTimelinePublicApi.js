export class HeuristTimelinePublicApi {
  constructor(application){ this.application=application; this.readyPromise=null; }
  setReadyPromise(value){ this.readyPromise=value; }
  ready(){ return this.readyPromise || Promise.resolve(this); }
  setQuery(query, options){ return this.application.setQuery(query, options); }
  setContexts(contexts, options){ return this.application.setContexts(contexts, options); }
  addContext(context){ return this.application.addContext(context); }
  removeContext(id){ return this.application.removeContext(id); }
  setSelection(ids, options){ return this.application.setSelection(ids, options); }
  clearSelection(){ return this.application.clearSelection(); }
  refresh(){ return this.application.refresh(); }
  resize(){ return this.application.resize(); }
  getState(){ return this.application.getState(); }
  zoomIn(){ return this.application.engine.zoomIn(); }
  zoomOut(){ return this.application.engine.zoomOut(); }
  zoomToAll(){ return this.application.zoomToAll(); }
  zoomToSelection(){ return this.application.zoomToSelection(); }
  moveToStart(){ return this.application.engine.moveToStart(); }
  moveToEnd(){ return this.application.engine.moveToEnd(); }
  cycleLabelMode(){ const modes=["full","truncate","fixed","hidden"]; const e=this.application.engine; const next=modes[(modes.indexOf(e.settings.labelMode)+1)%modes.length]; e.setOptions({ labelMode:next }); return next; }
  addEventListener(...args){ this.application.addEventListener(...args); }
  removeEventListener(...args){ this.application.removeEventListener(...args); }
  destroy(){ return this.application.destroy(); }
}
