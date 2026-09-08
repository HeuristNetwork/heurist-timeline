import test from "node:test";
import assert from "node:assert/strict";
import { TemporalAdapter } from "../src/core/TemporalAdapter.js";
const context={id:"band-1"};
function item(when){return TemporalAdapter.convertWhen(context,{rec_ID:7,rec_Title:"Test"},when,0);}
test("exact point",()=>assert.equal(item(["1990","","","1990","",0,0,1,9]).temporalKind,"exact"));
test("circa uses profile 1",()=>assert.equal(item(["1988","","","1992","",1,0,2,9]).temporalKind,"circa"));
test("before uses slow-start profile 2",()=>assert.equal(item(["1988","","","1990","",2,0,0,9]).temporalKind,"before"));
test("after uses slow-finish profile 3",()=>assert.equal(item(["1990","","","1992","",3,0,0,9]).temporalKind,"after"));
test("fuzzy range uses populated inner limits and profiles",()=>assert.equal(item(["1990","1991","1994","1996","",2,3,1,9]).temporalKind,"fuzzy-range"));
test("selection identity is stable per context/record/when",()=>assert.equal(item(["1990","","","1990","",0,0,0,9]).id,"band-1:7:0"));
