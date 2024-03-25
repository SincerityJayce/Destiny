import debounce from "lodash.debounce"
import { useState, useEffect, useRef } from "react";
import { create } from "zustand";



export function useGetDestinedComponents() {
 const [itemsToRender, render] = useState([]);
 useEffect(() => {
  const renderItems = debounce(function (state) {
   cleanUp(state)//unused
   let v = Object.entries(state)
   let items = v.sort((a, b) => a[0]-b[0]).map(([key, value]) => value)
   render(items);
  }, 5);
  renderItems(get());
  return useDestinedComponents.subscribe(renderItems);
 }, []);
 return itemsToRender;
}
function cleanUp(state){ //unused but might be a better lifecycle method
 Object.entries(state).forEach(([key,value])=>{if(value.cleanup){delete state[key]}})
 return state
}


export function useComponentRegistration(id,component){
 const {current} = useRef(uniqueId())

 useEffect(()=>{
  // let registrations = Object.entries(get())
  // var [oldKey,alreadyRegistered] = registrations.find(([key,existing])=>existing.id===id&&(key!==current))||[]//this is halfway code
  // if(alreadyRegistered){alreadyRegistered.cleanup=false}
  add({[current]:
   // alreadyRegistered||
   {id, componentKey:id,Component:(()=>component)}})
  return ()=>{remove(current)}
  return ()=>{add({[current]:{cleanup:true,...get()[current]}})}
 },[])
}

const useDestinedComponents = create(()=>({}))
const useDestinyPortals = create(()=>({})) 
const get = useDestinedComponents.getState
const add = (arg)=>{ useDestinedComponents.setState(arg) }
const remove = key=>{ useDestinedComponents.setState(s=>{s&&delete s[key]; return s}) }
var id = 0; function uniqueId(){return id++};
