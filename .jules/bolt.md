## 2025-02-14 - React useMemo array filtering optimization
**Learning:** Found an O(n) filter logic calculating `toLowerCase()` inside the filter function on every render for large arrays. Wrapping with `useMemo` and hoisting the string operation is a highly impactful pattern for tables receiving rapid user input (like search bars).
**Action:** Next time, always check if `.filter()` or `.map()` loops inside functional components are unnecessarily recalculating invariant parts on every render, especially on text-input events.
