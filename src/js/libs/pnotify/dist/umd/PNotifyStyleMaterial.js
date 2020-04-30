!function(t,i){if("function"==typeof define&&define.amd)define("PNotifyStyleMaterial",["exports","PNotify"],i);else if("undefined"!=typeof exports)i(exports,require("./PNotify"));else{var o={};i(o,t.PNotify),t.PNotifyStyleMaterial=o}}(this,function(t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,n=(o=i)&&o.__esModule?o:{default:o};var e,r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},a=Object.assign||function(t){for(var i=1;i<arguments.length;i++){var o=arguments[i];for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&(t[n]=o[n])}return t};function f(){var t,i,o=(t="style",document.createElement(t));o.id="svelte-3496215487-style",o.textContent='@import url(https://fonts.googleapis.com/css?family=Material+Icons);[ui-pnotify] .pnotify-material{-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;font-size:14px}[ui-pnotify] .pnotify-material.ui-pnotify-shadow{-webkit-box-shadow:0px 6px 24px 0px rgba(0,0,0,0.2);-moz-box-shadow:0px 6px 24px 0px rgba(0,0,0,0.2);box-shadow:0px 6px 24px 0px rgba(0,0,0,0.2)}[ui-pnotify] .pnotify-material.ui-pnotify-container{padding:24px}[ui-pnotify] .pnotify-material .ui-pnotify-title{font-size:20px;margin-bottom:20px}[ui-pnotify] .pnotify-material .ui-pnotify-text{font-size:16px}[ui-pnotify].ui-pnotify-with-icon .pnotify-material .ui-pnotify-title,[ui-pnotify].ui-pnotify-with-icon .pnotify-material .ui-pnotify-text,[ui-pnotify].ui-pnotify-with-icon .pnotify-material .ui-pnotify-action-bar{margin-left:32px}[ui-pnotify].ui-pnotify-with-icon .pnotify-material .ui-pnotify-action-bar{margin-top:20px;margin-right:-16px;margin-bottom:-16px}[ui-pnotify] .pnotify-material-notice{background-color:#FFEE58;border:none;color:#000}[ui-pnotify] .pnotify-material-info{background-color:#26C6DA;border:none;color:#000}[ui-pnotify] .pnotify-material-success{background-color:#66BB6A;border:none;color:#fff}[ui-pnotify] .pnotify-material-error{background-color:#EF5350;border:none;color:#fff}[ui-pnotify] .pnotify-material-icon-notice,[ui-pnotify] .pnotify-material-icon-info,[ui-pnotify] .pnotify-material-icon-success,[ui-pnotify] .pnotify-material-icon-error,[ui-pnotify] .pnotify-material-icon-closer,[ui-pnotify] .pnotify-material-icon-sticker{position:relative}[ui-pnotify] .pnotify-material-icon-closer,[ui-pnotify] .pnotify-material-icon-sticker{height:20px;width:20px;font-size:20px;line-height:20px;position:relative}[ui-pnotify] .pnotify-material-icon-notice:after,[ui-pnotify] .pnotify-material-icon-info:after,[ui-pnotify] .pnotify-material-icon-success:after,[ui-pnotify] .pnotify-material-icon-error:after,[ui-pnotify] .pnotify-material-icon-closer:after,[ui-pnotify] .pnotify-material-icon-sticker:after{font-family:\'Material Icons\'}[ui-pnotify] .pnotify-material-icon-notice:after{content:"announcement"}[ui-pnotify] .pnotify-material-icon-info:after{content:"info"}[ui-pnotify] .pnotify-material-icon-success:after{content:"check_circle"}[ui-pnotify] .pnotify-material-icon-error:after{content:"error"}[ui-pnotify] .pnotify-material-icon-closer,[ui-pnotify] .pnotify-material-icon-sticker{display:inline-block}[ui-pnotify] .pnotify-material-icon-closer:after{top:-4px;content:"close"}[ui-pnotify] .pnotify-material-icon-sticker:after{top:-5px;content:"pause"}[ui-pnotify] .pnotify-material-icon-sticker.pnotify-material-icon-stuck:after{content:"play_arrow"}[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-prompt-input{display:block;width:100%;margin-bottom:8px;padding:15px 0 8px;background-color:transparent;color:inherit;border-radius:0;border-top:none;border-left:none;border-right:none;border-bottom-style:solid;border-bottom-color:inherit;border-bottom-width:1px}[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-prompt-input:focus{outline:none;border-bottom-color:#3F51B5;border-bottom-width:2px}[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-action-button{position:relative;padding:0 16px;overflow:hidden;border-width:0;outline:none;border-radius:2px;background-color:transparent;color:inherit;transition:background-color .3s;text-transform:uppercase;height:36px;margin:6px;min-width:64px;font-weight:bold}[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-action-button.ui-pnotify-material-primary{color:#3F51B5}[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-action-button:hover,[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-action-button:focus{background-color:rgba(0, 0, 0, .12);color:inherit}[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-action-button.ui-pnotify-material-primary:hover,[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-action-button.ui-pnotify-material-primary:focus{color:#303F9F}[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-action-button:before{content:"";position:absolute;top:50%;left:50%;display:block;width:0;padding-top:0;border-radius:100%;background-color:rgba(153, 153, 153, .4);-webkit-transform:translate(-50%, -50%);-moz-transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);-o-transform:translate(-50%, -50%);transform:translate(-50%, -50%)}[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-action-button:active:before{width:120%;padding-top:120%;transition:width .2s ease-out, padding-top .2s ease-out}',i=o,document.head.appendChild(i)}function p(t){var i,o;o=t,(i=this)._observers={pre:u(),post:u()},i._handlers=u(),i._bind=o._bind,i.options=o,i.root=o.root||i,i.store=i.root.store||o.store,this._state=l({},t.data),document.getElementById("svelte-3496215487-style")||f(),this._fragment=(this._state,{c:s,m:s,p:s,u:s,d:s}),t.target&&(this._fragment.c(),this._fragment.m(t.target,t.anchor||null))}function s(){}function l(t){for(var i,o,n=1,e=arguments.length;n<e;n++){o=arguments[n];for(i in o)t[i]=o[i]}return t}function c(t){this.destroy=s,this.fire("destroy"),this.set=this.get=s,!1!==t&&this._fragment.u(),this._fragment.d(),this._fragment=this._state=null}function u(){return Object.create(null)}function y(t){for(;t&&t.length;)t.pop()()}function m(t,i,o,n,e){for(var r in i)if(o[r]){var a=n[r],f=e[r],p=i[r];if(p)for(var s=0;s<p.length;s+=1){var l=p[s];l.__calling||(l.__calling=!0,l.call(t,a,f),l.__calling=!1)}}}l(p.prototype,{destroy:c,get:function(t){return t?this._state[t]:this._state},fire:function(t,i){var o=t in this._handlers&&this._handlers[t].slice();if(!o)return;for(var n=0;n<o.length;n+=1)o[n].call(this,i)},observe:function(t,i,o){var n=o&&o.defer?this._observers.post:this._observers.pre;(n[t]||(n[t]=[])).push(i),o&&!1===o.init||(i.__calling=!0,i.call(this,this._state[t]),i.__calling=!1);return{cancel:function(){var o=n[t].indexOf(i);~o&&n[t].splice(o,1)}}},on:function(t,i){if("teardown"===t)return this.on("destroy",i);var o=this._handlers[t]||(this._handlers[t]=[]);return o.push(i),{cancel:function(){var t=o.indexOf(i);~t&&o.splice(t,1)}}},set:function(t){if(this._set(l({},t)),this.root._lock)return;this.root._lock=!0,y(this.root._beforecreate),y(this.root._oncreate),y(this.root._aftercreate),this.root._lock=!1},teardown:c,_set:function(t){var i=this._state,o={},n=!1;for(var e in t)a=t[e],f=i[e],(a!==f||a&&"object"===(void 0===a?"undefined":r(a))||"function"==typeof a)&&(o[e]=n=!0);var a,f;if(!n)return;this._state=l({},i,t),this._recompute(o,this._state),this._bind&&this._bind(o,this._state);this._fragment&&(m(this,this._observers.pre,o,this._state,i),this._fragment.p(o,this._state),m(this,this._observers.post,o,this._state,i))},_mount:function(t,i){this._fragment.m(t,i)},_unmount:function(){this._fragment&&this._fragment.u()}}),p.prototype._recompute=s,(e=p).key="StyleMaterial",n.default.modules.StyleMaterial=e,n.default.modulesPrependContainer.push(e),n.default.styling.material||(n.default.styling.material={}),n.default.styling.material=a(n.default.styling.material,{container:"pnotify-material",notice:"pnotify-material-notice",info:"pnotify-material-info",success:"pnotify-material-success",error:"pnotify-material-error"}),n.default.icons.material||(n.default.icons.material={}),n.default.icons.material=a(n.default.icons.material,{notice:"material-icons pnotify-material-icon-notice",info:"material-icons pnotify-material-icon-info",success:"material-icons pnotify-material-icon-success",error:"material-icons pnotify-material-icon-error",closer:"material-icons pnotify-material-icon-closer",pin_up:"material-icons pnotify-material-icon-sticker",pin_down:"material-icons pnotify-material-icon-sticker pnotify-material-icon-stuck"}),t.default=p});
//# sourceMappingURL=PNotifyStyleMaterial.js.map