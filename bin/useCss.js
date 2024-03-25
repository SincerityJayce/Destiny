import { useRef, useState, useEffect, useCallback } from "react";
import styleToCssString from "react-style-object-to-css";

export default function useCss(styleStateObject) {
 var[remembered] = useState({lastDocument:null, guid:"useCSS-"+generateLiteGuid()})

 const ref = useRef();
 useEffect(()=>{if (!ref||!ref.current) return; ref.current.id = remembered.guid}, [ref])
 const setCss = useCallback((styleObject)=>{
  let newDocument = appendToDom(css("#"+remembered.guid, styleObject))
  remembered.lastDocument?.remove();
  remembered.lastDocument = newDocument; 
 }, [remembered.guid])

 useEffect(()=>styleStateObject&&setCss&&setCss(styleStateObject), [styleStateObject])
 return [ref, setCss];
}

export function cssUpdater(ref = {}){
 return function(selector, styleObject) {
  let newDocument = appendToDom(css(selector, styleObject))
  ref.lastDocument?.remove();
  ref.lastDocument = newDocument;
 }
}

function css(selector, styleObject) {
 return newDocumentContaining(`${selector}{${styleToCssString(styleObject)}}`)
}
function cssFrom(styleObject) {
 let css = '';
 for (const property in styleObject) {
  const hyphenatedProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase(); //convert camelCase to hyphenated-case
  const value = styleObject[property];
  const roundedValue = typeof value === 'number' ? Math.round(value) : value;
  css += `${hyphenatedProperty}:${roundedValue};`;
 }
 return css;
}
const appendToDom = (element)=> {document.head.appendChild(element);return element}

const newDocumentContaining = (css)=> {
 const style = document.createElement('style');
 style.appendChild(document.createTextNode(css));
 return style;
}

function generateGuid (){
 const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  const r = Math.random() * 16 | 0,
   v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
 });
 return guid;
};
function generateLiteGuid() {
 const guid = 'xxxxxxxx'.replace(/[xy]/g, function(c) {
  const r = Math.random() * 16 | 0;
  const v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
 });
 return guid;
}