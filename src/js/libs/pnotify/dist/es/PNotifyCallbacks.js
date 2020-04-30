import PNotify from"./PNotify.js";let _open=PNotify.prototype.open,_close=PNotify.prototype.close;const callbacks=(t,e,s)=>{let o=t?t.get("modules"):e.modules,i=o&&o.Callbacks?o.Callbacks:{};return i[s]?i[s]:()=>!0};function setup(t){t.key="Callbacks";let e=PNotify.alert,s=PNotify.notice,o=PNotify.info,i=PNotify.success,n=PNotify.error,r=(t,e)=>{callbacks(null,e,"before_init")(e);let s=t(e);return callbacks(s,null,"after_init")(s),s};PNotify.alert=(t=>r(e,t)),PNotify.notice=(t=>r(s,t)),PNotify.info=(t=>r(o,t)),PNotify.success=(t=>r(i,t)),PNotify.error=(t=>r(n,t)),PNotify.modules.Callbacks=t}function create_main_fragment(t,e){return{c:noop,m:noop,p:noop,u:noop,d:noop}}function PNotifyCallbacks(t){init(this,t),this._state=assign({},t.data),this._fragment=create_main_fragment(this._state,this),t.target&&(this._fragment.c(),this._fragment.m(t.target,t.anchor||null))}function noop(){}function init(t,e){t._observers={pre:blankObject(),post:blankObject()},t._handlers=blankObject(),t._bind=e._bind,t.options=e,t.root=e.root||t,t.store=t.root.store||e.store}function assign(t){for(var e,s,o=1,i=arguments.length;o<i;o++)for(e in s=arguments[o])t[e]=s[e];return t}function destroy(t){this.destroy=noop,this.fire("destroy"),this.set=this.get=noop,!1!==t&&this._fragment.u(),this._fragment.d(),this._fragment=this._state=null}function get(t){return t?this._state[t]:this._state}function fire(t,e){var s=t in this._handlers&&this._handlers[t].slice();if(s)for(var o=0;o<s.length;o+=1)s[o].call(this,e)}function observe(t,e,s){var o=s&&s.defer?this._observers.post:this._observers.pre;return(o[t]||(o[t]=[])).push(e),s&&!1===s.init||(e.__calling=!0,e.call(this,this._state[t]),e.__calling=!1),{cancel:function(){var s=o[t].indexOf(e);~s&&o[t].splice(s,1)}}}function on(t,e){if("teardown"===t)return this.on("destroy",e);var s=this._handlers[t]||(this._handlers[t]=[]);return s.push(e),{cancel:function(){var t=s.indexOf(e);~t&&s.splice(t,1)}}}function set(t){this._set(assign({},t)),this.root._lock||(this.root._lock=!0,callAll(this.root._beforecreate),callAll(this.root._oncreate),callAll(this.root._aftercreate),this.root._lock=!1)}function _set(t){var e=this._state,s={},o=!1;for(var i in t)differs(t[i],e[i])&&(s[i]=o=!0);o&&(this._state=assign({},e,t),this._recompute(s,this._state),this._bind&&this._bind(s,this._state),this._fragment&&(dispatchObservers(this,this._observers.pre,s,this._state,e),this._fragment.p(s,this._state),dispatchObservers(this,this._observers.post,s,this._state,e)))}function _mount(t,e){this._fragment.m(t,e)}function _unmount(){this._fragment&&this._fragment.u()}function blankObject(){return Object.create(null)}function callAll(t){for(;t&&t.length;)t.pop()()}function differs(t,e){return t!==e||t&&"object"==typeof t||"function"==typeof t}function dispatchObservers(t,e,s,o,i){for(var n in e)if(s[n]){var r=o[n],a=i[n],l=e[n];if(l)for(var c=0;c<l.length;c+=1){var f=l[c];f.__calling||(f.__calling=!0,f.call(t,r,a),f.__calling=!1)}}}PNotify.prototype.open=function(...t){!1!==callbacks(this,null,"before_open")(this)&&(_open.apply(this,t),callbacks(this,null,"after_open")(this))},PNotify.prototype.close=function(t,...e){!1!==callbacks(this,null,"before_close")(this,t)&&(_close.apply(this,[t,...e]),callbacks(this,null,"after_close")(this,t))},assign(PNotifyCallbacks.prototype,{destroy:destroy,get:get,fire:fire,observe:observe,on:on,set:set,teardown:destroy,_set:_set,_mount:_mount,_unmount:_unmount}),PNotifyCallbacks.prototype._recompute=noop,setup(PNotifyCallbacks);export default PNotifyCallbacks;
//# sourceMappingURL=PNotifyCallbacks.js.map