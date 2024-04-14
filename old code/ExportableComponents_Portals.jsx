import { useDestinyMovement } from "./Movement_Logic"
import { useBirthRegistry, useDestinedComponents } from "./StoredComponents";
import { useComponentDestiny} from "./StoredDestinations";


// IN PORTAL
export function Destination ({id, children, disableAuto=false, ignore=[], ref, style, ...p}) { //rewrite this to be animated.div that recieves all props
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

