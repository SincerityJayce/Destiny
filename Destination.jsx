import {useGrabbed, useAmIGrabbed} from 'grab';
import { cssUpdater } from './useCss';
import debounce from 'lodash.debounce';
import { create } from 'zustand';
import { useEffect } from "react";
import useMeasure from "react-use-measure";

export const useLocations = create(()=>({}))

const toLocation = (id,location)=>{ useLocations.setState({[id]:location}) }

const destineGrabbedCard = (e) => { 
 const grabbedCard = useGrabbed.getState().card;
 if (!grabbedCard) return;
 toLocation( grabbedCard, [e.clientX,  e.clientY ] ) }; 

create(()=>{window.addEventListener('mousemove', destineGrabbedCard);})

export function useComponentDestiny(id) {
 const [ref, bounds] = useMeasure({ debounce: 0 });
 var { left, top } = bounds;
 const imBeingDragged = useAmIGrabbed(id);

 useEffect(() => {
  if (imBeingDragged) return;
  if (left === 0 && top === 0) return;
  toLocation(id, [left, top]);

 }, [id, left, top, imBeingDragged]);
 
 return [ref, imBeingDragged];
}

const useRerenders = create(()=>{ //this is inside a zustore to avoid double listeners
 const i = 0.5
 var flickSize = i
 const flickerCss = cssUpdater()
 function triggerRerender(){
   const flick = ()=>{
    flickSize*= -1
    flickerCss('.subscribed-rerenders', //this class is added to the element that needs to be rerendered
    {width:i+flickSize, height:i+flickSize})
   }
   flick()
 }
 const debouncedRerender = debounce(triggerRerender, 0)
  
 debouncedRerender()
 useGrabbed.subscribe(debouncedRerender)
 window.addEventListener('mouseup', ()=>{setTimeout(()=>{(flickSize = 0.5)&&triggerRerender()},100);debouncedRerender()})
})




/////////////////////////////////////////  DESTINED ITEMS



