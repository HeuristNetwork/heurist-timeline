import { StandaloneHostAdapter } from "@heurist/client-core/host";
import { HeuristTimelineHostAdapter } from "./HeuristTimelineHostAdapter.js";
export function createHostAdapter(config){ return config?.type === "heurist" ? new HeuristTimelineHostAdapter(config) : new StandaloneHostAdapter(); }
