import {useGrabbed, useAmIGrabbed, grabbedItem} from 'grab';
import debounce from 'lodash.debounce';
import { create } from 'zustand';
import { useEffect } from "react";
import useMeasure from "react-use-measure";

export const useLocations = create(()=>({}))

/** Manually set a components destination
 * @export
 * @param {any} id
 * @param {LocationArray} location 
 * */
export function toLocation (id,location){ useLocations.setState({[id]:location}) }

export function useComponentDestiny(id, disableAuto=false) {
 const [ref, { left, top }, manual] = useMeasure({ debounce: 0 });
 useConsistentRerenders(manual)

 const imBeingDragged = useAmIGrabbed(id);
 useEffect(() => {
  if (imBeingDragged||disableAuto||(left === 0 && top === 0)) return;
  else toLocation(id, [left, top]);
 }, [id, left, top, imBeingDragged]);
 
 return [ref];
}

create(()=>{window.addEventListener('mousemove', function destineGrabbedCard (e) { 
 const grabbedCard = grabbedItem();
 if (!grabbedCard) return;
 toLocation( grabbedCard, [e.clientX,  e.clientY ] ) 
})})

// Rerendering
var refreshers = []
const rendering = create(()=>{ //this is inside a zustore to avoid double listeners
 function triggerRerender(){refreshers.forEach(r=>r());} 
 const debouncedRerender = debounce(triggerRerender, 0)
 debouncedRerender()
 useGrabbed.subscribe(debouncedRerender)
})
function useConsistentRerenders(manual){
 useEffect(() => {
  refreshers.push(manual)
  return ()=>{refreshers = refreshers.filter(r=>r!==manual)}
 },[])
}

//Types
/**
 * @typedef LocationArray
 * @type {array}
 * @property {number} 0 - left
 * @property {number} 1 - top
 */