var remeasurers = {};
export const remeasure = (ids) => {
 (ids ? Array.from(ids).flat() : Object.values(remeasurers))
 .forEach(id => remeasurers[id] && remeasurers[id]());
};
export function useManualRemeasures(manual, id) {
 useEffect(() => {
  remeasurers[id] = (debounce(manual, 0));
  return () => { delete remeasurers[id]; };
 }, [manual, id]);
}
