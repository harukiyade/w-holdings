;(function($){var defaults={reCalcOnWindowResize:true,throttleDuration:17};var setupContainer=function($el){var imageSrc=$el.find('img').attr('src');$el.data('imageSrc',imageSrc);resolveImageSize(imageSrc,function(err,dim){$el.data({imageW:dim.width,imageH:dim.height});adjustFocus($el);});};var resolveImageSize=function(src,cb){$('<img />').one('load',function(){cb(null,{width:this.width,height:this.height});}).attr('src',src);};var throttle=function(fn,ms){var isRunning=false;return function(){var args=Array.prototype.slice.call(arguments,0);if(isRunning)return false;isRunning=true;setTimeout(function(){isRunning=false;fn.apply(null,args);},ms);};};var calcShift=function(conToImageRatio,containerSize,imageSize,focusSize,toMinus){var containerCenter=Math.floor(containerSize/2);var focusFactor=(focusSize+1)/2;var scaledImage=Math.floor(imageSize/conToImageRatio);var focus=Math.floor(focusFactor*scaledImage);if(toMinus)focus=scaledImage-focus;var focusOffset=focus-containerCenter;var remainder=scaledImage-focus;var containerRemainder=containerSize-containerCenter;if(remainder<containerRemainder)focusOffset-=containerRemainder-remainder;if(focusOffset<0)focusOffset=0;return(focusOffset*-100/containerSize)+'%';};var adjustFocus=function($el){var imageW=$el.data('imageW');var imageH=$el.data('imageH');var imageSrc=$el.data('imageSrc');if(!imageW&&!imageH&&!imageSrc){return setupContainer($el);}
var containerW=$el.width();var containerH=$el.height();var focusX=parseFloat($el.data('focusX'));var focusY=parseFloat($el.data('focusY'));var $image=$el.find('img').first();var hShift=0;var vShift=0;if(!(containerW>0&&containerH>0&&imageW>0&&imageH>0)){return false;}
var wR=imageW/containerW;var hR=imageH/containerH;$image.css({'max-width':'','max-height':''});if(imageW>containerW&&imageH>containerH){$image.css((wR>hR)?'max-height':'max-width','100%');}
if(wR>hR){hShift=calcShift(hR,containerW,imageW,focusX);}else if(wR<hR){vShift=calcShift(wR,containerH,imageH,focusY,true);}
$image.css({top:vShift,left:hShift});};var $window=$(window);var focusPoint=function($el,settings){var thrAdjustFocus=settings.throttleDuration?throttle(function(){adjustFocus($el);},settings.throttleDuration):function(){adjustFocus($el);};var isListening=false;adjustFocus($el);return{adjustFocus:function(){return adjustFocus($el);},windowOn:function(){if(isListening)return;$window.on('resize',thrAdjustFocus);return isListening=true;},windowOff:function(){if(!isListening)return;$window.off('resize',thrAdjustFocus);isListening=false;return true;}};};$.fn.focusPoint=function(optionsOrMethod){if(typeof optionsOrMethod==='string'){return this.each(function(){var $el=$(this);$el.data('focusPoint')[optionsOrMethod]();});}
var settings=$.extend({},defaults,optionsOrMethod);return this.each(function(){var $el=$(this);var fp=focusPoint($el,settings);if($el.data('focusPoint'))$el.data('focusPoint').windowOff();$el.data('focusPoint',fp);if(settings.reCalcOnWindowResize)fp.windowOn();});};$.fn.adjustFocus=function(){return this.each(function(){adjustFocus($(this));});};})(jQuery);