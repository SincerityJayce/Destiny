import debounce from "lodash.debounce"
import { useState, useEffect, useRef } from "react";
import { create } from "zustand";


export function useGetDestinedComponents() {
 const [itemsToRender, render] = useState([]);
 useEffect(() => {
  const renderItems = debounce(function (state) {
   let items = Object.values(state).sort((a, b) => a.id - b.id);
   render(items);
  }, 5);
  renderItems(useDestinedComponents.getState());
  return useDestinedComponents.subscribe(renderItems);
 }, []);
 return itemsToRender;
}


export function useComponentRegistration(id,component){
 const {current} = useRef(uniqueId())
 
 useEffect(()=>{
  add({[current]:{id, componentKey:id,Component:()=>component}})
  return ()=>remove(current)
 },[])
}

const useDestinedComponents = create(()=>({}))
const add = (arg)=>{ useDestinedComponents.setState(arg) }
const remove = key=>{ useDestinedComponents.setState(s=>{s&&delete s[key]; return s}) }
var id = 0; function uniqueId(){return id++};
