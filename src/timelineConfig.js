import { getFrameHostBridge, getGlobalBootstrap } from "@heurist/client-core/host";
import { resolveModuleBootstrap } from "@heurist/client-core/config";

export function getHeuristTimelineConfig() {
  const bridge = getFrameHostBridge("heuristTimelineHost");
  const bootstrap = resolveModuleBootstrap({ bridge, standalone: getGlobalBootstrap("heuristModuleBootstrap") });
  const runtime = bootstrap.runtime || {};
  const settings = normalizeSettings(bootstrap.settings || {});
  const source = bootstrap.source ?? bootstrap.state ?? {};
  const contexts = normalizeContexts(source.contexts);
  if (!contexts.length && source.query) contexts.push({ id: "current", title: "Current result", query: source.query, timefields: source.timefields || null, fields: source.fields || [] });
  return {
    containerId: "heurist-timeline",
    runtimeMode: runtime.runtimeMode || "standalone",
    language: String(runtime.language || "eng").toLowerCase().slice(0,3),
    database: runtime.database || null,
    apiBaseUrl: runtime.apiBaseUrl || null,
    accessToken: runtime.accessToken || null,
    requestHeaders: runtime.requestHeaders || {},
    searchRealm: runtime.searchRealm ?? runtime.search_realm ?? null,
    sourceId: runtime.source ?? runtime.sourceId ?? null,
    host: runtime.baseUrl ? { type: "heurist", baseUrl: runtime.baseUrl, database: runtime.database, bridge } : null,
    settings,
    source: { contexts, selection: normalizeIds(source.selection) }
  };
}

function normalizeSettings(value) {
  return {
    stack: value.stack !== false,
    orientation: value.orientation || "both",
    labelMode: ["full","truncate","fixed","hidden"].includes(value.labelMode) ? value.labelMode : "full",
    labelWidthEm: Math.min(100, Math.max(5, Number(value.labelWidthEm) || 10)),
    labelPosition: value.labelPosition === "above" ? "above" : "bar",
    showToolbar: value.showToolbar !== false,
    zoomMax: Number(value.zoomMax) || 31536000000 * 500000
  };
}
function normalizeContexts(value) {
  return (Array.isArray(value) ? value : []).map((context, index) => ({
    id: String(context?.id ?? `context-${index+1}`),
    title: String(context?.title || `Band ${index+1}`),
    query: context?.query ?? null,
    ids: Array.isArray(context?.ids) ? normalizeIds(context.ids) : null,
    timefields: context?.timefields ?? null,
    fields: Array.isArray(context?.fields) ? context.fields : [],
    visible: context?.visible !== false,
    options: { ...(context?.options || {}) }
  })).filter(c => c.query || c.ids?.length);
}
function normalizeIds(value) { return [...new Set((Array.isArray(value) ? value : []).map(Number).filter(id => Number.isInteger(id) && id > 0))]; }
