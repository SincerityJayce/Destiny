import { useTrail } from "@react-spring/web";
import { create } from "zustand";
import { useEffect } from "react";
import { useLocations } from "src/assets/useDestiny/Destination";
import { HookProxy } from "src/assets/ReactHax";


export const useStoredSprings = create(()=>({}))

export const useProxySpring = id=>useStoredSprings(s=>s[id])
const addSpring = state=>useStoredSprings.setState(state)
///////////////////////////////////// spring animation
const best = { mass: 3, tension: 3600, friction: 230, precision: 0.1};
const fast = { mass: 1, tension: 400, friction: 45, precision: 0.05, progress: 0.5};
// const fast = { tension: 1200, friction: 40 };
const slow = { mass: 10, tension: 200, friction: 50 };
const trans = (x, y) => `translate3d(${x}px,${y}px,0)`; //centered
 
var trailLength = 1 ;
function useSpringyVariable(coords=[0,0]) {
 const [trail, api] = useTrail(trailLength, (i) => ({
  xy: coords,
  config: fast,
 }));
 useEffect(() => { api.start({ xy: coords }); }, coords); 
 let final = { transform: trail[trailLength-1].xy.to(trans) };
 return final; 
}

function useSpringStorage(id){
 const trail = useSpringyVariable(useLocations(s=>s[id]));
 useEffect(()=>addSpring({[id]:trail}),[id,trail.transform])
}

export function SpringSimulators({ids}){
 return <>{ids.map(id=>
 <HookProxy key={"proxyspring"+id} useHook={()=>useSpringStorage(id)}/>
 )}</>
}

