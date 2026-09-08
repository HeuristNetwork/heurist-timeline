import { HeuristApiClient } from "@heurist/client-core/api";
import { TimelineApplication } from "./core/TimelineApplication.js";
import { TemporalDataProvider } from "./data/TemporalDataProvider.js";
import { VisTimelineEngine } from "./engine/vis/VisTimelineEngine.js";
import { createHostAdapter } from "./host/createHostAdapter.js";
import { HeuristTimelinePublicApi } from "./host/HeuristTimelinePublicApi.js";
import { TimelineToolbar } from "./ui/TimelineToolbar.js";

export async function initHeuristTimeline(config){
  const container=document.getElementById(config.containerId); if(!container) throw new Error(`Timeline container #${config.containerId} was not found`);
  const apiClient=new HeuristApiClient({ apiBaseUrl:config.apiBaseUrl,database:config.database,accessToken:config.accessToken,headers:config.requestHeaders });
  const application=new TimelineApplication({ container,config,engine:new VisTimelineEngine(),host:createHostAdapter(config.host),provider:new TemporalDataProvider({apiClient}) });
  const api=new HeuristTimelinePublicApi(application); const toolbar=new TimelineToolbar({api,settings:config.settings}); toolbar.mount(container);
  const ready=application.initialize().then(()=>api); api.setReadyPromise(ready); const originalDestroy=api.destroy.bind(api); api.destroy=()=>{toolbar.destroy(); return originalDestroy();};
  globalThis.heuristTimeline=api; return ready;
}
