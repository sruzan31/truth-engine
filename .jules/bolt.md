## 2023-11-06 - [React Render Optimization in HistoryTable]
**Learning:** Found a missing memoization on a potentially large list filtering operation (`scans.filter`) within `frontend/components/HistoryTable.tsx`.
**Action:** Used `useMemo` to memoize the computed `filteredScans` array based on the raw scans and filter parameters.
