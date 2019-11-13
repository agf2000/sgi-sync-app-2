let PNotify,posTimer,onDocumentLoaded=()=>{PNotify.defaultStack.context=document.body,window.addEventListener("resize",()=>{posTimer&&clearTimeout(posTimer),posTimer=setTimeout(()=>{PNotify.positionAll()},10)})},createStackOverlay=t=>{const e=document.createElement("div");return e.classList.add("ui-pnotify-modal-overlay"),t.context.insertBefore(e,t.context.firstChild),t.context!==document.body&&(e.style.height=t.context.scrollHeight+"px",e.style.width=t.context.scrollWidth+"px"),e.addEventListener("click",()=>{t.overlay_close&&PNotify.closeStack(t)}),e};const getDefaultArgs=(t,e)=>("object"!=typeof t&&(t={text:t}),e&&(t.type=e),{target:document.body,data:t});function _styles(t){return"object"==typeof t?t:PNotify.styling[t]}function _icons(t){return"object"==typeof t?t:PNotify.icons[t]}function data(){const t=Object.assign({_state:"initializing",_timer:null,_animTimer:null,_animating:!1,_animatingClass:"",_moveClass:"",_timerHide:!1,_moduleClasses:[],_moduleIsNoticeOpen:!1,_modules:{},_modulesPrependContainer:PNotify.modulesPrependContainer,_modulesAppendContainer:PNotify.modulesAppendContainer},PNotify.defaults);return t.modules=Object.assign({},PNotify.defaults.modules),t}var methods={runModules(t){if("init"===t){for(let t in PNotify.modules)if("function"==typeof PNotify.modules[t].init){const e=PNotify.modules[t].init(this);this.initModule(e)}}else{const e=this.get("_modules");for(let i in e){const o=Object.assign({_notice:this,_options:this.get()},this.get("modules")[i]);e[i].set(o),"function"==typeof e[i][t]&&e[i][t]()}}},initModule(t){const e=this.get("modules");e.hasOwnProperty(t.constructor.key)||(e[t.constructor.key]={});const i=Object.assign({_notice:this,_options:this.get()},e[t.constructor.key]);t.initModule(i),this.get("_modules")[t.constructor.key]=t},update(t){const e=this.get("hide"),i=this.get("icon");this.set(t),this.runModules("update"),this.get("hide")?e||this.queueClose():this.cancelClose(),this.queuePosition();const o=this.get("icon");return o!==i&&(!0===o&&"fontawesome5"===this.get("icons")||"string"==typeof o&&o.match(/(^| )fa[srlb]($| )/))&&(this.set({icon:!1}),this.set({icon:o})),this},open(){if("opening"===this.get("_state"))return;if("open"===this.get("_state"))return void(this.get("hide")&&this.queueClose());this.set({_state:"opening",_animatingClass:"ui-pnotify-initial-hidden"}),this.runModules("beforeOpen");let t=this.get("stack");if(!this.refs.elem.parentNode||t&&t.context&&t.context!==this.refs.elem.parentNode)if(t&&t.context)t.context.appendChild(this.refs.elem);else{if(!document.body)throw new Error("No context to open this notice in.");document.body.appendChild(this.refs.elem)}return setTimeout(()=>{t&&(t.animation=!1,PNotify.positionAll(),t.animation=!0),this.animateIn(()=>{this.get("hide")&&this.queueClose(),this.set({_state:"open"}),this.runModules("afterOpen")})},0),this},remove(t){this.close(t)},close(t){if("closing"!==this.get("_state")&&"closed"!==this.get("_state"))return this.set({_state:"closing",_timerHide:!!t}),this.runModules("beforeClose"),this.get("_timer")&&clearTimeout&&(clearTimeout(this.get("_timer")),this.set({_timer:null})),this.animateOut(()=>{if(this.set({_state:"closed"}),this.runModules("afterClose"),this.queuePosition(),this.get("remove")&&this.refs.elem.parentNode.removeChild(this.refs.elem),this.runModules("beforeDestroy"),this.get("destroy")&&null!==PNotify.notices){const t=PNotify.notices.indexOf(this);-1!==t&&PNotify.notices.splice(t,1)}this.runModules("afterDestroy")}),this},animateIn(t){this.set({_animating:"in"});const e=()=>{if(this.refs.elem.removeEventListener("transitionend",e),this.get("_animTimer")&&clearTimeout(this.get("_animTimer")),"in"!==this.get("_animating"))return;let i=this.get("_moduleIsNoticeOpen");if(!i){const t=this.refs.elem.getBoundingClientRect();for(let e in t)if(t[e]>0){i=!0;break}}i?(t&&t.call(),this.set({_animating:!1})):this.set({_animTimer:setTimeout(e,40)})};"fade"===this.get("animation")?(this.refs.elem.addEventListener("transitionend",e),this.set({_animatingClass:"ui-pnotify-in"}),this.refs.elem.style.opacity,this.set({_animatingClass:"ui-pnotify-in ui-pnotify-fade-in"}),this.set({_animTimer:setTimeout(e,650)})):(this.set({_animatingClass:"ui-pnotify-in"}),e())},animateOut(t){this.set({_animating:"out"});const e=()=>{if(this.refs.elem.removeEventListener("transitionend",e),this.get("_animTimer")&&clearTimeout(this.get("_animTimer")),"out"!==this.get("_animating"))return;let i=this.get("_moduleIsNoticeOpen");if(!i){const t=this.refs.elem.getBoundingClientRect();for(let e in t)if(t[e]>0){i=!0;break}}if(this.refs.elem.style.opacity&&"0"!=this.refs.elem.style.opacity&&i)this.set({_animTimer:setTimeout(e,40)});else{this.set({_animatingClass:""});const e=this.get("stack");if(e&&e.overlay){let t=!1;for(let i=0;i<PNotify.notices.length;i++){const o=PNotify.notices[i];if(o!=this&&o.get("stack")===e&&"closed"!==o.get("_state")){t=!0;break}}t||e.overlay.classList.add("ui-pnotify-modal-overlay-hidden")}t&&t.call(),this.set({_animating:!1})}};"fade"===this.get("animation")?(this.refs.elem.addEventListener("transitionend",e),this.set({_animatingClass:"ui-pnotify-in"}),this.set({_animTimer:setTimeout(e,650)})):(this.set({_animatingClass:""}),e())},position(){let t=this.get("stack"),e=this.refs.elem;if(!t)return;if(t.context||(t.context=document.body),"number"!=typeof t.nextpos1&&(t.nextpos1=t.firstpos1),"number"!=typeof t.nextpos2&&(t.nextpos2=t.firstpos2),"number"!=typeof t.addpos2&&(t.addpos2=0),!e.classList.contains("ui-pnotify-in")&&!e.classList.contains("ui-pnotify-initial-hidden"))return this;t.modal&&(t.overlay?t.overlay.classList.remove("ui-pnotify-modal-overlay-hidden"):t.overlay=createStackOverlay(t));e.getBoundingClientRect();t.animation&&this.set({_moveClass:"ui-pnotify-move"});let i,o=t.context===document.body?window.innerHeight:t.context.scrollHeight,n=t.context===document.body?window.innerWidth:t.context.scrollWidth;if(t.dir1){let s;switch(i={down:"top",up:"bottom",left:"right",right:"left"}[t.dir1],t.dir1){case"down":s=e.offsetTop;break;case"up":s=o-e.scrollHeight-e.offsetTop;break;case"left":s=n-e.scrollWidth-e.offsetLeft;break;case"right":s=e.offsetLeft}void 0===t.firstpos1&&(t.firstpos1=s,t.nextpos1=t.firstpos1)}if(t.dir1&&t.dir2){let i,s={down:"top",up:"bottom",left:"right",right:"left"}[t.dir2];switch(t.dir2){case"down":i=e.offsetTop;break;case"up":i=o-e.scrollHeight-e.offsetTop;break;case"left":i=n-e.scrollWidth-e.offsetLeft;break;case"right":i=e.offsetLeft}void 0===t.firstpos2&&(t.firstpos2=i,t.nextpos2=t.firstpos2);const a=t.nextpos1+e.offsetHeight+(void 0===t.spacing1?25:t.spacing1),r=t.nextpos1+e.offsetWidth+(void 0===t.spacing1?25:t.spacing1);switch((("down"===t.dir1||"up"===t.dir1)&&a>o||("left"===t.dir1||"right"===t.dir1)&&r>n)&&(t.nextpos1=t.firstpos1,t.nextpos2+=t.addpos2+(void 0===t.spacing2?25:t.spacing2),t.addpos2=0),"number"==typeof t.nextpos2&&(e.style[s]=t.nextpos2+"px",t.animation||e.style[s]),t.dir2){case"down":case"up":e.offsetHeight+(parseFloat(e.style.marginTop,10)||0)+(parseFloat(e.style.marginBottom,10)||0)>t.addpos2&&(t.addpos2=e.offsetHeight);break;case"left":case"right":e.offsetWidth+(parseFloat(e.style.marginLeft,10)||0)+(parseFloat(e.style.marginRight,10)||0)>t.addpos2&&(t.addpos2=e.offsetWidth)}}else if(t.dir1){let i,n;switch(t.dir1){case"down":case"up":n=["left","right"],i=t.context.scrollWidth/2-e.offsetWidth/2;break;case"left":case"right":n=["top","bottom"],i=o/2-e.offsetHeight/2}e.style[n[0]]=i+"px",e.style[n[1]]="auto",t.animation||e.style[n[0]]}if(t.dir1)switch("number"==typeof t.nextpos1&&(e.style[i]=t.nextpos1+"px",t.animation||e.style[i]),t.dir1){case"down":case"up":t.nextpos1+=e.offsetHeight+(void 0===t.spacing1?25:t.spacing1);break;case"left":case"right":t.nextpos1+=e.offsetWidth+(void 0===t.spacing1?25:t.spacing1)}else{let i=n/2-e.offsetWidth/2,s=o/2-e.offsetHeight/2;e.style.left=i+"px",e.style.top=s+"px",t.animation||e.style.left}return this},queuePosition(t){return posTimer&&clearTimeout(posTimer),t||(t=10),posTimer=setTimeout(()=>{PNotify.positionAll()},t),this},cancelRemove(){this.cancelClose()},cancelClose(){return this.get("_timer")&&clearTimeout(this.get("_timer")),this.get("_animTimer")&&clearTimeout(this.get("_animTimer")),"closing"===this.get("_state")&&this.set({_state:"open",_animating:!1,_animatingClass:"fade"===this.get("animation")?"ui-pnotify-in ui-pnotify-fade-in":"ui-pnotify-in"}),this},queueRemove(){this.queueClose()},queueClose(){return this.cancelClose(),this.set({_timer:setTimeout(()=>this.close(!0),isNaN(this.get("delay"))?0:this.get("delay"))}),this},addModuleClass(...t){const e=this.get("_moduleClasses");for(let i of t)-1===e.indexOf(i)&&e.push(i);this.set({_moduleClasses:e})},removeModuleClass(...t){const e=this.get("_moduleClasses");for(let i of t){const t=e.indexOf(i);-1!==t&&e.splice(t,1)}this.set({_moduleClasses:e})},hasModuleClass(...t){for(let e of t){if(-1===this.get("_moduleClasses").indexOf(e))return!1}return!0}};function oncreate(){this.on("mouseenter",t=>{if(this.get("mouse_reset")&&"out"===this.get("_animating")){if(!this.get("_timerHide"))return;this.cancelClose()}this.get("hide")&&this.get("mouse_reset")&&this.cancelClose()}),this.on("mouseleave",t=>{this.get("hide")&&this.get("mouse_reset")&&"out"!==this.get("_animating")&&this.queueClose(),PNotify.positionAll()});let t=this.get("stack");t&&"top"===t.push?PNotify.notices.splice(0,0,this):PNotify.notices.push(this),this.runModules("init"),this.set({_state:"closed"}),this.get("auto_display")&&this.open()}function setup(t){(PNotify=t).VERSION="4.0.0-dev",PNotify.defaultStack={dir1:"down",dir2:"left",firstpos1:25,firstpos2:25,spacing1:36,spacing2:36,push:"bottom",context:window&&document.body},PNotify.defaults={title:!1,trust_title:!1,text:!1,trust_text:!1,styling:"brighttheme",icons:"brighttheme",addclass:"",cornerclass:"",auto_display:!0,width:"360px",min_height:"16px",type:"notice",icon:!0,animation:"fade",animate_speed:"normal",shadow:!0,hide:!0,delay:8e3,mouse_reset:!0,remove:!0,destroy:!0,stack:PNotify.defaultStack,modules:{}},PNotify.notices=[],PNotify.modules={},PNotify.modulesPrependContainer=[],PNotify.modulesAppendContainer=[],PNotify.alert=(t=>new PNotify(getDefaultArgs(t))),PNotify.notice=(t=>new PNotify(getDefaultArgs(t,"notice"))),PNotify.info=(t=>new PNotify(getDefaultArgs(t,"info"))),PNotify.success=(t=>new PNotify(getDefaultArgs(t,"success"))),PNotify.error=(t=>new PNotify(getDefaultArgs(t,"error"))),PNotify.removeAll=(()=>{PNotify.closeAll()}),PNotify.closeAll=(()=>{for(let t=0;t<PNotify.notices.length;t++)PNotify.notices[t].close&&PNotify.notices[t].close(!1)}),PNotify.removeStack=(t=>{PNotify.closeStack(t)}),PNotify.closeStack=(t=>{if(!1!==t)for(let e=0;e<PNotify.notices.length;e++)PNotify.notices[e].close&&PNotify.notices[e].get("stack")===t&&PNotify.notices[e].close(!1)}),PNotify.positionAll=(()=>{if(posTimer&&clearTimeout(posTimer),posTimer=null,PNotify.notices.length>0){for(let t=0;t<PNotify.notices.length;t++){let e=PNotify.notices[t].get("stack");e&&(e.overlay&&e.overlay.classList.add("ui-pnotify-modal-overlay-hidden"),e.nextpos1=e.firstpos1,e.nextpos2=e.firstpos2,e.addpos2=0)}for(let t=0;t<PNotify.notices.length;t++)PNotify.notices[t].position()}else delete PNotify.defaultStack.nextpos1,delete PNotify.defaultStack.nextpos2}),PNotify.styling={brighttheme:{container:"brighttheme",notice:"brighttheme-notice",info:"brighttheme-info",success:"brighttheme-success",error:"brighttheme-error"},bootstrap3:{container:"alert",notice:"alert-warning",info:"alert-info",success:"alert-success",error:"alert-danger",icon:"ui-pnotify-icon-bs3"},bootstrap4:{container:"alert",notice:"alert-warning",info:"alert-info",success:"alert-success",error:"alert-danger",icon:"ui-pnotify-icon-bs4",title:"ui-pnotify-title-bs4"}},PNotify.icons={brighttheme:{notice:"brighttheme-icon-notice",info:"brighttheme-icon-info",success:"brighttheme-icon-success",error:"brighttheme-icon-error"},bootstrap3:{notice:"glyphicon glyphicon-exclamation-sign",info:"glyphicon glyphicon-info-sign",success:"glyphicon glyphicon-ok-sign",error:"glyphicon glyphicon-warning-sign"},fontawesome4:{notice:"fa fa-exclamation-circle",info:"fa fa-info-circle",success:"fa fa-check-circle",error:"fa fa-exclamation-triangle"},fontawesome5:{notice:"fas fa-exclamation-circle",info:"fas fa-info-circle",success:"fas fa-check-circle",error:"fas fa-exclamation-triangle"}},window&&document.body?onDocumentLoaded():document.addEventListener("DOMContentLoaded",onDocumentLoaded)}function add_css(){var t=createElement("style");t.id="svelte-2084218827-style",t.textContent='body > .ui-pnotify{position:fixed;z-index:100040}body > .ui-pnotify.ui-pnotify-modal{z-index:100042}.ui-pnotify{position:absolute;height:auto;z-index:1;display:none}.ui-pnotify.ui-pnotify-modal{z-index:3}.ui-pnotify.ui-pnotify-in{display:block}.ui-pnotify.ui-pnotify-initial-hidden{display:block;visibility:hidden}.ui-pnotify.ui-pnotify-move{transition:left .5s ease, top .5s ease, right .5s ease, bottom .5s ease}.ui-pnotify.ui-pnotify-fade-slow{transition:opacity .4s linear;opacity:0}.ui-pnotify.ui-pnotify-fade-slow.ui-pnotify.ui-pnotify-move{transition:opacity .4s linear, left .5s ease, top .5s ease, right .5s ease, bottom .5s ease}.ui-pnotify.ui-pnotify-fade-normal{transition:opacity .25s linear;opacity:0}.ui-pnotify.ui-pnotify-fade-normal.ui-pnotify.ui-pnotify-move{transition:opacity .25s linear, left .5s ease, top .5s ease, right .5s ease, bottom .5s ease}.ui-pnotify.ui-pnotify-fade-fast{transition:opacity .1s linear;opacity:0}.ui-pnotify.ui-pnotify-fade-fast.ui-pnotify.ui-pnotify-move{transition:opacity .1s linear, left .5s ease, top .5s ease, right .5s ease, bottom .5s ease}.ui-pnotify.ui-pnotify-fade-in{opacity:1}.ui-pnotify .ui-pnotify-shadow{-webkit-box-shadow:0px 6px 28px 0px rgba(0,0,0,0.1);-moz-box-shadow:0px 6px 28px 0px rgba(0,0,0,0.1);box-shadow:0px 6px 28px 0px rgba(0,0,0,0.1)}.ui-pnotify-container{background-position:0 0;padding:.8em;height:100%;margin:0}.ui-pnotify-container:after{content:" ";visibility:hidden;display:block;height:0;clear:both}.ui-pnotify-container.ui-pnotify-sharp{-webkit-border-radius:0;-moz-border-radius:0;border-radius:0}.ui-pnotify-title{display:block;white-space:pre-line;margin-bottom:.4em;margin-top:0}.ui-pnotify.ui-pnotify-with-icon .ui-pnotify-title,.ui-pnotify.ui-pnotify-with-icon .ui-pnotify-text{margin-left:24px}.ui-pnotify-title-bs4{font-size:1.2rem}.ui-pnotify-text{display:block;white-space:pre-line}.ui-pnotify-icon, .ui-pnotify-icon span{display:block;float:left}.ui-pnotify-icon-bs3 > span{position:relative;top:2px}.ui-pnotify-icon-bs4 > span{position:relative;top:4px}.ui-pnotify-modal-overlay{background-color:rgba(0, 0, 0, .4);top:0;left:0;position:absolute;height:100%;width:100%;z-index:2}body > .ui-pnotify-modal-overlay{position:fixed;z-index:100041}.ui-pnotify-modal-overlay-hidden{display:none}',appendNode(t,document.head)}function create_main_fragment(t,e){for(var i,o,n,s,a,r,c,l,f,u,d,h,p,m=t._modulesPrependContainer,y=[],_=0;_<m.length;_+=1)y[_]=create_each_block(t,m,m[_],_,e);var g=!1!==t.icon&&create_if_block(t,e),b=select_block_type(t),v=b(t,e),N=select_block_type_1(t),x=N(t,e),k=t._modulesAppendContainer,w=[];for(_=0;_<k.length;_+=1)w[_]=create_each_block_1(t,k,k[_],_,e);function P(t){e.fire("mouseover",t)}function C(t){e.fire("mouseout",t)}function L(t){e.fire("mouseenter",t)}function T(t){e.fire("mouseleave",t)}function A(t){e.fire("mousemove",t)}function O(t){e.fire("mousedown",t)}function E(t){e.fire("mouseup",t)}function M(t){e.fire("click",t)}function S(t){e.fire("dblclick",t)}function j(t){e.fire("focus",t)}function H(t){e.fire("blur",t)}function B(t){e.fire("touchstart",t)}function D(t){e.fire("touchmove",t)}function W(t){e.fire("touchend",t)}function z(t){e.fire("touchcancel",t)}return{c:function(){i=createElement("div"),o=createElement("div");for(var t=0;t<y.length;t+=1)y[t].c();n=createText("\n    "),g&&g.c(),s=createText("\n    "),a=createElement("h4"),v.c(),c=createText("\n    "),l=createElement("div"),x.c(),u=createText("\n    ");for(t=0;t<w.length;t+=1)w[t].c();this.h()},h:function(){a.className=r="ui-pnotify-title "+(t._styles.title?t._styles.title:""),setStyle(a,"display",!1===t.title?"none":"block"),l.className=f="ui-pnotify-text "+(t._styles.text?t._styles.text:""),setStyle(l,"display",!1===t.text?"none":"block"),setAttribute(l,"role","alert"),o.className=d="\n        ui-pnotify-container\n        "+(t._styles.container?t._styles.container:"")+"\n        "+(t._styles[t.type]?t._styles[t.type]:"")+"\n        "+t.cornerclass+"\n        "+(t.shadow?"ui-pnotify-shadow":"")+"\n      ",o.style.cssText=h="\n        "+("string"==typeof t.width?"width: "+t.width+";":"")+"\n        "+("string"==typeof t.min_height?"min-height: "+t.min_height+";":"")+"\n      ",setAttribute(o,"role","alert"),i.className=p="\n      ui-pnotify\n      "+(!1!==t.icon?"ui-pnotify-with-icon":"")+"\n      "+(t._styles.element?t._styles.element:"")+"\n      "+t.addclass+"\n      "+t._animatingClass+"\n      "+t._moveClass+"\n      "+("fade"===t.animation?"ui-pnotify-fade-"+t.animate_speed:"")+"\n      "+(t.stack&&t.stack.modal?"ui-pnotify-modal":"")+"\n      "+t._moduleClasses.join(" ")+"\n    ",setAttribute(i,"aria-live","assertive"),setAttribute(i,"role","alertdialog"),setAttribute(i,"ui-pnotify",!0),addListener(i,"mouseover",P),addListener(i,"mouseout",C),addListener(i,"mouseenter",L),addListener(i,"mouseleave",T),addListener(i,"mousemove",A),addListener(i,"mousedown",O),addListener(i,"mouseup",E),addListener(i,"click",M),addListener(i,"dblclick",S),addListener(i,"focus",j),addListener(i,"blur",H),addListener(i,"touchstart",B),addListener(i,"touchmove",D),addListener(i,"touchend",W),addListener(i,"touchcancel",z)},m:function(t,r){insertNode(i,t,r),appendNode(o,i);for(var f=0;f<y.length;f+=1)y[f].m(o,null);appendNode(n,o),g&&g.m(o,null),appendNode(s,o),appendNode(a,o),v.m(a,null),e.refs.titleContainer=a,appendNode(c,o),appendNode(l,o),x.m(l,null),e.refs.textContainer=l,appendNode(u,o);for(f=0;f<w.length;f+=1)w[f].m(o,null);e.refs.container=o,e.refs.elem=i},p:function(t,c){var u=c._modulesPrependContainer;if(t._modulesPrependContainer){for(var m=y.length;m<u.length;m+=1)y[m]=create_each_block(c,u,u[m],m,e),y[m].c(),y[m].m(o,n);for(;m<y.length;m+=1)y[m].u(),y[m].d();y.length=u.length}!1!==c.icon?g?g.p(t,c):((g=create_if_block(c,e)).c(),g.m(o,s)):g&&(g.u(),g.d(),g=null),b===(b=select_block_type(c))&&v?v.p(t,c):(v.u(),v.d(),(v=b(c,e)).c(),v.m(a,null)),t._styles&&r!==(r="ui-pnotify-title "+(c._styles.title?c._styles.title:""))&&(a.className=r),t.title&&setStyle(a,"display",!1===c.title?"none":"block"),N===(N=select_block_type_1(c))&&x?x.p(t,c):(x.u(),x.d(),(x=N(c,e)).c(),x.m(l,null)),t._styles&&f!==(f="ui-pnotify-text "+(c._styles.text?c._styles.text:""))&&(l.className=f),t.text&&setStyle(l,"display",!1===c.text?"none":"block");var _=c._modulesAppendContainer;if(t._modulesAppendContainer){for(m=w.length;m<_.length;m+=1)w[m]=create_each_block_1(c,_,_[m],m,e),w[m].c(),w[m].m(o,null);for(;m<w.length;m+=1)w[m].u(),w[m].d();w.length=_.length}(t._styles||t.type||t.cornerclass||t.shadow)&&d!==(d="\n        ui-pnotify-container\n        "+(c._styles.container?c._styles.container:"")+"\n        "+(c._styles[c.type]?c._styles[c.type]:"")+"\n        "+c.cornerclass+"\n        "+(c.shadow?"ui-pnotify-shadow":"")+"\n      ")&&(o.className=d),(t.width||t.min_height)&&h!==(h="\n        "+("string"==typeof c.width?"width: "+c.width+";":"")+"\n        "+("string"==typeof c.min_height?"min-height: "+c.min_height+";":"")+"\n      ")&&(o.style.cssText=h),(t.icon||t._styles||t.addclass||t._animatingClass||t._moveClass||t.animation||t.animate_speed||t.stack||t._moduleClasses)&&p!==(p="\n      ui-pnotify\n      "+(!1!==c.icon?"ui-pnotify-with-icon":"")+"\n      "+(c._styles.element?c._styles.element:"")+"\n      "+c.addclass+"\n      "+c._animatingClass+"\n      "+c._moveClass+"\n      "+("fade"===c.animation?"ui-pnotify-fade-"+c.animate_speed:"")+"\n      "+(c.stack&&c.stack.modal?"ui-pnotify-modal":"")+"\n      "+c._moduleClasses.join(" ")+"\n    ")&&(i.className=p)},u:function(){detachNode(i);for(var t=0;t<y.length;t+=1)y[t].u();g&&g.u(),v.u(),x.u();for(t=0;t<w.length;t+=1)w[t].u()},d:function(){destroyEach(y),g&&g.d(),v.d(),e.refs.titleContainer===a&&(e.refs.titleContainer=null),x.d(),e.refs.textContainer===l&&(e.refs.textContainer=null),destroyEach(w),e.refs.container===o&&(e.refs.container=null),removeListener(i,"mouseover",P),removeListener(i,"mouseout",C),removeListener(i,"mouseenter",L),removeListener(i,"mouseleave",T),removeListener(i,"mousemove",A),removeListener(i,"mousedown",O),removeListener(i,"mouseup",E),removeListener(i,"click",M),removeListener(i,"dblclick",S),removeListener(i,"focus",j),removeListener(i,"blur",H),removeListener(i,"touchstart",B),removeListener(i,"touchmove",D),removeListener(i,"touchend",W),removeListener(i,"touchcancel",z),e.refs.elem===i&&(e.refs.elem=null)}}}function create_each_block(t,e,i,o,n){var s;if(i)var a=new i({root:n.root});return a&&a.on("init",function(t){n.initModule(t.module)}),{c:function(){s=createComment(),a&&a._fragment.c()},m:function(t,e){insertNode(s,t,e),a&&a._mount(t,e)},u:function(){detachNode(s),a&&a._unmount()},d:function(){a&&a.destroy(!1)}}}function create_if_block(t,e){var i,o,n,s;return{c:function(){i=createElement("div"),o=createElement("span"),this.h()},h:function(){o.className=n=!0===t.icon?t._icons[t.type]?t._icons[t.type]:"":t.icon,i.className=s="ui-pnotify-icon "+(t._styles.icon?t._styles.icon:"")},m:function(t,e){insertNode(i,t,e),appendNode(o,i)},p:function(t,e){(t.icon||t._icons||t.type)&&n!==(n=!0===e.icon?e._icons[e.type]?e._icons[e.type]:"":e.icon)&&(o.className=n),t._styles&&s!==(s="ui-pnotify-icon "+(e._styles.icon?e._styles.icon:""))&&(i.className=s)},u:function(){detachNode(i)},d:noop}}function create_if_block_1(t,e){var i,o;return{c:function(){i=createElement("noscript"),o=createElement("noscript")},m:function(e,n){insertNode(i,e,n),i.insertAdjacentHTML("afterend",t.title),insertNode(o,e,n)},p:function(t,e){t.title&&(detachBetween(i,o),i.insertAdjacentHTML("afterend",e.title))},u:function(){detachBetween(i,o),detachNode(i),detachNode(o)},d:noop}}function create_if_block_2(t,e){var i;return{c:function(){i=createText(t.title)},m:function(t,e){insertNode(i,t,e)},p:function(t,e){t.title&&(i.data=e.title)},u:function(){detachNode(i)},d:noop}}function create_if_block_3(t,e){var i,o;return{c:function(){i=createElement("noscript"),o=createElement("noscript")},m:function(e,n){insertNode(i,e,n),i.insertAdjacentHTML("afterend",t.text),insertNode(o,e,n)},p:function(t,e){t.text&&(detachBetween(i,o),i.insertAdjacentHTML("afterend",e.text))},u:function(){detachBetween(i,o),detachNode(i),detachNode(o)},d:noop}}function create_if_block_4(t,e){var i;return{c:function(){i=createText(t.text)},m:function(t,e){insertNode(i,t,e)},p:function(t,e){t.text&&(i.data=e.text)},u:function(){detachNode(i)},d:noop}}function create_each_block_1(t,e,i,o,n){var s;if(i)var a=new i({root:n.root});return a&&a.on("init",function(t){n.initModule(t.module)}),{c:function(){s=createComment(),a&&a._fragment.c()},m:function(t,e){insertNode(s,t,e),a&&a._mount(t,e)},u:function(){detachNode(s),a&&a._unmount()},d:function(){a&&a.destroy(!1)}}}function select_block_type(t){return t.trust_title?create_if_block_1:create_if_block_2}function select_block_type_1(t){return t.trust_text?create_if_block_3:create_if_block_4}function PNotify_1(t){init(this,t),this.refs={},this._state=assign(data(),t.data),this._recompute({styling:1,icons:1},this._state),document.getElementById("svelte-2084218827-style")||add_css();var e=oncreate.bind(this);t.root?this.root._oncreate.push(e):(this._oncreate=[e],this._beforecreate=[],this._aftercreate=[]),this._fragment=create_main_fragment(this._state,this),t.target&&(this._fragment.c(),this._fragment.m(t.target,t.anchor||null),this._lock=!0,callAll(this._beforecreate),callAll(this._oncreate),callAll(this._aftercreate),this._lock=!1)}function createElement(t){return document.createElement(t)}function appendNode(t,e){e.appendChild(t)}function createText(t){return document.createTextNode(t)}function setStyle(t,e,i){t.style.setProperty(e,i)}function setAttribute(t,e,i){t.setAttribute(e,i)}function addListener(t,e,i){t.addEventListener(e,i,!1)}function insertNode(t,e,i){e.insertBefore(t,i)}function detachNode(t){t.parentNode.removeChild(t)}function destroyEach(t){for(var e=0;e<t.length;e+=1)t[e]&&t[e].d()}function removeListener(t,e,i){t.removeEventListener(e,i,!1)}function createComment(){return document.createComment("")}function noop(){}function detachBetween(t,e){for(;t.nextSibling&&t.nextSibling!==e;)t.parentNode.removeChild(t.nextSibling)}function init(t,e){t._observers={pre:blankObject(),post:blankObject()},t._handlers=blankObject(),t._bind=e._bind,t.options=e,t.root=e.root||t,t.store=t.root.store||e.store}function assign(t){for(var e,i,o=1,n=arguments.length;o<n;o++)for(e in i=arguments[o])t[e]=i[e];return t}function callAll(t){for(;t&&t.length;)t.pop()()}function destroy(t){this.destroy=noop,this.fire("destroy"),this.set=this.get=noop,!1!==t&&this._fragment.u(),this._fragment.d(),this._fragment=this._state=null}function get(t){return t?this._state[t]:this._state}function fire(t,e){var i=t in this._handlers&&this._handlers[t].slice();if(i)for(var o=0;o<i.length;o+=1)i[o].call(this,e)}function observe(t,e,i){var o=i&&i.defer?this._observers.post:this._observers.pre;return(o[t]||(o[t]=[])).push(e),i&&!1===i.init||(e.__calling=!0,e.call(this,this._state[t]),e.__calling=!1),{cancel:function(){var i=o[t].indexOf(e);~i&&o[t].splice(i,1)}}}function on(t,e){if("teardown"===t)return this.on("destroy",e);var i=this._handlers[t]||(this._handlers[t]=[]);return i.push(e),{cancel:function(){var t=i.indexOf(e);~t&&i.splice(t,1)}}}function set(t){this._set(assign({},t)),this.root._lock||(this.root._lock=!0,callAll(this.root._beforecreate),callAll(this.root._oncreate),callAll(this.root._aftercreate),this.root._lock=!1)}function _set(t){var e=this._state,i={},o=!1;for(var n in t)differs(t[n],e[n])&&(i[n]=o=!0);o&&(this._state=assign({},e,t),this._recompute(i,this._state),this._bind&&this._bind(i,this._state),this._fragment&&(dispatchObservers(this,this._observers.pre,i,this._state,e),this._fragment.p(i,this._state),dispatchObservers(this,this._observers.post,i,this._state,e)))}function _mount(t,e){this._fragment.m(t,e)}function _unmount(){this._fragment&&this._fragment.u()}function differs(t,e){return t!==e||t&&"object"==typeof t||"function"==typeof t}function blankObject(){return Object.create(null)}function dispatchObservers(t,e,i,o,n){for(var s in e)if(i[s]){var a=o[s],r=n[s],c=e[s];if(c)for(var l=0;l<c.length;l+=1){var f=c[l];f.__calling||(f.__calling=!0,f.call(t,a,r),f.__calling=!1)}}}assign(PNotify_1.prototype,methods,{destroy:destroy,get:get,fire:fire,observe:observe,on:on,set:set,teardown:destroy,_set:_set,_mount:_mount,_unmount:_unmount}),PNotify_1.prototype._recompute=function(t,e){t.styling&&differs(e._styles,e._styles=_styles(e.styling))&&(t._styles=!0),t.icons&&differs(e._icons,e._icons=_icons(e.icons))&&(t._icons=!0)},setup(PNotify_1);export default PNotify_1;
//# sourceMappingURL=PNotify.js.map