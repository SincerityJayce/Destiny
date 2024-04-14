export const useStoredSprings = create(immer(()=>({}))), get = useStoredSprings.getState

export const moveObjectToDestination = (id,bounds)=>{
 const set = useStoredSprings.setState
 if (bounds.left && bounds.top) bounds.xy = [bounds.left, bounds.top]
 let springs = get()[id]

 const triageSpringUpdate_OrCreateNewOne = ([styleProperty, value])=> {
  if(springs?.[styleProperty]) springs[styleProperty].start(value)
  else return [styleProperty, new SpringValue(value, {config: {mass: 3, tension: 1800, friction: 230, precision: 0.1}})]
 }
 let newSprings = Object.entries(bounds).map( triageSpringUpdate_OrCreateNewOne ).filter(t=>t)
 newSprings.length && set( s=>{ s[id]=s[id]||{}; newSprings.forEach(([styleProperty,spring])=>{s[id][styleProperty]=spring})})
}

export function useDestinyMovement(id){ //style object, from springs
 const storedSprings = useStoredSprings(s=>s[id])
 if(!storedSprings) return {}
 const styleObject = Object.entries(storedSprings).reduce((style,[variable,spring])=>{
  if(variable=="xy") style.transform = spring.to((l,t)=>`translate(${l}px,${t}px)`)
  if(["width","height"].includes(variable)) style[variable]=spring.to(w=>w)
  return style
 },{})
 return styleObject
}