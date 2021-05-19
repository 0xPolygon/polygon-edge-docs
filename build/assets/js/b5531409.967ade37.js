(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{101:function(e,t,r){"use strict";r.d(t,"a",(function(){return p})),r.d(t,"b",(function(){return h}));var o=r(0),n=r.n(o);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,o,n=function(e,t){if(null==e)return{};var r,o,n={},i=Object.keys(e);for(o=0;o<i.length;o++)r=i[o],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)r=i[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var c=n.a.createContext({}),l=function(e){var t=n.a.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},p=function(e){var t=l(e.components);return n.a.createElement(c.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return n.a.createElement(n.a.Fragment,{},t)}},d=n.a.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,u=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),p=l(r),d=o,h=p["".concat(u,".").concat(d)]||p[d]||b[d]||i;return r?n.a.createElement(h,a(a({ref:t},c),{},{components:r})):n.a.createElement(h,a({ref:t},c))}));function h(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,u=new Array(i);u[0]=d;var a={};for(var s in t)hasOwnProperty.call(t,s)&&(a[s]=t[s]);a.originalType=e,a.mdxType="string"==typeof e?e:o,u[1]=a;for(var c=2;c<i;c++)u[c]=r[c];return n.a.createElement.apply(null,u)}return n.a.createElement.apply(null,r)}d.displayName="MDXCreateElement"},92:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return u})),r.d(t,"metadata",(function(){return a})),r.d(t,"toc",(function(){return s})),r.d(t,"default",(function(){return l}));var o=r(3),n=r(7),i=(r(0),r(101)),u={id:"howto-report-bug",title:"How to report an issue"},a={unversionedId:"how-tos/howto-report-bug",id:"how-tos/howto-report-bug",isDocsHomePage:!1,title:"How to report an issue",description:"Overview",source:"@site/docs/how-tos/howto-report-bug.md",slug:"/how-tos/howto-report-bug",permalink:"/docs/how-tos/howto-report-bug",editUrl:"https://github.com/0xPolygon/polygon-sdk-docs/docs/how-tos/howto-report-bug.md",version:"current",sidebar:"develop",previous:{title:"How to query JSON RPC endpoints",permalink:"/docs/how-tos/howto-query-json-rpc"},next:{title:"How to propose a new feature",permalink:"/docs/how-tos/howto-propose-feature"}},s=[{value:"Overview",id:"overview",children:[]},{value:"Issue Template",id:"issue-template",children:[]},{value:"Subject of the issue",id:"subject-of-the-issue",children:[{value:"Description",id:"description",children:[]},{value:"Your environment",id:"your-environment",children:[]},{value:"Steps to reproduce",id:"steps-to-reproduce",children:[]},{value:"Expected behaviour",id:"expected-behaviour",children:[]},{value:"Actual behaviour",id:"actual-behaviour",children:[]},{value:"Logs",id:"logs",children:[]},{value:"Proposed solution",id:"proposed-solution",children:[]}]}],c={toc:s};function l(e){var t=e.components,r=Object(n.a)(e,["components"]);return Object(i.b)("wrapper",Object(o.a)({},c,r,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h2",{id:"overview"},"Overview"),Object(i.b)("p",null,"Sometimes things break. ",Object(i.b)("br",null),"\nIt's always better to let the team know about any issues you might be encountering.",Object(i.b)("br",null),"\nOn the Polygon SDK GitHub page, you can file a new issue, and start discussing it with the team."),Object(i.b)("h2",{id:"issue-template"},"Issue Template"),Object(i.b)("h2",{id:"subject-of-the-issue"},"[Subject of the issue]"),Object(i.b)("h3",{id:"description"},"Description"),Object(i.b)("p",null,"Describe your issue in as much detail as possible here"),Object(i.b)("h3",{id:"your-environment"},"Your environment"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"OS and version"),Object(i.b)("li",{parentName:"ul"},"version of the Polygon SDK"),Object(i.b)("li",{parentName:"ul"},"branch that causes this issue")),Object(i.b)("h3",{id:"steps-to-reproduce"},"Steps to reproduce"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"Tell us how to reproduce this issue ",Object(i.b)("br",null)),Object(i.b)("li",{parentName:"ul"},"Where the issue is, if you know ",Object(i.b)("br",null)),Object(i.b)("li",{parentName:"ul"},"Which commands triggered the issue, if any")),Object(i.b)("h3",{id:"expected-behaviour"},"Expected behaviour"),Object(i.b)("p",null,"Tell us what should happen"),Object(i.b)("h3",{id:"actual-behaviour"},"Actual behaviour"),Object(i.b)("p",null,"Tell us what happens instead"),Object(i.b)("h3",{id:"logs"},"Logs"),Object(i.b)("p",null,"Please paste any logs here that demonstrate the issue, if they exist"),Object(i.b)("h3",{id:"proposed-solution"},"Proposed solution"),Object(i.b)("p",null,"If you have an idea of how to fix this issue, please write it down here, so we can begin discussing it"))}l.isMDXComponent=!0}}]);