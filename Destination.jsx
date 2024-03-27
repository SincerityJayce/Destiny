import {useGrabbed, useAmIGrabbed, grabbedItem} from 'grab';
import debounce from 'lodash.debounce';
import { create } from 'zustand';
import { useEffect, useLayoutEffect, useRef } from "react";
import useMeasure from "react-use-measure";

export const useLocations = create(()=>({}))

/** Manually set a components destination
 * @export
 * @param {any} id
 * @param {Bounds} location 
 * */
export function toLocation (id,location){ useLocations.setState(s=>({[id]:{...s[id],...location}})) }

export function useComponentDestiny(id, {disableAuto=false,only=undefined, ignore=[]}) {
 const [ref, bounds , manual] = useMeasure({ debounce: 0 });
 var mutableBounds= {...bounds}
 useConsistentRerenders(manual)

 const imBeingDragged = useAmIGrabbed(id);
 useLayoutEffect(() => {
  if (imBeingDragged||disableAuto||(bounds.left === 0 && bounds.top === 0)) return;
  

  
  else {ignore.forEach(i=>delete mutableBounds[i]);console.log(mutableBounds);toLocation(id, mutableBounds);}
 }, [id, bounds, imBeingDragged]);
 
 return [ref];
}

create(()=>{window.addEventListener('mousemove', function destineGrabbedCard (e) { 
 const grabbedCard = grabbedItem();
 if (!grabbedCard) return;
 toLocation( grabbedCard, {left:e.clientX,  top:e.clientY } ) 
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
 * 
 * 
 * @typedef Bounds
 * @type {object}
 * @property {number} left
 * @property {number} top
 * @property {number} right
 * @property {number} bottom
 * @property {number} width
 * @property {number} height
 */

