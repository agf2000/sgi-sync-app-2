!function(t,n){if("function"==typeof define&&define.amd)define("PNotifyConfirm",["exports","PNotify"],n);else if("undefined"!=typeof exports)n(exports,require("./PNotify"));else{var e={};n(e,t.PNotify),t.PNotifyConfirm=e}}(this,function(t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var e,i=(e=n)&&e.__esModule?e:{default:e};var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])}return t};var s;function u(t,n){var e,i,o=!1;function r(){o=!0,n.set({prompt_value:e.value}),o=!1}function s(t){n.handleKeyPress(t)}return{c:function(){e=g("textarea"),this.h()},h:function(){k(e,"input",r),e.rows="5",e.className=i="\n              ui-pnotify-prompt-input\n              "+(t._notice.get("_styles").input?t._notice.get("_styles").input:"")+"\n              "+t.prompt_class+"\n            ",k(e,"keypress",s)},m:function(i,o){x(e,i,o),n.refs.promptMulti=e,e.value=t.prompt_value},p:function(t,n){o||(e.value=n.prompt_value),(t._notice||t.prompt_class)&&i!==(i="\n              ui-pnotify-prompt-input\n              "+(n._notice.get("_styles").input?n._notice.get("_styles").input:"")+"\n              "+n.prompt_class+"\n            ")&&(e.className=i)},u:function(){C(e)},d:function(){N(e,"input",r),N(e,"keypress",s),n.refs.promptMulti===e&&(n.refs.promptMulti=null)}}}function c(t,n){var e,i,o=!1;function r(){o=!0,n.set({prompt_value:e.value}),o=!1}function s(t){n.handleKeyPress(t)}return{c:function(){e=g("input"),this.h()},h:function(){k(e,"input",r),e.type="text",e.className=i="\n              ui-pnotify-prompt-input\n              "+(t._notice.get("_styles").input?t._notice.get("_styles").input:"")+"\n              "+t.prompt_class+"\n            ",k(e,"keypress",s)},m:function(i,o){x(e,i,o),n.refs.promptSingle=e,e.value=t.prompt_value},p:function(t,n){o||(e.value=n.prompt_value),(t._notice||t.prompt_class)&&i!==(i="\n              ui-pnotify-prompt-input\n              "+(n._notice.get("_styles").input?n._notice.get("_styles").input:"")+"\n              "+n.prompt_class+"\n            ")&&(e.className=i)},u:function(){C(e)},d:function(){N(e,"input",r),N(e,"keypress",s),n.refs.promptSingle===e&&(n.refs.promptSingle=null)}}}function a(t,n){var e,i=m(t),o=i(t,n);return{c:function(){o.c(),e=v()},m:function(t,n){o.m(t,n),x(e,t,n)},p:function(t,r){i===(i=m(r))&&o?o.p(t,r):(o.u(),o.d(),(o=i(r,n)).c(),o.m(e.parentNode,e))},u:function(){o.u(),C(e)},d:function(){o.d()}}}function l(t,n,e,i,o){var r,s,u=h(t,n,e,i),c=u(t,n,e,i,o);return{c:function(){r=g("button"),c.c(),this.h()},h:function(){r.type="button",r.className=s="\n            ui-pnotify-action-button\n            "+(e.primary?t._notice.get("_styles").btn_primary?t._notice.get("_styles").btn_primary:"":t._notice.get("_styles").btn?t._notice.get("_styles").btn:"")+"\n            "+(e.addClass?e.addClass:"")+"\n          ",k(r,"click",d),r._svelte={component:o,buttons:n,button_index:i}},m:function(t,n){x(r,t,n),c.m(r,null)},p:function(t,n,e,i,a){u===(u=h(n,e,i,a))&&c?c.p(t,n,e,i,a):(c.u(),c.d(),(c=u(n,e,i,a,o)).c(),c.m(r,null)),(t.buttons||t._notice)&&s!==(s="\n            ui-pnotify-action-button\n            "+(i.primary?n._notice.get("_styles").btn_primary?n._notice.get("_styles").btn_primary:"":n._notice.get("_styles").btn?n._notice.get("_styles").btn:"")+"\n            "+(i.addClass?i.addClass:"")+"\n          ")&&(r.className=s),r._svelte.buttons=e,r._svelte.button_index=a},u:function(){C(r),c.u()},d:function(){c.d(),N(r,"click",d)}}}function f(t,n,e,i,o){var r,s,u=e.text;return{c:function(){r=g("noscript"),s=g("noscript")},m:function(t,n){x(r,t,n),r.insertAdjacentHTML("afterend",u),x(s,t,n)},p:function(t,n,e,i,o){t.buttons&&u!==(u=i.text)&&(S(r,s),r.insertAdjacentHTML("afterend",u))},u:function(){S(r,s),C(r),C(s)},d:P}}function p(t,n,e,i,o){var r,s=e.text;return{c:function(){r=M(s)},m:function(t,n){x(r,t,n)},p:function(t,n,e,i,o){t.buttons&&s!==(s=i.text)&&(r.data=s)},u:function(){C(r)},d:P}}function _(t,n){for(var e,i,o,r=t.prompt&&a(t,n),s=t.buttons,u=[],c=0;c<s.length;c+=1)u[c]=l(t,s,s[c],c,n);return{c:function(){e=g("div"),r&&r.c(),i=M("\n    ");for(var t=0;t<u.length;t+=1)u[t].c();this.h()},h:function(){e.className=o="\n        ui-pnotify-action-bar\n        "+(t._notice.get("_styles").action_bar?t._notice.get("_styles").action_bar:"")+"\n        "+(t._notice.get("_styles").text?t._notice.get("_styles").text:"")+"\n      ",O(e,"text-align",t.align)},m:function(t,n){x(e,t,n),r&&r.m(e,null),b(i,e);for(var o=0;o<u.length;o+=1)u[o].m(e,null)},p:function(t,s){s.prompt?r?r.p(t,s):((r=a(s,n)).c(),r.m(e,i)):r&&(r.u(),r.d(),r=null);var c=s.buttons;if(t.buttons||t._notice){for(var f=0;f<c.length;f+=1)u[f]?u[f].p(t,s,c,c[f],f):(u[f]=l(s,c,c[f],f,n),u[f].c(),u[f].m(e,null));for(;f<u.length;f+=1)u[f].u(),u[f].d();u.length=c.length}t._notice&&o!==(o="\n        ui-pnotify-action-bar\n        "+(s._notice.get("_styles").action_bar?s._notice.get("_styles").action_bar:"")+"\n        "+(s._notice.get("_styles").text?s._notice.get("_styles").text:"")+"\n      ")&&(e.className=o),t.align&&O(e,"text-align",s.align)},u:function(){C(e),r&&r.u();for(var t=0;t<u.length;t+=1)u[t].u()},d:function(){r&&r.d(),function(t){for(var n=0;n<t.length;n+=1)t[n]&&t[n].d()}(u)}}}function m(t){return t.prompt_multi_line?u:c}function h(t,n,e,i){return e.trustText?f:p}function d(t){var n=this._svelte.component,e=this._svelte.buttons[this._svelte.button_index];n.handleClick(e,t)}function y(t){var n,e,o;e=t,(n=this)._observers={pre:E(),post:E()},n._handlers=E(),n._bind=e._bind,n.options=e,n.root=e.root||n,n.store=n.root.store||e.store,this.refs={},this._state=T(r({_notice:null,_options:{}},i.default.modules.Confirm.defaults),t.data),document.getElementById("svelte-3546993901-style")||((o=g("style")).id="svelte-3546993901-style",o.textContent=".ui-pnotify-action-bar{margin-top:5px;clear:both}.ui-pnotify-prompt-input{margin-bottom:5px;clear:both}.ui-pnotify.ui-pnotify-with-icon .ui-pnotify-action-bar.ui-pnotify-confirm-ml{margin-left:24px}",b(o,document.head));var s,u,c,a,l=function(){this.fire("init",{module:this})}.bind(this);t.root?this.root._oncreate.push(l):this._oncreate=[l],this._fragment=(s=this._state,u=this,a=(s.confirm||s.prompt)&&_(s,u),{c:function(){a&&a.c(),c=v()},m:function(t,n){a&&a.m(t,n),x(c,t,n)},p:function(t,n){n.confirm||n.prompt?a?a.p(t,n):((a=_(n,u)).c(),a.m(c.parentNode,c)):a&&(a.u(),a.d(),a=null)},u:function(){a&&a.u(),C(c)},d:function(){a&&a.d()}}),t.target&&(this._fragment.c(),this._fragment.m(t.target,t.anchor||null),j(this._oncreate))}function g(t){return document.createElement(t)}function b(t,n){n.appendChild(t)}function v(){return document.createComment("")}function x(t,n,e){n.insertBefore(t,e)}function C(t){t.parentNode.removeChild(t)}function k(t,n,e){t.addEventListener(n,e,!1)}function N(t,n,e){t.removeEventListener(n,e,!1)}function S(t,n){for(;t.nextSibling&&t.nextSibling!==n;)t.parentNode.removeChild(t.nextSibling)}function P(){}function M(t){return document.createTextNode(t)}function O(t,n,e){t.style.setProperty(n,e)}function T(t){for(var n,e,i=1,o=arguments.length;i<o;i++){e=arguments[i];for(n in e)t[n]=e[n]}return t}function j(t){for(;t&&t.length;)t.pop()()}function w(t){this.destroy=P,this.fire("destroy"),this.set=this.get=P,!1!==t&&this._fragment.u(),this._fragment.d(),this._fragment=this._state=null}function E(){return Object.create(null)}function K(t,n,e,i,o){for(var r in n)if(e[r]){var s=i[r],u=o[r],c=n[r];if(c)for(var a=0;a<c.length;a+=1){var l=c[a];l.__calling||(l.__calling=!0,l.call(t,s,u),l.__calling=!1)}}}T(y.prototype,{initModule:function(t){this.set(t)},afterOpen:function(){this.get("prompt")&&(this.get("prompt_multi_line")?this.refs.promptMulti.focus():this.refs.promptSingle.focus())},handleClick:function(t,n){t.click&&t.click(this.get("_notice"),this.get("prompt")?this.get("prompt_value"):null,n)},handleKeyPress:function(t){if(13==t.keyCode&&!t.shiftKey){t.preventDefault();for(var n=this.get("buttons"),e=0;e<n.length;e++)n[e].promptTrigger&&n[e].click&&n[e].click(this.get("_notice"),this.get("prompt")?this.get("prompt_value"):null,t)}}},{destroy:w,get:function(t){return t?this._state[t]:this._state},fire:function(t,n){var e=t in this._handlers&&this._handlers[t].slice();if(!e)return;for(var i=0;i<e.length;i+=1)e[i].call(this,n)},observe:function(t,n,e){var i=e&&e.defer?this._observers.post:this._observers.pre;(i[t]||(i[t]=[])).push(n),e&&!1===e.init||(n.__calling=!0,n.call(this,this._state[t]),n.__calling=!1);return{cancel:function(){var e=i[t].indexOf(n);~e&&i[t].splice(e,1)}}},on:function(t,n){if("teardown"===t)return this.on("destroy",n);var e=this._handlers[t]||(this._handlers[t]=[]);return e.push(n),{cancel:function(){var t=e.indexOf(n);~t&&e.splice(t,1)}}},set:function(t){if(this._set(T({},t)),this.root._lock)return;this.root._lock=!0,j(this.root._beforecreate),j(this.root._oncreate),j(this.root._aftercreate),this.root._lock=!1},teardown:w,_set:function(t){var n=this._state,e={},i=!1;for(var r in t)s=t[r],u=n[r],(s!==u||s&&"object"===(void 0===s?"undefined":o(s))||"function"==typeof s)&&(e[r]=i=!0);var s,u;if(!i)return;this._state=T({},n,t),this._recompute(e,this._state),this._bind&&this._bind(e,this._state);this._fragment&&(K(this,this._observers.pre,e,this._state,n),this._fragment.p(e,this._state),K(this,this._observers.post,e,this._state,n))},_mount:function(t,n){this._fragment.m(t,n)},_unmount:function(){this._fragment&&this._fragment.u()}}),y.prototype._recompute=P,(s=y).key="Confirm",s.defaults={confirm:!1,prompt:!1,prompt_class:"",prompt_value:"",prompt_multi_line:!1,align:"right",buttons:[{text:"Ok",trustText:!1,addClass:"",primary:!0,promptTrigger:!0,click:function(t,n){t.close(),t.fire("pnotify.confirm",{notice:t,value:n})}},{text:"Cancel",trustText:!1,addClass:"",click:function(t){t.close(),t.fire("pnotify.cancel",{notice:t})}}]},i.default.modules.Confirm=s,i.default.modulesAppendContainer.push(s),r(i.default.styling.brighttheme,{action_bar:"",btn:"",btn_primary:"brighttheme-primary",input:""}),r(i.default.styling.bootstrap3,{action_bar:"ui-pnotify-confirm-ml",btn:"btn btn-default",btn_primary:"btn btn-default btn-primary",input:"form-control"}),r(i.default.styling.bootstrap4,{action_bar:"ui-pnotify-confirm-ml",btn:"btn btn-secondary ml-1",btn_primary:"btn btn-primary ml-1",input:"form-control"}),i.default.styling.material||(i.default.styling.material={}),r(i.default.styling.material,{action_bar:"",btn:"",btn_primary:"ui-pnotify-material-primary",input:""}),t.default=y});
//# sourceMappingURL=PNotifyConfirm.js.map