# heurist-timeline

Vite/client-core timeline presentation module for Heurist. It is intentionally modelled as a sibling of `heurist-data`, but its native state is an ordered list of independent temporal contexts (bands), not one Dataset.

## Core API

- `setQuery(query, options)` updates/creates the `current` band.
- `setContexts(contexts)` replaces all bands.
- `addContext(context)` / `removeContext(id)` manage map-layer or other independent bands.
- `setSelection(recordIds, {zoom})`, `zoomToSelection()`, `zoomToAll()` synchronize record-oriented selection with item-oriented vis.timeline.

Each context may contain `query` or `ids`, `timefields`, additional `fields`, title and display options. Data is loaded from `POST /api/{db}/time`.

The provider deliberately preserves the server response. `TemporalAdapter` converts each `record.when[]` tuple to a vis item and attaches the full tuple as `item.temporal`; temporal uncertainty is therefore not lost in the API layer.

## Heurist temporal tuple

`[start, latest-start, earliest-end, end, label, profile-start, profile-end, determination, detail-type-id]`

The visual layer distinguishes exact points, circa, before, after, exact ranges and fuzzy ranges. Gradient CSS is the first-pass equivalent of the legacy timeline visual language.

## Host integration

The matching host files are `modules/timeline/HeuristModuleTimeline.js`, `timelineViewer.js`, and `timelineViewer.html` in the supplied host patch.

## Important limitation of this scaffold

The old timeline used Heurist-specific vis date extensions (`getDate`, `getDataRangeHeurist`) for dates outside JavaScript Date's practical timeline range. This scaffold preserves raw values but currently uses native `Date` for vis layout. A dedicated Heurist time-scale/date adapter is therefore the next required step for geological/prehistoric dates and should be ported or reimplemented before claiming full legacy temporal range compatibility.
