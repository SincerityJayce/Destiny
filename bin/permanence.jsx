import {create} from "zustand";
import { immer } from 'zustand/middleware/immer'

import { useEffect, useRef, useState} from "react";
import { createPortal } from "react-dom";
import { useSubscription } from "../zusHooks";
// import { act, render } from 'react-nil' //uninstall this package, unless its part of zustand

//This was an experiment that only half worked

 

const useForeverStore = create(immer(() => { return { }}))
const get = useForeverStore.getState
const register = (id,component)=>useForeverStore.setState({[id]:component})
const thisIdIsntRegistered = id=>!get()[id]
const changeParent = (id,newParent)=>useForeverStore.setState(s=>{s[id].parent=newParent;return s})
export const remove = (...ids)=>{ids.forEach(key=>useForeverStore.setState(s=>{s&&delete s[key]; return s}))}


/**
 * Add to the top of your app.
 * This components holds all the components that are meant to be rendered forever.
 * @export
 * @returns {JSX.Element}
 */
export function Eternity(){ 
 const itemsToRender = useSubscription(useForeverStore, s=>Object.entries(s).map(([key,value])=>({key, ...value})))
 console.log('itemsToRender', itemsToRender)

 const backup = useRef(null)
 return <div ref={backup} style={{display:'none', height:0,width:0,overflow:'hidden', opacity:0, pointerEvents:'none'}}>
  {itemsToRender.map(({PermanentlyRenderedComponent,parent,key}) => <>
   {createPortal(<PermanentlyRenderedComponent/>,parent||backup.current||document.body, key)}
  </>  
  )}
 </div>
}


export function Permanence({id,children}){
 const Children = ()=><>{children}</>
  if (thisIdIsntRegistered(id)) register(id, {PermanentlyRenderedComponent:()=><Children/>})

  const perentDetector = useParent(id)

  return <div ref={perentDetector} style={{display:"none"}}></div>
}


function useParent(id) {
 const ref = useRef(null);
 useEffect(() => {
  ref.current && changeParent(id, ref.current.parentNode);
 }, [ref.current, ref.current?.parentNode]);
 return ref;
}


export function TestCounter() {
 const [count, setCount] = useState(0);
 useEffect(() => {
  const interval = setInterval(() => {
   setCount(prevCount => prevCount + 1);
   console.log('count', count)
  }, 200);
  return () => clearInterval(interval);
 }, [])
 return <>{count}</>;
}
