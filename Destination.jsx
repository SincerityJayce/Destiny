import {useGrabbed, useAmIGrabbed} from 'grab';
import debounce from 'lodash.debounce';
import { create } from 'zustand';
import { useEffect } from "react";
import useMeasure from "react-use-measure";

export const useLocations = create(()=>({}))

export const toLocation = (id,location)=>{ useLocations.setState({[id]:location}) }

const destineGrabbedCard = (e) => { 
 const grabbedCard = useGrabbed.getState().card;
 if (!grabbedCard) return;
 toLocation( grabbedCard, [e.clientX,  e.clientY ] ) }; 

create(()=>{window.addEventListener('mousemove', destineGrabbedCard);})

export function useComponentDestiny(id, disableAuto=false) {
 const [ref, bounds, manual] = useMeasure({ debounce: 0 });

 useEffect(() => {
  refreshers.push(manual)
  return ()=>{refreshers = refreshers.filter(r=>r!==manual)}
 })

 var { left, top } = bounds;
 const imBeingDragged = useAmIGrabbed(id);

 useEffect(() => {
  if (imBeingDragged) return;
  if (left === 0 && top === 0) return;
  if (disableAuto) return;
  console.log(ref.current)
  toLocation(id, [left, top]);

 }, [id, left, top, imBeingDragged]);
 
 return [ref, imBeingDragged];
}


var refreshers = []
const useRerenders = create(()=>{ //this is inside a zustore to avoid double listeners
 function triggerRerender(){refreshers.forEach(r=>r());} 
 const debouncedRerender = debounce(triggerRerender, 0)
 debouncedRerender()
 useGrabbed.subscribe(debouncedRerender)
})




/////////////////////////////////////////  DESTINED ITEMS



