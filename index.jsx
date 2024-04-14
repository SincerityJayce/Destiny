// IN PORTAL
export function Destination ({id, children, disableAuto=false, ignore=[], ref, style, ...p}) { 
 useBirthRegistry(id, children)
 const [measureRef] = useComponentDestiny(id, {disableAuto,ignore});
 const mergedRef = el=>{measureRef(el);ref&&(typeof ref == "function"?ref(el):ref.current=el)}
 const mergedStyle = {...style, opacity:"0", pointerEvents:'none'}

 return <div ref={mergedRef} style={mergedStyle} {...p} >
  {children}
 </div>
}

// OUT PORTAL
export const DestinedItems =()=><> {useDestinedComponents().map((props) => 
<RenderedDestinyItem key={props.id} {...props}/> 
)} </>
const RenderedDestinyItem = memo(({id,Component=()=><></>})=><DestinyDiv  id={id}>
 <Component />
</DestinyDiv>) //these are external for performance
const DestinyDiv = ({ id, children }) => <animated.div style={{  ...useDestinyMovement(id), 
 pointerEvents:useAmIGrabbed(id)?'none':'auto',
 position:'absolute'}} 
 onMouseDown={() => grab(id)}>
 {children}
</animated.div>

// Force Component Positions to Update
export const remeasure = (ids) => { 
 (ids ? Array.from(ids).flat() : Object.values(remeasurers))
 .forEach(id => remeasurers[id] && remeasurers[id]());
};

/////////////////// Movement_Logic
const useStoredSprings = create(immer(()=>({}))), getSprings = useStoredSprings.getState

const moveObjectToDestination = (id,bounds)=>{ //IN
 const set = useStoredSprings.setState
 if (bounds.left && bounds.top) bounds.xy = [bounds.left, bounds.top]
 let springs = getSprings()[id]

 const triageSpringUpdate_OrCreateNewOne = ([styleProperty, value])=> {
  if(springs?.[styleProperty]) springs[styleProperty].start(value)
  else return [styleProperty, new SpringValue(value, {config: {mass: 3, tension: 1800, friction: 230, precision: 0.1}})]
 }
 let newSprings = Object.entries(bounds).map( triageSpringUpdate_OrCreateNewOne ).filter(t=>t)
 newSprings.length && set( s=>{ s[id]=s[id]||{}; newSprings.forEach(([styleProperty,spring])=>{s[id][styleProperty]=spring})})
}

function useDestinyMovement(id){ //OUT
 const storedSprings = useStoredSprings(s=>s[id])
 if(!storedSprings) return {}
 const styleObject = Object.entries(storedSprings).reduce((style,[variable,spring])=>{
  if(variable=="xy") style.transform = spring.to((l,t)=>`translate(${l}px,${t}px)`)
  if(["width","height"].includes(variable)) style[variable]=spring.to(w=>w)
  return style
 },{})
 return styleObject //style object, from springs 
}
/////////////////// StoredComponents
const useDestinedChildren = create(()=>({})), getComponents = useDestinedChildren.getState, set = useDestinedChildren.setState
var id = 0, advocate = s=>{const instance = id++;set({[instance]:s}); return ()=>set(s=>omit(s, [instance]),true)}
 
function useBirthRegistry(id,component){ //IN
 useLayoutEffect(()=>advocate({id, Component:(memo(()=>component))}),[])
}

function useDestinedComponents() { //OUT
 const [itemsToRender, render] = useState([]);
 useEffect(() => {
  const renderItems = debounce(s=>{render(Object.values(s));}, 5); renderItems(getComponents());
 return useDestinedChildren.subscribe(renderItems)}, []);
 return itemsToRender;
}

/////////////////// StoredDestinations
function useComponentDestiny(id, {disableAuto=false, ignore=[]}) { // locate inside divs
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

window.addEventListener('mousemove', function destineGrabbedItem (e) { // click and drag
 const grabbedCard = grabbedItem(); if (!grabbedCard) return;
 let activeSprings = getSprings()[grabbedCard]; if (!activeSprings) return;
 let {width,height} = {width:activeSprings.width.animation.to, height:activeSprings.height.animation.to}
 moveObjectToDestination( grabbedCard, {left:e.clientX-width/2,  top:e.clientY-height/2} ) 
})
 /////////////////// Remeasure_Trigger 
var remeasurers = {};
function useManualRemeasures(manual, id) {
 useEffect(() => {
  remeasurers[id] = (debounce(manual, 0));
  return () => { delete remeasurers[id]; };
 }, [manual, id]);
}
 