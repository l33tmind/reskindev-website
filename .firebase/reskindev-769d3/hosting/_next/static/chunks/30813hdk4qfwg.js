(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,3345,6100,52246,51984,28583,22633,6516,e=>{"use strict";var t=e.i(35020);e.s(["onAuthStateChanged",()=>t._],3345),e.s(["GoogleAuthProvider",()=>t.f],6100),e.s(["signInWithPopup",()=>t.ai],52246),e.s(["signOut",()=>t.ak],51984),e.s(["signInWithEmailAndPassword",()=>t.af],28583),e.s(["createUserWithEmailAndPassword",()=>t.x],22633),e.s(["updateProfile",()=>t.aq],6516)},33710,e=>{"use strict";var t=e.i(99917);e.s(["serverTimestamp",()=>t.b0])},2361,e=>{"use strict";var t=e.i(99917);e.s(["doc",()=>t.v])},5014,e=>{"use strict";var t=e.i(71645);let r=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim(),a={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},o=(0,t.createContext)({}),n=(0,t.forwardRef)(({color:e,size:n,width:i,height:l,strokeWidth:s,absoluteStrokeWidth:u,nonScalingStroke:d,className:c="",children:f,iconNode:p=[],icon:m={node:p,aliases:[],size:24},...h},y)=>{let{size:g=24,strokeWidth:b=2,absoluteStrokeWidth:v=!1,nonScalingStroke:x=!1,color:P="currentColor",className:_=""}=(0,t.useContext)(o)??{},j=!!f||(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(h),[w,O,C=[]]=function(e,t={}){return function(e,t={}){let o=t.attributeNames??{},n=e=>o[e]??e,i=e.size??e.width??a.width,l=e.size??e.height??a.height,s=e.aliases?.filter(e=>"string"==typeof e&&""!==e.trim()).map(e=>`lucide-${e}`)??[],u=[...e.name?[`lucide-${e.name}`]:[],...s],d=t.className?.split(" ").filter(Boolean)??[],c=!1===t.includeDefaultClasses?r(...d):r("lucide",...u,...d),f=t.absoluteStrokeWidth?Number(t.strokeWidth??a["stroke-width"])*Number(e.size??e.width??a.width)/Number(t.size??t.width??a.width):t.strokeWidth??a["stroke-width"];return["svg",{...Object.entries(a).reduce((e,[t,r])=>(e[n(t)]=r,e),{}),..."color"in t&&t.color&&{[n("stroke")]:t.color},..."size"in t&&null!=t.size&&{[n("width")]:t.size,[n("height")]:t.size},..."width"in t&&null!=t.width&&{[n("width")]:t.width},..."height"in t&&null!=t.height&&{[n("height")]:t.height},[n("stroke-width")]:f,...c&&{[n("class")]:c},[n("viewBox")]:`0 0 ${i} ${l}`,...!1===t.hasA11yProp?{[n("aria-hidden")]:"true"}:{},..."attributes"in t&&t.attributes},e.node.map(e=>{let[r,a,o]=e,i=t.nonScalingStroke?{[n("vector-effect")]:"non-scaling-stroke",...a}:a;return o?[r,i,o]:[r,i]})]}(e,{...t,attributeNames:{...t.attributeNames,class:"className","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-linejoin":"strokeLinejoin","vector-effect":"vectorEffect"}})}(m,{color:e??P,width:i??n??g,height:l??n??g,strokeWidth:s??b,absoluteStrokeWidth:u??v,nonScalingStroke:d??x,className:r(_,c),hasA11yProp:j,attributes:h});return(0,t.createElement)(w,{ref:y,...O},[...C.map(([e,r])=>(0,t.createElement)(e,r)),...Array.isArray(f)?f:[f]])});e.s(["default",0,n],5014)},56420,e=>{"use strict";var t=e.i(71645),r=e.i(5014);e.s(["default",0,function(e,a=[],o=[]){let n,i="string"==typeof e?function(e,t,r=[]){if(null==t)throw Error("[lucide]: iconNode is required when icon name is used");return{name:e?.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),size:24,node:t,...r.length>0?{aliases:r}:{}}}(e,a,o):e,l=(0,t.forwardRef)(({className:e,...a},o)=>(0,t.createElement)(r.default,{ref:o,icon:i,className:e,...a}));return i.name&&(l.displayName=(n=(e=>{let t="",r=!1;for(let a of e){if("-"===a||"_"===a||a<=" "){r=t.length>0;continue}0===t.length?t+=a.toLowerCase():t+=r?a.toUpperCase():a,r=!1}return t})(i.name)).charAt(0).toUpperCase()+n.slice(1)),l}],56420)},28298,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useRouterBFCache",{enumerable:!0,get:function(){return o}});let a=e.r(71645);function o(e,t,r){let[o,n]=(0,a.useState)(()=>({tree:e,cacheNode:t,stateKey:r,next:null}));if(o.tree===e)return o;let i={tree:e,cacheNode:t,stateKey:r,next:null},l=1,s=o,u=i;for(;null!==s&&l<1;){if(s.stateKey===r){u.next=s.next;break}{l++;let e={tree:s.tree,cacheNode:s.cacheNode,stateKey:s.stateKey,next:null};u.next=e,u=e}s=s.next}return n(i),i}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},47257,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"ClientPageRoot",{enumerable:!0,get:function(){return u}});let a=e.r(43476),o=e.r(8372),n=e.r(71645),i=e.r(33906),l=e.r(61994),s=e.r(15783);function u({Component:e,serverProvidedParams:t}){let r,d;if(null!==t)r=t.searchParams,d=t.params;else{let e=(0,n.use)(o.LayoutRouterContext);d=null!==e?e.parentParams:{},r=(0,i.urlSearchParamsToParsedUrlQuery)((0,n.use)(l.SearchParamsContext))}let c=(0,s.createClientSearchParams)(r),f=(0,s.createClientParams)(d);return(0,a.jsx)(e,{params:f,searchParams:c})}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},92825,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"ClientSegmentRoot",{enumerable:!0,get:function(){return l}});let a=e.r(43476),o=e.r(8372),n=e.r(71645),i=e.r(15783);function l({Component:e,slots:t,serverProvidedParams:r}){let s;if(null!==r)s=r.params;else{let e=(0,n.use)(o.LayoutRouterContext);s=null!==e?e.parentParams:{}}let u=(0,i.createClientParams)(s);return(0,a.jsx)(e,{...t,params:u})}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},68017,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"HTTPAccessFallbackBoundary",{enumerable:!0,get:function(){return d}});let a=e.r(90809),o=e.r(43476),n=a._(e.r(71645)),i=e.r(90373),l=e.r(54394),s=e.r(8372);class u extends n.default.Component{constructor(e){super(e),this.state={triggeredStatus:void 0,previousPathname:e.pathname}}componentDidCatch(){}static getDerivedStateFromError(e){if((0,l.isHTTPAccessFallbackError)(e))return{triggeredStatus:(0,l.getAccessFallbackHTTPStatus)(e)};throw e}static getDerivedStateFromProps(e,t){return e.pathname!==t.previousPathname&&t.triggeredStatus?{triggeredStatus:void 0,previousPathname:e.pathname}:{triggeredStatus:t.triggeredStatus,previousPathname:e.pathname}}render(){let{notFound:e,forbidden:t,unauthorized:r,children:a}=this.props,{triggeredStatus:n}=this.state,i={[l.HTTPAccessErrorStatus.NOT_FOUND]:e,[l.HTTPAccessErrorStatus.FORBIDDEN]:t,[l.HTTPAccessErrorStatus.UNAUTHORIZED]:r};if(n){let s=n===l.HTTPAccessErrorStatus.NOT_FOUND&&e,u=n===l.HTTPAccessErrorStatus.FORBIDDEN&&t,d=n===l.HTTPAccessErrorStatus.UNAUTHORIZED&&r;return s||u||d?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("meta",{name:"robots",content:"noindex"}),!1,i[n]]}):a}return a}}function d({notFound:e,forbidden:t,unauthorized:r,children:a}){let l=(0,i.useUntrackedPathname)(),c=(0,n.useContext)(s.MissingSlotContext);return e||t||r?(0,o.jsx)(u,{pathname:l,notFound:e,forbidden:t,unauthorized:r,missingSlots:c,children:a}):(0,o.jsx)(o.Fragment,{children:a})}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},22976,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={InstantValidationBoundaryContext:function(){return n},PlaceValidationBoundaryBelowThisLevel:function(){return i},RenderValidationBoundaryAtThisLevel:function(){return l},SlotMarker:function(){return s}};for(var o in a)Object.defineProperty(r,o,{enumerable:!0,get:a[o]});let n=null,i=null,l=null,s=null;("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},77694,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={InstantValidationBoundaryContext:function(){return n.InstantValidationBoundaryContext},PlaceValidationBoundaryBelowThisLevel:function(){return n.PlaceValidationBoundaryBelowThisLevel},RenderValidationBoundaryAtThisLevel:function(){return n.RenderValidationBoundaryAtThisLevel},SlotMarker:function(){return n.SlotMarker}};for(var o in a)Object.defineProperty(r,o,{enumerable:!0,get:a[o]});let n=e.r(22976);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},39756,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0});var a={LoadingBoundaryProvider:function(){return O},default:function(){return E}};for(var o in a)Object.defineProperty(r,o,{enumerable:!0,get:a[o]});let n=e.r(55682),i=e.r(90809),l=e.r(43476),s=i._(e.r(71645)),u=n._(e.r(74080)),d=e.r(8372),c=e.r(1244),f=e.r(72383),p=e.r(91915),m=e.r(58442),h=e.r(68017);e.r(77694);let y=e.r(70725),g=e.r(28298);e.r(74180);let b=e.r(61994),v=e.r(33906),x=e.r(95871);u.default.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function P(e,t,r){let a=e.getClientRects();if(0===a.length)return 0;let o=1/0;for(let e=0;e<a.length;e++){let t=a[e];t.top<o&&(o=t.top)}return o>=r()&&o<=t?1:2}s.default.Component;let _=function(e){let t=s.default.useRef(null);return(0,s.useLayoutEffect)(()=>{let{focusAndScrollRef:r,cacheNode:a}=e,o=r.forceScroll?r.scrollRef:a.scrollRef;if(null===o||!o.current)return;let n=null,i=r.hashFragment;if(i){var l;if(null===(n="top"===(l=i)?document.body:document.getElementById(l)??document.getElementsByName(l)[0]??null)){o.current=!1,r.onlyHashChange=!1,r.hashFragment=null;return}}else n=t.current;if(null===n)return;let s=!1;(0,p.disableSmoothScrollDuringRouteTransition)(()=>{let e=document.documentElement,t=null,r=null,a=null,l=()=>{var r,o;let n,i;return null===a&&(r=e,o=t,a=!Number.isFinite(i=Number.parseFloat(n=getComputedStyle(r).scrollPaddingTop))||i<0?0:n.endsWith("px")?i:n.endsWith("%")?i/100*o:0),a};(i||(t=e.clientHeight,0!==(r=P(n,t,l))))&&((s=!0,o.current=!1,i)?n.scrollIntoView():1!==r&&(e.scrollTop=0,2===P(n,t,l)&&n.scrollIntoView()))},{dontForceLayout:!0,onlyHashChange:r.onlyHashChange}),s&&(r.onlyHashChange=!1,r.hashFragment=null)},void 0),(0,l.jsx)(s.Fragment,{ref:t,children:e.children})};function j({children:e,cacheNode:t}){let r=(0,s.useContext)(d.GlobalLayoutRouterContext);if(!r)throw Object.defineProperty(Error("invariant global layout router not mounted"),"__NEXT_ERROR_CODE",{value:"E473",enumerable:!1,configurable:!0});return(0,l.jsx)(_,{focusAndScrollRef:r.focusAndScrollRef,cacheNode:t,children:e})}function w({tree:e,segmentPath:t,debugNameContext:r,cacheNode:a,params:o,url:n,isActive:i}){let u,f=(0,s.useContext)(d.GlobalLayoutRouterContext);if((0,s.useContext)(b.NavigationPromisesContext),!f)throw Object.defineProperty(Error("invariant global layout router not mounted"),"__NEXT_ERROR_CODE",{value:"E473",enumerable:!1,configurable:!0});let p=null!==a?a:(0,s.use)(c.unresolvedThenable),m=null!==p.prefetchRsc?p.prefetchRsc:p.rsc,h=(0,s.useDeferredValue)(p.rsc,m);if((0,x.isDeferredRsc)(h)){let e=(0,s.use)(h);null===e&&(0,s.use)(c.unresolvedThenable),u=e}else null===h&&(0,s.use)(c.unresolvedThenable),u=h;let y=u;return(0,l.jsx)(d.LayoutRouterContext.Provider,{value:{parentTree:e,parentCacheNode:p,parentSegmentPath:t,parentParams:o,parentLoadingData:null,debugNameContext:r,url:n,isActive:i},children:y})}function O({loading:e,children:t}){let r=(0,s.use)(d.LayoutRouterContext);return null===r?t:(0,l.jsx)(d.LayoutRouterContext.Provider,{value:{parentTree:r.parentTree,parentCacheNode:r.parentCacheNode,parentSegmentPath:r.parentSegmentPath,parentParams:r.parentParams,parentLoadingData:e,debugNameContext:r.debugNameContext,url:r.url,isActive:r.isActive},children:t})}function C({name:e,loading:t,children:r}){if(null!==t){let a=t[0],o=t[1],n=t[2];return(0,l.jsx)(s.Suspense,{name:e,fallback:(0,l.jsxs)(l.Fragment,{children:[o,n,a]}),children:r})}return(0,l.jsx)(l.Fragment,{children:r})}function E({parallelRouterKey:e,error:t,errorStyles:r,errorScripts:a,templateStyles:o,templateScripts:n,template:i,notFound:u,forbidden:p,unauthorized:b,segmentViewBoundaries:x}){let P=(0,s.useContext)(d.LayoutRouterContext);if(!P)throw Object.defineProperty(Error("invariant expected layout router to be mounted"),"__NEXT_ERROR_CODE",{value:"E56",enumerable:!1,configurable:!0});let{parentTree:_,parentCacheNode:O,parentSegmentPath:S,parentParams:N,parentLoadingData:T,url:R,isActive:k,debugNameContext:A}=P,M=_[0],D=null===S?[e]:S.concat([M,e]),F=_[1][e],L=O.slots;(void 0===F||null===L)&&(0,s.use)(c.unresolvedThenable);let B=F[0],I=L[e]??null,z=(0,y.createRouterCacheKey)(B,!0),$=(0,g.useRouterBFCache)(F,I,z),H=[];do{let e=$.tree,s=$.cacheNode,c=$.stateKey,y=e[0],g=N;if(Array.isArray(y)){let e=y[0],t=y[1],r=y[2],a=(0,v.getParamValueFromCacheKey)(t,r);null!==a&&(g={...N,[e]:a})}let x=function(e){if("/"===e)return"/";if("string"==typeof e)if("(__SLOT__)"===e)return;else return e+"/";return e[1]+"/"}(y),P=x??A,_=void 0===x?void 0:A,O=(0,l.jsxs)(j,{cacheNode:s,children:[(0,l.jsx)(f.ErrorBoundary,{errorComponent:t,errorStyles:r,errorScripts:a,children:(0,l.jsx)(C,{name:_,loading:T,children:(0,l.jsx)(h.HTTPAccessFallbackBoundary,{notFound:u,forbidden:p,unauthorized:b,children:(0,l.jsxs)(m.RedirectBoundary,{children:[(0,l.jsx)(w,{url:R,tree:e,params:g,cacheNode:s,segmentPath:D,debugNameContext:P,isActive:k&&c===z}),null]})})})}),null]}),E=(0,l.jsxs)(d.TemplateContext.Provider,{value:O,children:[o,n,i]},c);H.push(E),$=$.next}while(null!==$)return H}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},37457,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return l}});let a=e.r(90809),o=e.r(43476),n=a._(e.r(71645)),i=e.r(8372);function l(){let e=(0,n.useContext)(i.TemplateContext);return(0,o.jsx)(o.Fragment,{children:e})}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},6831,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"createRenderParamsFromClient",{enumerable:!0,get:function(){return o}});let a=new WeakMap;function o(e){let t=a.get(e);if(t)return t;let r=Promise.resolve(e);return a.set(e,r),r}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},97689,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"createRenderParamsFromClient",{enumerable:!0,get:function(){return a}});let a=e.r(6831).createRenderParamsFromClient;("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},93504,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"createRenderSearchParamsFromClient",{enumerable:!0,get:function(){return o}});let a=new WeakMap;function o(e){let t=a.get(e);if(t)return t;let r=Promise.resolve(e);return a.set(e,r),r}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},66996,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"createRenderSearchParamsFromClient",{enumerable:!0,get:function(){return a}});let a=e.r(93504).createRenderSearchParamsFromClient;("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},15783,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={createClientParams:function(){return n.createRenderParamsFromClient},createClientSearchParams:function(){return i.createRenderSearchParamsFromClient}};for(var o in a)Object.defineProperty(r,o,{enumerable:!0,get:a[o]});let n=e.r(97689),i=e.r(66996);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},27201,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"IconMark",{enumerable:!0,get:function(){return o}});let a=e.r(43476),o=()=>"u">typeof window?null:(0,a.jsx)("meta",{name:"«nxt-icon»"})},91915,(e,t,r)=>{"use strict";function a(e,t={}){if(t.onlyHashChange)return void e();let r=document.documentElement;if("smooth"!==r.dataset.scrollBehavior)return void e();let o=r.style.scrollBehavior;r.style.scrollBehavior="auto",t.dontForceLayout||r.getClientRects(),e(),r.style.scrollBehavior=o}e.i(47167),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"disableSmoothScrollDuringRouteTransition",{enumerable:!0,get:function(){return a}})},5766,e=>{"use strict";let t,r;var a,o=e.i(71645);let n={data:""},i=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,s=/\n+/g,u=(e,t)=>{let r="",a="",o="";for(let n in e){let i=e[n];"@"==n[0]?"i"==n[1]?r=n+" "+i+";":a+="f"==n[1]?u(i,n):n+"{"+u(i,"k"==n[1]?"":t)+"}":"object"==typeof i?a+=u(i,t?t.replace(/([^,])+/g,e=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):n):null!=i&&(n="-"==n[1]?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=u.p?u.p(n,i):n+":"+i+";")}return r+(t&&o?t+"{"+o+"}":o)+a},d={},c=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+c(e[r]);return t}return e};function f(e){let t,r,a=this||{},o=e.call?e(a.p):e;return((e,t,r,a,o)=>{var n;let f=c(e),p=d[f]||(d[f]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(f));if(!d[p]){let t=f!==e?e:(e=>{let t,r,a=[{}];for(;t=i.exec(e.replace(l,""));)t[4]?a.shift():t[3]?(r=t[3].replace(s," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(s," ").trim();return a[0]})(e);d[p]=u(o?{["@keyframes "+p]:t}:t,r?"":"."+p)}let m=r&&d.g;return r&&(d.g=d[p]),n=d[p],m?t.data=t.data.replace(m,n):-1===t.data.indexOf(n)&&(t.data=a?n+t.data:t.data+n),p})(o.unshift?o.raw?(t=[].slice.call(arguments,1),r=a.p,o.reduce((e,a,o)=>{let n=t[o];if(n&&n.call){let e=n(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;n=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+a+(null==n?"":n)},"")):o.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):o,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(a.target),a.g,a.o,a.k)}f.bind({g:1});let p,m,h,y=f.bind({k:1});function g(e,t){let r=this||{};return function(){let a=arguments;function o(n,i){let l=Object.assign({},n),s=l.className||o.className;r.p=Object.assign({theme:m&&m()},l),r.o=/go\d/.test(s),l.className=f.apply(r,a)+(s?" "+s:""),t&&(l.ref=i);let u=e;return e[0]&&(u=l.as||e,delete l.as),h&&u[0]&&h(l),p(u,l)}return t?t(o):o}}var b=(e,t)=>"function"==typeof e?e(t):e,v=(t=0,()=>(++t).toString()),x=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},P="default",_=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return _(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(e=>e.id===o||void 0===o?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+n}))}}},j=[],w={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},O={},C=(e,t=P)=>{O[t]=_(O[t]||w,e),j.forEach(([e,r])=>{e===t&&r(O[t])})},E=e=>Object.keys(O).forEach(t=>C(e,t)),S=(e=P)=>t=>{C(t,e)},N={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},T=e=>(t,r)=>{let a,o=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||v()}))(t,e,r);return S(o.toasterId||(a=o.id,Object.keys(O).find(e=>O[e].toasts.some(e=>e.id===a))))({type:2,toast:o}),o.id},R=(e,t)=>T("blank")(e,t);R.error=T("error"),R.success=T("success"),R.loading=T("loading"),R.custom=T("custom"),R.dismiss=(e,t)=>{let r={type:3,toastId:e};t?S(t)(r):E(r)},R.dismissAll=e=>R.dismiss(void 0,e),R.remove=(e,t)=>{let r={type:4,toastId:e};t?S(t)(r):E(r)},R.removeAll=e=>R.remove(void 0,e),R.promise=(e,t,r)=>{let a=R.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let o=t.success?b(t.success,e):void 0;return o?R.success(o,{id:a,...r,...null==r?void 0:r.success}):R.dismiss(a),e}).catch(e=>{let o=t.error?b(t.error,e):void 0;o?R.error(o,{id:a,...r,...null==r?void 0:r.error}):R.dismiss(a)}),e};var k=1e3,A=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,M=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,D=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,F=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${A} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${M} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${D} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,L=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,B=g("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${L} 1s linear infinite;
`,I=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,z=y`
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
}`,$=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${I} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${z} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,H=g("div")`
  position: absolute;
`,U=g("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,W=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,V=g("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${W} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,K=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?o.createElement(V,null,t):t:"blank"===r?null:o.createElement(U,null,o.createElement(B,{...a}),"loading"!==r&&o.createElement(H,null,"error"===r?o.createElement(F,{...a}):o.createElement($,{...a})))},G=g("div")`
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
`,Z=g("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,q=o.memo(({toast:e,position:t,style:r,children:a})=>{let n=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[a,o]=x()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${y(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=o.createElement(K,{toast:e}),l=o.createElement(Z,{...e.ariaProps},b(e.message,e));return o.createElement(G,{className:e.className,style:{...n,...r,...e.style}},"function"==typeof a?a({icon:i,message:l}):o.createElement(o.Fragment,null,i,l))});a=o.createElement,u.p=void 0,p=a,m=void 0,h=void 0;var X=({id:e,className:t,style:r,onHeightUpdate:a,children:n})=>{let i=o.useCallback(t=>{if(t){let r=()=>{a(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return o.createElement("div",{ref:i,className:t,style:r},n)},Y=f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:n,toasterId:i,containerStyle:l,containerClassName:s})=>{let{toasts:u,handlers:d}=((e,t="default")=>{let{toasts:r,pausedAt:a}=((e={},t=P)=>{let[r,a]=(0,o.useState)(O[t]||w),n=(0,o.useRef)(O[t]);(0,o.useEffect)(()=>(n.current!==O[t]&&a(O[t]),j.push([t,a]),()=>{let e=j.findIndex(([e])=>e===t);e>-1&&j.splice(e,1)}),[t]);let i=r.toasts.map(t=>{var r,a,o;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||N[t.type],style:{...e.style,...null==(o=e[t.type])?void 0:o.style,...t.style}}});return{...r,toasts:i}})(e,t),n=(0,o.useRef)(new Map).current,i=(0,o.useCallback)((e,t=k)=>{if(n.has(e))return;let r=setTimeout(()=>{n.delete(e),l({type:4,toastId:e})},t);n.set(e,r)},[]);(0,o.useEffect)(()=>{if(a)return;let e=Date.now(),o=r.map(r=>{if(r.duration===1/0)return;let a=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(a<0){r.visible&&R.dismiss(r.id);return}return setTimeout(()=>R.dismiss(r.id,t),a)});return()=>{o.forEach(e=>e&&clearTimeout(e))}},[r,a,t]);let l=(0,o.useCallback)(S(t),[t]),s=(0,o.useCallback)(()=>{l({type:5,time:Date.now()})},[l]),u=(0,o.useCallback)((e,t)=>{l({type:1,toast:{id:e,height:t}})},[l]),d=(0,o.useCallback)(()=>{a&&l({type:6,time:Date.now()})},[a,l]),c=(0,o.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:o=8,defaultPosition:n}=t||{},i=r.filter(t=>(t.position||n)===(e.position||n)&&t.height),l=i.findIndex(t=>t.id===e.id),s=i.filter((e,t)=>t<l&&e.visible).length;return i.filter(e=>e.visible).slice(...a?[s+1]:[0,s]).reduce((e,t)=>e+(t.height||0)+o,0)},[r]);return(0,o.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=n.get(e.id);t&&(clearTimeout(t),n.delete(e.id))}})},[r,i]),{toasts:r,handlers:{updateHeight:u,startPause:s,endPause:d,calculateOffset:c}}})(r,i);return o.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...l},className:s,onMouseEnter:d.startPause,onMouseLeave:d.endPause},u.map(r=>{let i,l,s=r.position||t,u=d.calculateOffset(r,{reverseOrder:e,gutter:a,defaultPosition:t}),c=(i=s.includes("top"),l=s.includes("center")?{justifyContent:"center"}:s.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:x()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${u*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...l});return o.createElement(X,{id:r.id,key:r.id,onHeightUpdate:d.updateHeight,className:r.visible?Y:"",style:c},"custom"===r.type?b(r.message,r):n?n(r):o.createElement(q,{toast:r,position:s}))}))},"default",0,R],5766)},97670,e=>{"use strict";var t=e.i(43476),r=e.i(58652),a=e.i(5766);e.s(["default",0,function({children:e}){return(0,t.jsxs)(r.AuthProvider,{children:[(0,t.jsx)(a.Toaster,{position:"bottom-right",reverseOrder:!1}),e]})}])},36894,e=>{"use strict";var t=e.i(43476),r=e.i(71645);e.i(36180);var a=e.i(2361),o=e.i(63802),n=e.i(21052),i=e.i(56420);let l={name:"message-circle",size:24,node:[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]]};l.node;let s=(0,i.default)(l);e.s(["default",0,function(){let[e,i]=(0,r.useState)(null);if((0,r.useEffect)(()=>{!async function(){try{let e=await (0,o.getDoc)((0,a.doc)(n.db,"settings","global"));if(e.exists()){let t=e.data();t.whatsappNumber&&i(t.whatsappNumber)}}catch(e){console.error("Error fetching whatsapp settings:",e)}}()},[]),!e)return null;let l=e.replace(/[^0-9]/g,"");return(0,t.jsxs)("a",{href:`https://wa.me/${l}?text=Hello!%20I%20came%20from%20your%20website%20and%20want%20to%20discuss%20a%20project.`,target:"_blank",rel:"noopener noreferrer",className:"fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all z-50 flex items-center justify-center",title:"Chat on WhatsApp",children:[(0,t.jsx)(s,{size:28}),(0,t.jsxs)("span",{className:"absolute -top-1 -right-1 flex h-3 w-3",children:[(0,t.jsx)("span",{className:"animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"}),(0,t.jsx)("span",{className:"relative inline-flex rounded-full h-3 w-3 bg-red-500"})]})]})}],36894)},58652,e=>{"use strict";var t=e.i(43476),r=e.i(71645);e.i(51718);var a=e.i(3345),o=e.i(6100),n=e.i(52246),i=e.i(51984),l=e.i(28583),s=e.i(22633),u=e.i(6516);e.i(36180);var d=e.i(2361),c=e.i(63802),f=e.i(33710),p=e.i(21052);let m=(0,r.createContext)({});e.s(["AuthProvider",0,function({children:e}){let[h,y]=(0,r.useState)(null),[g,b]=(0,r.useState)(null),[v,x]=(0,r.useState)(!0);(0,r.useEffect)(()=>{let e=null,t=(0,a.onAuthStateChanged)(p.auth,async t=>{if(y(t),t){let r=(0,d.doc)(p.db,"users",t.uid);e=(0,c.onSnapshot)(r,async e=>{if(e.exists())b(e.data()),x(!1);else{let e={uid:t.uid,email:t.email,displayName:t.displayName,photoURL:t.photoURL,role:"user",createdAt:(0,f.serverTimestamp)(),lastLogin:(0,f.serverTimestamp)()};await (0,c.setDoc)(r,e),b(e),x(!1)}})}else b(null),x(!1),e&&e()});return()=>{t(),e&&e()}},[]);let P=async()=>{let e=new o.GoogleAuthProvider;try{await (0,n.signInWithPopup)(p.auth,e)}catch(e){throw console.error("Login failed:",e),e}},_=async(e,t)=>{try{await (0,l.signInWithEmailAndPassword)(p.auth,e,t)}catch(e){throw console.error("Login with email failed:",e),e}},j=async(e,t,r)=>{try{let a=await (0,s.createUserWithEmailAndPassword)(p.auth,t,r);await (0,u.updateProfile)(a.user,{displayName:e,photoURL:`https://ui-avatars.com/api/?name=${encodeURIComponent(e)}`})}catch(e){throw console.error("Signup failed:",e),e}};return(0,t.jsx)(m.Provider,{value:{user:h,dbUser:g,loading:v,loginWithGoogle:P,loginWithEmail:_,signupWithEmail:j,logout:()=>(0,i.signOut)(p.auth)},children:e})},"useAuth",0,()=>(0,r.useContext)(m)])}]);