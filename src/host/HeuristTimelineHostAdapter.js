import { HostAdapter } from "@heurist/client-core/host";
export class HeuristTimelineHostAdapter extends HostAdapter {
  constructor({ bridge=null, baseUrl=null, database=null, fetchImpl=null }={}) { super({ bridge, baseUrl, database, fetchImpl, moduleType:"timeline" }); }
}
