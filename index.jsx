import { useMemo } from "react"
import { SpringSimulators } from "src/assets/useDestiny/springAnimation";
import { animated } from "@react-spring/web";
import { useAmIGrabbed, grab } from "grab";

import { useStoredSprings } from "./springAnimation"
import { useComponentRegistration, useGetDestinedComponents } from "./DestinedComponents";
import { useComponentDestiny } from "./Destination";

export {toLocation} from "./Destination";

/**This div represents the location that the destined component would normally be rendered. 
 * It passes the component to be rendered elsewhere, within DesinedItems.
 *
 * @export
 * @param {{ id: any; children: React.ReactNode;  }} param0
 * @returns {JSX.Element}
 */
export function Destination ({id, children, disableAuto=false}){
 const [ref] = useComponentDestiny(id, disableAuto);
 let Kids=()=><>{children}</>

 useComponentRegistration(id, <Kids/>)
 // @ts-ignore
 return  <div ref={ref} style={{ pointerEvents:'none'}} ></div>
}

/**Renders all the dragable components
 * @export
 * @returns {JSX.Element}
 */
export function DestinedItems() {
 const itemsToRender = useGetDestinedComponents()

 return <>
 <SpringSimulators ids={useMemo(()=>itemsToRender.map(({componentKey})=>componentKey),[itemsToRender])}/>

 {itemsToRender.map(({componentKey,Component}) => <DestinyDiv key={"outer"+componentKey} id={componentKey}>
  {Component&&<Component />}
 </DestinyDiv>
 )}
 </>
}

function DestinyDiv({ id, children }) { // The springy movement is abstracted away here
 const springyMovement = useStoredSprings(s=>s[id])
 const unClickableWhileGrabbed = useAmIGrabbed(id) ? { pointerEvents: 'none' } : {};

 return <>{location && <animated.div style={{ ...unClickableWhileGrabbed, ...springyMovement, position:'absolute' }} 
  className='DESTINYDIV' onMouseDown={() => grab(id)}>
    {children}
 </animated.div>}</>;
}