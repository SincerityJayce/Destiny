import { moveObjectToDestination, useStoredSprings } from './Movement_Logic';
import { useManualRemeasures } from './Remeasure_Handle';

export function useComponentDestiny(id, {disableAuto=false, ignore=[]}) {
 const [measureRef, bounds , manual] = useMeasure({ debounce: 0 });
 useManualRemeasures(manual,id)
 const imBeingDragged = useAmIGrabbed(id);
 useLayoutEffect(() => {
  if (imBeingDragged||disableAuto||bounds.left==0&&bounds.top==0) return;
  var mutableBounds= {...bounds}
  ignore.forEach(i=>delete mutableBounds[i]);
  moveObjectToDestination(id, mutableBounds);
 }, [id, bounds]);
 return [measureRef];
}

window.addEventListener('mousemove', function destineGrabbedItem (e) { 
 const grabbedCard = grabbedItem(); if (!grabbedCard) return;
 let activeSprings = useStoredSprings.getState()[grabbedCard]; if (!activeSprings) return;
 let {width,height} = {width:activeSprings.width.animation.to, height:activeSprings.height.animation.to}
 moveObjectToDestination( grabbedCard, {left:e.clientX-width/2,  top:e.clientY-height/2} ) 
})


