import { useTrail } from "@react-spring/web";
import { create } from "zustand";
import { useEffect, useLayoutEffect } from "react";
import { useLocations } from "src/assets/useDestiny/Destination";
import { HookProxy } from "src/assets/ReactHax"; 


export const useStoredSprings = create(()=>({}))
export const useProxySpring = id=>useStoredSprings(s=>s[id])
const addSpring = state=>useStoredSprings.setState(state)



 

///////////////////////////////////// spring animation
// fiddle
const best = { mass: 3, tension: 3600, friction: 230, precision: 0.1};
const fast = { mass: 1, tension: 400, friction: 45, precision: 0.05, progress: 0.5};
// const fast = { tension: 1200, friction: 40 };
const slow = { mass: 10, tension: 200, friction: 50 };
var trailLength = 1 ;


const trans = (x, y) => `translate3d(${x}px,${y}px,0)`; //centered

function useSpringyVariable(b={left:0,top:0,width:0, height:0}, ) {
 const [trail, api] = useTrail(trailLength, (i) => ({
  xy: [b.left,b.top,b.width,b.height],  config: fast, }),[b, b.height, b.width]);
  let lastSpring = trail[trailLength-1];
 let final = { transform: lastSpring.xy.to(trans), width:lastSpring.xy.to((a,b,c)=>c), height:lastSpring.xy.to((a,b,c,d)=>d) };
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

