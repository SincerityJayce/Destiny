const useDestinedChildren = create(()=>({})), get = useDestinedChildren.getState, set = useDestinedChildren.setState
var id = 0, advocate = s=>{const instance = id++;set({[instance]:s}); return ()=>set(s=>omit(s, [instance]),true)}
 
 
export function useDestinedComponents() {
 const [itemsToRender, render] = useState([]);
 useEffect(() => {
  const renderItems = debounce(s=>{render(Object.values(s));}, 5); renderItems(get());
 return useDestinedChildren.subscribe(renderItems)}, []);
 return itemsToRender;
}

export function useBirthRegistry(id,component){
 useLayoutEffect(()=>advocate({id, Component:(memo(()=>component))}),[])
}

 