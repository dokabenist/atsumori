!function(e){function t(i){if(n[i])return n[i].exports;var o=n[i]={exports:{},id:i,loaded:!1};return e[i].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";!function(e){var t=n(1),i=n(3);e.atsumori||(e.atsumori=new t({resourcePath:i.resourcePath}))}(window)},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=n(2),r=function(){function e(t){i(this,e),this.config=t||{resourcePath:"./resources/"},this.videoElement=null,this.overlayElement=null,this.images={},this.soundBuffers={},this.audioContext=null,this.loaded={image:!1,sound:!1},this.timerId=null,this.maxInterval=0,this.setup()}return o(e,[{key:"setup",value:function e(){var t=this,n=window.setTimeout(function(){window.clearTimeout(n),t.videoElement=t.findVideoElement(),t.videoElement&&(t.startLoadImage(),t.startLoadSound(),t.setupKeyframes(),t.checkAndPlayLater())},5e3)}},{key:"setupKeyframes",value:function t(){var n=["@keyframes "+e.KEYFRAME_ID.STAMP+" {\n 0% { transform: scale(2.0, 2.0); opacity: 0.30;}\n 75% { transform: scale(0.8, 0.8);  opacity: 0.8;}\n 100% { transform: scale(1.0, 1.0);  opacity: 1.0;}\n}","@keyframes "+e.KEYFRAME_ID.STEAM+" {\n 0% { transform: scale(1.0, 1.0); opacity: 0.20;}\n 20% { transform: scale(1.0, 1.0);  opacity: 1.0;}\n 100% { transform: scale(1.25, 1.5);  opacity: 0.0;}\n}"],i=window.document.createElement("style");(window.document.head||window.document).appendChild(i),n.forEach(function(e){i.sheet.insertRule(e,i.sheet.cssRules.length)})}},{key:"findVideoElement",value:function e(){var t=null,n=129600;return Array.from(window.document.getElementsByTagName("video")).forEach(function(e){var i=e.clientWidth,o=e.clientHeight,a=i*o;a>n&&(n=a,t=e)}),t}},{key:"startLoadImage",value:function t(){var n=this,i=[e.IMAGE_ID.STAMP,e.IMAGE_ID.STEAM],o=new Set(i);i.forEach(function(e){var t=""+n.config.resourcePath+e,i=new Image;i.onload=function(){i.onload=null,n.images[e]=i,o.delete(e),0==o.size&&(n.loaded.image=!0)},i.src=t})}},{key:"startLoadSound",value:function t(){var n=this,i=["AudioContext","webkitAudioContext"].find(function(e){return"function"==typeof window[e]});if(i){this.audioContext=new window[i];var o=new Audio,a=[{mimeType:"audio/aac",extension:"m4a"},{mimeType:"audio/ogg",extension:"ogg"}].find(function(e){return o.canPlayType(e.mimeType)});if(o=null,!a)return!1;var r=[e.SOUND_ID.SHOUT_0,e.SOUND_ID.SHOUT_1],l=new Set(r),u=a.extension;r.forEach(function(e){var t=""+n.config.resourcePath+e+"."+u,i=new XMLHttpRequest;i.open("GET",t),i.responseType="arraybuffer",i.onload=function(){i.onload=null,i.status<400&&i.response&&n.audioContext.decodeAudioData(i.response,function(t){n.soundBuffers[e]=t,l.delete(e),0==l.size&&(n.loaded.sound=!0)})},i.send()})}}},{key:"checkAndPlay",value:function t(){this.isPlayable()?(this.play(),this.maxInterval=e.BASE_INTERVAL):this.maxInterval=Math.floor(.75*this.maxInterval)}},{key:"checkAndPlayLater",value:function t(){var n=this.videoElement,i=Math.floor(1e3*(n.duration-n.currentTime)),o=Math.max(a.random(Math.max(i,this.maxInterval)),e.MIN_INTERVAL);this.timerId=window.setTimeout(this.onTimer.bind(this),o)}},{key:"play",value:function t(){var n=this,i=this.videoElement,o=i.videoWidth,r=i.videoHeight,l=i.clientWidth,u=i.clientHeight,s,d;if(o>0&&r>0)if(l/o<u/r){s=0;var c=Math.floor(l*r/o);d=Math.floor((u-c)/2),u=c}else{d=0;var f=Math.floor(u*o/r);s=Math.floor((l-f)/2),l=f}var m={display:"block",position:"absolute",overflow:"hidden",margin:"0px",padding:"0px",borderWidth:"0px",left:i.offsetLeft+s+"px",top:i.offsetTop+d+"px",width:l+"px",height:u+"px",zIndex:9999,pointerEvents:"none"};this.overlayElement?a.updateElementStyles(this.overlayElement,m):(this.overlayElement=a.createElement("div",{id:e.ELEMENT_ID.OVERLAY},m),this.videoElement.parentElement.appendChild(this.overlayElement));var h=this.images[e.IMAGE_ID.STAMP];h.parentElement&&h.parentElement.removeChild(h);var p=Math.floor(.3*l),v=Math.floor(.67*p);a.updateElementStyles(h,{position:"absolute",margin:"0px",padding:"0px",borderWidth:"0px",left:l-p+"px",top:u-v+"px",width:p+"px",height:v+"px",animation:e.KEYFRAME_ID.STAMP+" 0.20s linear 0.0s forwards"}),this.overlayElement.appendChild(h);var E=this.images[e.IMAGE_ID.STEAM];E.parentElement&&E.parentElement.removeChild(E),a.updateElementStyles(E,{position:"absolute",margin:"0px",padding:"0px",borderWidth:"0px",left:l-p+"px",top:u-p+"px",width:p+"px",height:p+"px",transformOrigin:"100% 100%",animation:e.KEYFRAME_ID.STEAM+" 0.90s linear 0.05s forwards"}),this.overlayElement.appendChild(E);var y=this.audioContext.createBufferSource();y.buffer=this.soundBuffers[a.randomItem([e.SOUND_ID.SHOUT_0,e.SOUND_ID.SHOUT_0,e.SOUND_ID.SHOUT_1])],y.connect(this.audioContext.destination),y.start(.1);var w=window.setTimeout(function(){window.clearTimeout(w),a.updateElementStyles(n.overlayElement,{display:"none"})},1600)}},{key:"onTimer",value:function e(){this.timerId&&(window.clearTimeout(this.timerId),this.timerId=null),this.checkAndPlay(),this.checkAndPlayLater()}},{key:"isPlayable",value:function e(){var t=this.videoElement;return!!this.loaded.image&&(!!this.loaded.sound&&(!!a.isVisibleElement(t)&&(!t.paused&&t.duration>0)))}}]),e}();r.IMAGE_ID={STAMP:"stamp.png",STEAM:"steam.png"},r.SOUND_ID={SHOUT_0:"sound_0",SHOUT_1:"sound_1"},r.ELEMENT_ID={OVERLAY:"atsumoriOverlay"},r.KEYFRAME_ID={STAMP:"atsumoriStamp",STEAM:"atsumoriSteam"},r.BASE_INTERVAL=15e3,r.MIN_INTERVAL=1e4,e.exports=r},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=function(){function e(){n(this,e)}return i(e,null,[{key:"random",value:function e(t){return Math.floor(Math.random()*t)}},{key:"randomItem",value:function t(n){return n[e.random(n.length)]}},{key:"isVisibleElement",value:function e(t){for(var n=window.document.body||window.document.documentElement,i=t;i;){var o=i.style;if("none"===o.display||"hidden"===o.visibility)return!1;if(i==n)break;i=i.parentElement}return i==n}},{key:"updateElementAttributes",value:function e(t,n){if(t)for(var i in n){var o=n[i];null==o?t.removeAttribute(i):t.setAttribute(i,o)}}},{key:"updateElementStyles",value:function e(t,n){if(t)for(var i in n)t.style[i]=n[i]}},{key:"createElement",value:function t(n){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,a=window.document.createElement(n);return i&&e.updateElementAttributes(a,i),o&&e.updateElementStyles(a,o),a}}]),e}();e.exports=o},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=function(){function e(){n(this,e)}return i(e,null,[{key:"resourcePath",get:function e(){return"//cdn.rawgit.com/dokabenist/atsumori/master/build/bookmarklet/resources/"}}]),e}();e.exports=o}]);