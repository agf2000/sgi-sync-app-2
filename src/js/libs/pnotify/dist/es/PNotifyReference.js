import PNotify from"./PNotify.js";function data(){return Object.assign({_notice:null,_options:{},_mouseIsIn:!1},PNotify.modules.Reference.defaults)}var methods={initModule(e){this.set(e),this.get("_notice").on("mouseenter",()=>this.set({_mouseIsIn:!0})),this.get("_notice").on("mouseleave",()=>this.set({_mouseIsIn:!1}))},doSomething(){let e=0,t=this.get("_notice"),n=setInterval(()=>{360==(e+=10)&&(e=0,clearInterval(n)),t.refs.elem.style.transform="rotate("+e+"deg)"},20)},update(){},beforeOpen(){},afterOpen(){},beforeClose(){},afterClose(){},beforeDestroy(){},afterDestroy(){}};function oncreate(){this.fire("init",{module:this})}function setup(e){e.key="Reference",e.defaults={put_thing:!1,labels:{text:"Spin Around"}},PNotify.modules.Reference=e,PNotify.modulesAppendContainer.push(e),Object.assign(PNotify.icons.brighttheme,{athing:"bt-icon bt-icon-refresh"}),Object.assign(PNotify.icons.bootstrap3,{athing:"glyphicon glyphicon-refresh"}),Object.assign(PNotify.icons.fontawesome4,{athing:"fa fa-refresh"}),Object.assign(PNotify.icons.fontawesome5,{athing:"fas fa-sync"}),PNotify.icons.material||(PNotify.icons.material={}),Object.assign(PNotify.icons.material,{athing:"material-icons pnotify-material-icon-refresh"})}function encapsulateStyles(e){setAttribute(e,"svelte-2659373170","")}function add_css(){var e=createElement("style");e.id="svelte-2659373170-style",e.textContent=".ui-pnotify-reference-button[svelte-2659373170]{float:right}.ui-pnotify-reference-clearing[svelte-2659373170]{clear:right;line-height:0}",appendNode(e,document.head)}function create_main_fragment(e,t){var n,i=e.put_thing&&create_if_block(e,t);return{c:function(){i&&i.c(),n=createComment()},m:function(e,t){i&&i.m(e,t),insertNode(n,e,t)},p:function(e,o){o.put_thing?i?i.p(e,o):((i=create_if_block(o,t)).c(),i.m(n.parentNode,n)):i&&(i.u(),i.d(),i=null)},u:function(){i&&i.u(),detachNode(n)},d:function(){i&&i.d()}}}function create_if_block(e,t){var n,i,o,s,r,a,c,f,l=e.labels.text;function u(e){t.doSomething()}return{c:function(){n=createElement("button"),i=createElement("i"),s=createText(" "),r=createText(l),c=createText("\n  \n  "),f=createElement("div"),this.h()},h:function(){encapsulateStyles(n),encapsulateStyles(i),i.className=o=e._notice.get("_icons").athing,n.className="ui-pnotify-reference-button btn btn-default",n.type="button",n.disabled=a=!e._mouseIsIn,addListener(n,"click",u),encapsulateStyles(f),f.className="ui-pnotify-reference-clearing"},m:function(e,o){insertNode(n,e,o),appendNode(i,n),appendNode(s,n),appendNode(r,n),t.refs.thingElem=n,insertNode(c,e,o),insertNode(f,e,o)},p:function(e,t){e._notice&&o!==(o=t._notice.get("_icons").athing)&&(i.className=o),e.labels&&l!==(l=t.labels.text)&&(r.data=l),e._mouseIsIn&&a!==(a=!t._mouseIsIn)&&(n.disabled=a)},u:function(){detachNode(n),detachNode(c),detachNode(f)},d:function(){removeListener(n,"click",u),t.refs.thingElem===n&&(t.refs.thingElem=null)}}}function PNotifyReference(e){init(this,e),this.refs={},this._state=assign(data(),e.data),document.getElementById("svelte-2659373170-style")||add_css();var t=oncreate.bind(this);e.root?this.root._oncreate.push(t):this._oncreate=[t],this._fragment=create_main_fragment(this._state,this),e.target&&(this._fragment.c(),this._fragment.m(e.target,e.anchor||null),callAll(this._oncreate))}function setAttribute(e,t,n){e.setAttribute(t,n)}function createElement(e){return document.createElement(e)}function appendNode(e,t){t.appendChild(e)}function createComment(){return document.createComment("")}function insertNode(e,t,n){t.insertBefore(e,n)}function detachNode(e){e.parentNode.removeChild(e)}function createText(e){return document.createTextNode(e)}function addListener(e,t,n){e.addEventListener(t,n,!1)}function removeListener(e,t,n){e.removeEventListener(t,n,!1)}function init(e,t){e._observers={pre:blankObject(),post:blankObject()},e._handlers=blankObject(),e._bind=t._bind,e.options=t,e.root=t.root||e,e.store=e.root.store||t.store}function assign(e){for(var t,n,i=1,o=arguments.length;i<o;i++)for(t in n=arguments[i])e[t]=n[t];return e}function callAll(e){for(;e&&e.length;)e.pop()()}function destroy(e){this.destroy=noop,this.fire("destroy"),this.set=this.get=noop,!1!==e&&this._fragment.u(),this._fragment.d(),this._fragment=this._state=null}function get(e){return e?this._state[e]:this._state}function fire(e,t){var n=e in this._handlers&&this._handlers[e].slice();if(n)for(var i=0;i<n.length;i+=1)n[i].call(this,t)}function observe(e,t,n){var i=n&&n.defer?this._observers.post:this._observers.pre;return(i[e]||(i[e]=[])).push(t),n&&!1===n.init||(t.__calling=!0,t.call(this,this._state[e]),t.__calling=!1),{cancel:function(){var n=i[e].indexOf(t);~n&&i[e].splice(n,1)}}}function on(e,t){if("teardown"===e)return this.on("destroy",t);var n=this._handlers[e]||(this._handlers[e]=[]);return n.push(t),{cancel:function(){var e=n.indexOf(t);~e&&n.splice(e,1)}}}function set(e){this._set(assign({},e)),this.root._lock||(this.root._lock=!0,callAll(this.root._beforecreate),callAll(this.root._oncreate),callAll(this.root._aftercreate),this.root._lock=!1)}function _set(e){var t=this._state,n={},i=!1;for(var o in e)differs(e[o],t[o])&&(n[o]=i=!0);i&&(this._state=assign({},t,e),this._recompute(n,this._state),this._bind&&this._bind(n,this._state),this._fragment&&(dispatchObservers(this,this._observers.pre,n,this._state,t),this._fragment.p(n,this._state),dispatchObservers(this,this._observers.post,n,this._state,t)))}function _mount(e,t){this._fragment.m(e,t)}function _unmount(){this._fragment&&this._fragment.u()}function noop(){}function blankObject(){return Object.create(null)}function differs(e,t){return e!==t||e&&"object"==typeof e||"function"==typeof e}function dispatchObservers(e,t,n,i,o){for(var s in t)if(n[s]){var r=i[s],a=o[s],c=t[s];if(c)for(var f=0;f<c.length;f+=1){var l=c[f];l.__calling||(l.__calling=!0,l.call(e,r,a),l.__calling=!1)}}}assign(PNotifyReference.prototype,methods,{destroy:destroy,get:get,fire:fire,observe:observe,on:on,set:set,teardown:destroy,_set:_set,_mount:_mount,_unmount:_unmount}),PNotifyReference.prototype._recompute=noop,setup(PNotifyReference);export default PNotifyReference;
//# sourceMappingURL=PNotifyReference.js.map