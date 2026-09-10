module.exports=[54799,(a,b,c)=>{b.exports=a.x("crypto",()=>require("crypto"))},79594,(a,b,c)=>{b.exports=a.x("dns",()=>require("dns"))},27699,(a,b,c)=>{b.exports=a.x("events",()=>require("events"))},22734,(a,b,c)=>{b.exports=a.x("fs",()=>require("fs"))},21517,(a,b,c)=>{b.exports=a.x("http",()=>require("http"))},25328,(a,b,c)=>{b.exports=a.x("http2",()=>require("http2"))},4446,(a,b,c)=>{b.exports=a.x("net",()=>require("net"))},46786,(a,b,c)=>{b.exports=a.x("os",()=>require("os"))},14747,(a,b,c)=>{b.exports=a.x("path",()=>require("path"))},5365,(a,b,c)=>{b.exports=a.x("process",()=>require("process"))},88947,(a,b,c)=>{b.exports=a.x("stream",()=>require("stream"))},55004,(a,b,c)=>{b.exports=a.x("tls",()=>require("tls"))},92509,(a,b,c)=>{b.exports=a.x("url",()=>require("url"))},24361,(a,b,c)=>{b.exports=a.x("util",()=>require("util"))},6461,(a,b,c)=>{b.exports=a.x("zlib",()=>require("zlib"))},8191,53653,47664,7663,70707,2542,89603,a=>{"use strict";var b=a.i(5001);a.s(["onAuthStateChanged",()=>b._],8191),a.s(["GoogleAuthProvider",()=>b.f],53653),a.s(["signInWithPopup",()=>b.ai],47664),a.s(["signOut",()=>b.ak],7663),a.s(["signInWithEmailAndPassword",()=>b.af],70707),a.s(["createUserWithEmailAndPassword",()=>b.x],2542),a.s(["updateProfile",()=>b.aq],89603)},49911,a=>{"use strict";var b=a.i(4745);a.s(["serverTimestamp",()=>b.bd])},79380,a=>{"use strict";var b=a.i(4745);a.s(["doc",()=>b.t])},90864,a=>{"use strict";var b=a.i(72131);let c=(...a)=>a.filter((a,b,c)=>!!a&&""!==a.trim()&&c.indexOf(a)===b).join(" ").trim(),d={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},e=(0,b.createContext)({}),f=(0,b.forwardRef)(({color:a,size:f,width:g,height:h,strokeWidth:i,absoluteStrokeWidth:j,nonScalingStroke:k,className:l="",children:m,iconNode:n=[],icon:o={node:n,aliases:[],size:24},...p},q)=>{let{size:r=24,strokeWidth:s=2,absoluteStrokeWidth:t=!1,nonScalingStroke:u=!1,color:v="currentColor",className:w=""}=(0,b.useContext)(e)??{},x=!!m||(a=>{for(let b in a)if(b.startsWith("aria-")||"role"===b||"title"===b)return!0;return!1})(p),[y,z,A=[]]=function(a,b={}){return function(a,b={}){let e=b.attributeNames??{},f=a=>e[a]??a,g=a.size??a.width??d.width,h=a.size??a.height??d.height,i=a.aliases?.filter(a=>"string"==typeof a&&""!==a.trim()).map(a=>`lucide-${a}`)??[],j=[...a.name?[`lucide-${a.name}`]:[],...i],k=b.className?.split(" ").filter(Boolean)??[],l=!1===b.includeDefaultClasses?c(...k):c("lucide",...j,...k),m=b.absoluteStrokeWidth?Number(b.strokeWidth??d["stroke-width"])*Number(a.size??a.width??d.width)/Number(b.size??b.width??d.width):b.strokeWidth??d["stroke-width"];return["svg",{...Object.entries(d).reduce((a,[b,c])=>(a[f(b)]=c,a),{}),..."color"in b&&b.color&&{[f("stroke")]:b.color},..."size"in b&&null!=b.size&&{[f("width")]:b.size,[f("height")]:b.size},..."width"in b&&null!=b.width&&{[f("width")]:b.width},..."height"in b&&null!=b.height&&{[f("height")]:b.height},[f("stroke-width")]:m,...l&&{[f("class")]:l},[f("viewBox")]:`0 0 ${g} ${h}`,...!1===b.hasA11yProp?{[f("aria-hidden")]:"true"}:{},..."attributes"in b&&b.attributes},a.node.map(a=>{let[c,d,e]=a,g=b.nonScalingStroke?{[f("vector-effect")]:"non-scaling-stroke",...d}:d;return e?[c,g,e]:[c,g]})]}(a,{...b,attributeNames:{...b.attributeNames,class:"className","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-linejoin":"strokeLinejoin","vector-effect":"vectorEffect"}})}(o,{color:a??v,width:g??f??r,height:h??f??r,strokeWidth:i??s,absoluteStrokeWidth:j??t,nonScalingStroke:k??u,className:c(w,l),hasA11yProp:x,attributes:p});return(0,b.createElement)(y,{ref:q,...z},[...A.map(([a,c])=>(0,b.createElement)(a,c)),...Array.isArray(m)?m:[m]])});a.s(["default",0,f],90864)},64831,a=>{"use strict";var b=a.i(72131),c=a.i(90864);a.s(["default",0,function(a,d=[],e=[]){let f,g="string"==typeof a?function(a,b,c=[]){if(null==b)throw Error("[lucide]: iconNode is required when icon name is used");return{name:a?.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),size:24,node:b,...c.length>0?{aliases:c}:{}}}(a,d,e):a,h=(0,b.forwardRef)(({className:a,...d},e)=>(0,b.createElement)(c.default,{ref:e,icon:g,className:a,...d}));return g.name&&(h.displayName=(f=(a=>{let b="",c=!1;for(let d of a){if("-"===d||"_"===d||d<=" "){c=b.length>0;continue}0===b.length?b+=d.toLowerCase():b+=c?d.toUpperCase():d,c=!1}return b})(g.name)).charAt(0).toUpperCase()+f.slice(1)),h}],64831)},6704,a=>{"use strict";let b,c;var d,e=a.i(72131);let f={data:""},g=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,h=/\/\*[^]*?\*\/|  +/g,i=/\n+/g,j=(a,b)=>{let c="",d="",e="";for(let f in a){let g=a[f];"@"==f[0]?"i"==f[1]?c=f+" "+g+";":d+="f"==f[1]?j(g,f):f+"{"+j(g,"k"==f[1]?"":b)+"}":"object"==typeof g?d+=j(g,b?b.replace(/([^,])+/g,a=>f.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,b=>/&/.test(b)?b.replace(/&/g,a):a?a+" "+b:b)):f):null!=g&&(f="-"==f[1]?f:f.replace(/[A-Z]/g,"-$&").toLowerCase(),e+=j.p?j.p(f,g):f+":"+g+";")}return c+(b&&e?b+"{"+e+"}":e)+d},k={},l=a=>{if("object"==typeof a){let b="";for(let c in a)b+=c+l(a[c]);return b}return a};function m(a){let b,c,d=this||{},e=a.call?a(d.p):a;return((a,b,c,d,e)=>{var f;let m=l(a),n=k[m]||(k[m]=(a=>{let b=0,c=11;for(;b<a.length;)c=101*c+a.charCodeAt(b++)>>>0;return"go"+c})(m));if(!k[n]){let b=m!==a?a:(a=>{let b,c,d=[{}];for(;b=g.exec(a.replace(h,""));)b[4]?d.shift():b[3]?(c=b[3].replace(i," ").trim(),d.unshift(d[0][c]=d[0][c]||{})):d[0][b[1]]=b[2].replace(i," ").trim();return d[0]})(a);k[n]=j(e?{["@keyframes "+n]:b}:b,c?"":"."+n)}let o=c&&k.g;return c&&(k.g=k[n]),f=k[n],o?b.data=b.data.replace(o,f):-1===b.data.indexOf(f)&&(b.data=d?f+b.data:b.data+f),n})(e.unshift?e.raw?(b=[].slice.call(arguments,1),c=d.p,e.reduce((a,d,e)=>{let f=b[e];if(f&&f.call){let a=f(c),b=a&&a.props&&a.props.className||/^go/.test(a)&&a;f=b?"."+b:a&&"object"==typeof a?a.props?"":j(a,""):!1===a?"":a}return a+d+(null==f?"":f)},"")):e.reduce((a,b)=>Object.assign(a,b&&b.call?b(d.p):b),{}):e,d.target||f,d.g,d.o,d.k)}m.bind({g:1});let n,o,p,q=m.bind({k:1});function r(a,b){let c=this||{};return function(){let d=arguments;function e(f,g){let h=Object.assign({},f),i=h.className||e.className;c.p=Object.assign({theme:o&&o()},h),c.o=/go\d/.test(i),h.className=m.apply(c,d)+(i?" "+i:""),b&&(h.ref=g);let j=a;return a[0]&&(j=h.as||a,delete h.as),p&&j[0]&&p(h),n(j,h)}return b?b(e):e}}var s=(a,b)=>"function"==typeof a?a(b):a,t=(b=0,()=>(++b).toString()),u="default",v=(a,b)=>{let{toastLimit:c}=a.settings;switch(b.type){case 0:return{...a,toasts:[b.toast,...a.toasts].slice(0,c)};case 1:return{...a,toasts:a.toasts.map(a=>a.id===b.toast.id?{...a,...b.toast}:a)};case 2:let{toast:d}=b;return v(a,{type:+!!a.toasts.find(a=>a.id===d.id),toast:d});case 3:let{toastId:e}=b;return{...a,toasts:a.toasts.map(a=>a.id===e||void 0===e?{...a,dismissed:!0,visible:!1}:a)};case 4:return void 0===b.toastId?{...a,toasts:[]}:{...a,toasts:a.toasts.filter(a=>a.id!==b.toastId)};case 5:return{...a,pausedAt:b.time};case 6:let f=b.time-(a.pausedAt||0);return{...a,pausedAt:void 0,toasts:a.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+f}))}}},w=[],x={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},y={},z=(a,b=u)=>{y[b]=v(y[b]||x,a),w.forEach(([a,c])=>{a===b&&c(y[b])})},A=a=>Object.keys(y).forEach(b=>z(a,b)),B=(a=u)=>b=>{z(b,a)},C={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=a=>(b,c)=>{let d,e=((a,b="blank",c)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:b,ariaProps:{role:"status","aria-live":"polite"},message:a,pauseDuration:0,...c,id:(null==c?void 0:c.id)||t()}))(b,a,c);return B(e.toasterId||(d=e.id,Object.keys(y).find(a=>y[a].toasts.some(a=>a.id===d))))({type:2,toast:e}),e.id},E=(a,b)=>D("blank")(a,b);E.error=D("error"),E.success=D("success"),E.loading=D("loading"),E.custom=D("custom"),E.dismiss=(a,b)=>{let c={type:3,toastId:a};b?B(b)(c):A(c)},E.dismissAll=a=>E.dismiss(void 0,a),E.remove=(a,b)=>{let c={type:4,toastId:a};b?B(b)(c):A(c)},E.removeAll=a=>E.remove(void 0,a),E.promise=(a,b,c)=>{let d=E.loading(b.loading,{...c,...null==c?void 0:c.loading});return"function"==typeof a&&(a=a()),a.then(a=>{let e=b.success?s(b.success,a):void 0;return e?E.success(e,{id:d,...c,...null==c?void 0:c.success}):E.dismiss(d),a}).catch(a=>{let e=b.error?s(b.error,a):void 0;e?E.error(e,{id:d,...c,...null==c?void 0:c.error}):E.dismiss(d)}),a};var F=1e3,G=q`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,H=q`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,I=q`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,J=r("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${G} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${H} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${a=>a.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${I} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,K=q`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,L=r("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${a=>a.secondary||"#e0e0e0"};
  border-right-color: ${a=>a.primary||"#616161"};
  animation: ${K} 1s linear infinite;
`,M=q`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,N=q`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,O=r("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${M} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${N} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${a=>a.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,P=r("div")`
  position: absolute;
`,Q=r("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,R=q`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,S=r("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${R} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,T=({toast:a})=>{let{icon:b,type:c,iconTheme:d}=a;return void 0!==b?"string"==typeof b?e.createElement(S,null,b):b:"blank"===c?null:e.createElement(Q,null,e.createElement(L,{...d}),"loading"!==c&&e.createElement(P,null,"error"===c?e.createElement(J,{...d}):e.createElement(O,{...d})))},U=r("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,V=r("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,W=e.memo(({toast:a,position:b,style:d,children:f})=>{let g=a.height?((a,b)=>{let d=a.includes("top")?1:-1,[e,f]=c?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*d}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*d}%,-1px) scale(.6); opacity:0;}
`];return{animation:b?`${q(e)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${q(f)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(a.position||b||"top-center",a.visible):{opacity:0},h=e.createElement(T,{toast:a}),i=e.createElement(V,{...a.ariaProps},s(a.message,a));return e.createElement(U,{className:a.className,style:{...g,...d,...a.style}},"function"==typeof f?f({icon:h,message:i}):e.createElement(e.Fragment,null,h,i))});d=e.createElement,j.p=void 0,n=d,o=void 0,p=void 0;var X=({id:a,className:b,style:c,onHeightUpdate:d,children:f})=>{let g=e.useCallback(b=>{if(b){let c=()=>{d(a,b.getBoundingClientRect().height)};c(),new MutationObserver(c).observe(b,{subtree:!0,childList:!0,characterData:!0})}},[a,d]);return e.createElement("div",{ref:g,className:b,style:c},f)},Y=m`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;a.s(["Toaster",0,({reverseOrder:a,position:b="top-center",toastOptions:d,gutter:f,children:g,toasterId:h,containerStyle:i,containerClassName:j})=>{let{toasts:k,handlers:l}=((a,b="default")=>{let{toasts:c,pausedAt:d}=((a={},b=u)=>{let[c,d]=(0,e.useState)(y[b]||x),f=(0,e.useRef)(y[b]);(0,e.useEffect)(()=>(f.current!==y[b]&&d(y[b]),w.push([b,d]),()=>{let a=w.findIndex(([a])=>a===b);a>-1&&w.splice(a,1)}),[b]);let g=c.toasts.map(b=>{var c,d,e;return{...a,...a[b.type],...b,removeDelay:b.removeDelay||(null==(c=a[b.type])?void 0:c.removeDelay)||(null==a?void 0:a.removeDelay),duration:b.duration||(null==(d=a[b.type])?void 0:d.duration)||(null==a?void 0:a.duration)||C[b.type],style:{...a.style,...null==(e=a[b.type])?void 0:e.style,...b.style}}});return{...c,toasts:g}})(a,b),f=(0,e.useRef)(new Map).current,g=(0,e.useCallback)((a,b=F)=>{if(f.has(a))return;let c=setTimeout(()=>{f.delete(a),h({type:4,toastId:a})},b);f.set(a,c)},[]);(0,e.useEffect)(()=>{if(d)return;let a=Date.now(),e=c.map(c=>{if(c.duration===1/0)return;let d=(c.duration||0)+c.pauseDuration-(a-c.createdAt);if(d<0){c.visible&&E.dismiss(c.id);return}return setTimeout(()=>E.dismiss(c.id,b),d)});return()=>{e.forEach(a=>a&&clearTimeout(a))}},[c,d,b]);let h=(0,e.useCallback)(B(b),[b]),i=(0,e.useCallback)(()=>{h({type:5,time:Date.now()})},[h]),j=(0,e.useCallback)((a,b)=>{h({type:1,toast:{id:a,height:b}})},[h]),k=(0,e.useCallback)(()=>{d&&h({type:6,time:Date.now()})},[d,h]),l=(0,e.useCallback)((a,b)=>{let{reverseOrder:d=!1,gutter:e=8,defaultPosition:f}=b||{},g=c.filter(b=>(b.position||f)===(a.position||f)&&b.height),h=g.findIndex(b=>b.id===a.id),i=g.filter((a,b)=>b<h&&a.visible).length;return g.filter(a=>a.visible).slice(...d?[i+1]:[0,i]).reduce((a,b)=>a+(b.height||0)+e,0)},[c]);return(0,e.useEffect)(()=>{c.forEach(a=>{if(a.dismissed)g(a.id,a.removeDelay);else{let b=f.get(a.id);b&&(clearTimeout(b),f.delete(a.id))}})},[c,g]),{toasts:c,handlers:{updateHeight:j,startPause:i,endPause:k,calculateOffset:l}}})(d,h);return e.createElement("div",{"data-rht-toaster":h||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...i},className:j,onMouseEnter:l.startPause,onMouseLeave:l.endPause},k.map(d=>{let h,i,j=d.position||b,k=l.calculateOffset(d,{reverseOrder:a,gutter:f,defaultPosition:b}),m=(h=j.includes("top"),i=j.includes("center")?{justifyContent:"center"}:j.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:c?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${k*(h?1:-1)}px)`,...h?{top:0}:{bottom:0},...i});return e.createElement(X,{id:d.id,key:d.id,onHeightUpdate:l.updateHeight,className:d.visible?Y:"",style:m},"custom"===d.type?s(d.message,d):g?g(d):e.createElement(W,{toast:d,position:j}))}))},"default",0,E],6704)},60026,a=>{"use strict";var b=a.i(87924),c=a.i(72131);a.i(30485);var d=a.i(8191),e=a.i(53653),f=a.i(47664),g=a.i(7663),h=a.i(70707),i=a.i(2542),j=a.i(89603);a.i(69387);var k=a.i(79380),l=a.i(1787),m=a.i(49911),n=a.i(16121);let o=(0,c.createContext)({});a.s(["AuthProvider",0,function({children:a}){let[p,q]=(0,c.useState)(null),[r,s]=(0,c.useState)(null),[t,u]=(0,c.useState)(!0);(0,c.useEffect)(()=>{let a=null,b=(0,d.onAuthStateChanged)(n.auth,async b=>{if(q(b),b){let c=(0,k.doc)(n.db,"users",b.uid);a=(0,l.onSnapshot)(c,async a=>{if(a.exists())s(a.data()),u(!1);else{let a={uid:b.uid,email:b.email,displayName:b.displayName,photoURL:b.photoURL,role:"user",createdAt:(0,m.serverTimestamp)(),lastLogin:(0,m.serverTimestamp)()};await (0,l.setDoc)(c,a),s(a),u(!1)}})}else s(null),u(!1),a&&a()});return()=>{b(),a&&a()}},[]);let v=async()=>{let a=new e.GoogleAuthProvider;try{await (0,f.signInWithPopup)(n.auth,a)}catch(a){throw console.error("Login failed:",a),a}},w=async(a,b)=>{try{await (0,h.signInWithEmailAndPassword)(n.auth,a,b)}catch(a){throw console.error("Login with email failed:",a),a}},x=async(a,b,c)=>{try{let d=await (0,i.createUserWithEmailAndPassword)(n.auth,b,c);await (0,j.updateProfile)(d.user,{displayName:a,photoURL:`https://ui-avatars.com/api/?name=${encodeURIComponent(a)}`})}catch(a){throw console.error("Signup failed:",a),a}};return(0,b.jsx)(o.Provider,{value:{user:p,dbUser:r,loading:t,loginWithGoogle:v,loginWithEmail:w,signupWithEmail:x,logout:()=>(0,g.signOut)(n.auth)},children:a})},"useAuth",0,()=>(0,c.useContext)(o)])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__10ll_9o._.js.map