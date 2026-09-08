import "./style.css";
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "@fortawesome/fontawesome-free/css/solid.min.css";
import { getHeuristTimelineConfig } from "./timelineConfig.js";
import { initHeuristTimeline } from "./initHeuristTimeline.js";
const config=getHeuristTimelineConfig();
initHeuristTimeline(config).catch(error=>{ const c=document.getElementById("heurist-timeline"); if(c)c.textContent=error?.message||String(error); console.error("Unable to initialize heurist-timeline",error); });
