import{ref as e,inject as t,onMounted as i,nextTick as s,withDirectives as r,openBlock as n,createBlock as o,renderSlot as a,vShow as l,onBeforeUnmount as u,createVNode as h,createTextVNode as p,getCurrentInstance as f,computed as d,watch as c,onUnmounted as v,toDisplayString as g,resolveComponent as m,Fragment as S,renderList as y,provide as _,reactive as b,withCtx as k}from"vue";function R(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var E={exports:{}},x=E.exports=function e(t,i,s){function r(o,a){if(!i[o]){if(!t[o]){if(!a&&R)return R(o);if(n)return n(o,!0);throw new Error("Cannot find module '"+o+"'")}var l=i[o]={exports:{}};t[o][0].call(l.exports,(function(e){var i=t[o][1][e];return r(i||e)}),l,l.exports,e,t,i,s)}return i[o].exports}for(var n=R,o=0;o<s.length;o++)r(s[o]);return r}({1:[function(e,t,i){var s=e("./utils");function r(e,t,i){s.defineNonEnumerable(this,"uploader",e),s.defineNonEnumerable(this,"file",t),s.defineNonEnumerable(this,"bytes",null),this.offset=i,this.tested=!1,this.retries=0,this.pendingRetry=!1,this.preprocessState=0,this.readState=0,this.loaded=0,this.total=0,this.chunkSize=s.evalOpts(e.opts.chunkSize,t,this),this.startByte=this.offset*this.chunkSize,this.endByte=this.computeEndByte(),this.xhr=null}var n=r.STATUS={PENDING:"pending",UPLOADING:"uploading",READING:"reading",SUCCESS:"success",ERROR:"error",COMPLETE:"complete",PROGRESS:"progress",RETRY:"retry"};s.extend(r.prototype,{_event:function(e,t){(t=s.toArray(arguments)).unshift(this),this.file._chunkEvent.apply(this.file,t)},computeEndByte:function(){var e=Math.min(this.file.size,(this.offset+1)*this.chunkSize);return this.file.size-e<this.chunkSize&&!this.uploader.opts.forceChunkSize&&(e=this.file.size),e},getParams:function(){return{chunkNumber:this.offset+1,chunkSize:this.chunkSize,currentChunkSize:this.endByte-this.startByte,totalSize:this.file.size,identifier:this.file.uniqueIdentifier,filename:this.file.name,relativePath:this.file.relativePath,totalChunks:this.file.chunks.length}},getTarget:function(e,t){return t.length?(e.indexOf("?")<0?e+="?":e+="&",e+t.join("&")):e},test:function(){this.xhr=new XMLHttpRequest,this.xhr.addEventListener("load",r,!1),this.xhr.addEventListener("error",r,!1);var e=s.evalOpts(this.uploader.opts.testMethod,this.file,this),t=this.prepareXhrRequest(e,!0);this.xhr.send(t);var i=this;function r(e){var t=i.status(!0);t===n.ERROR?(i._event(t,i.message()),i.uploader.uploadNextChunk()):t===n.SUCCESS?(i._event(t,i.message()),i.tested=!0):i.file.paused||(i.tested=!0,i.send())}},preprocessFinished:function(){this.endByte=this.computeEndByte(),this.preprocessState=2,this.send()},readFinished:function(e){this.readState=2,this.bytes=e,this.send()},send:function(){var e=this.uploader.opts.preprocess,t=this.uploader.opts.readFileFn;if(s.isFunction(e))switch(this.preprocessState){case 0:return this.preprocessState=1,void e(this);case 1:return}switch(this.readState){case 0:return this.readState=1,void t(this.file,this.file.fileType,this.startByte,this.endByte,this);case 1:return}if(!this.uploader.opts.testChunks||this.tested){this.loaded=0,this.total=0,this.pendingRetry=!1,this.xhr=new XMLHttpRequest,this.xhr.upload.addEventListener("progress",a,!1),this.xhr.addEventListener("load",l,!1),this.xhr.addEventListener("error",l,!1);var i=s.evalOpts(this.uploader.opts.uploadMethod,this.file,this),r=this.prepareXhrRequest(i,!1,this.uploader.opts.method,this.bytes);this.xhr.send(r);var o=this}else this.test();function a(e){e.lengthComputable&&(o.loaded=e.loaded,o.total=e.total),o._event(n.PROGRESS,e)}function l(e){var t=o.message();o.processingResponse=!0,o.uploader.opts.processResponse(t,(function(e,t){if(o.processingResponse=!1,o.xhr){o.processedState={err:e,res:t};var i=o.status();if(i===n.SUCCESS||i===n.ERROR)o._event(i,t),i===n.ERROR&&o.uploader.uploadNextChunk();else{o._event(n.RETRY,t),o.pendingRetry=!0,o.abort(),o.retries++;var s=o.uploader.opts.chunkRetryInterval;null!==s?setTimeout((function(){o.send()}),s):o.send()}}}),o.file,o)}},abort:function(){var e=this.xhr;this.xhr=null,this.processingResponse=!1,this.processedState=null,e&&e.abort()},status:function(e){if(1===this.readState)return n.READING;if(this.pendingRetry||1===this.preprocessState)return n.UPLOADING;if(this.xhr){if(this.xhr.readyState<4||this.processingResponse)return n.UPLOADING;var t;this.uploader.opts.successStatuses.indexOf(this.xhr.status)>-1?t=n.SUCCESS:this.uploader.opts.permanentErrors.indexOf(this.xhr.status)>-1||!e&&this.retries>=this.uploader.opts.maxChunkRetries?t=n.ERROR:(this.abort(),t=n.PENDING);var i=this.processedState;return i&&i.err&&(t=n.ERROR),t}return n.PENDING},message:function(){return this.xhr?this.xhr.responseText:""},progress:function(){if(this.pendingRetry)return 0;var e=this.status();return e===n.SUCCESS||e===n.ERROR?1:e===n.PENDING?0:this.total>0?this.loaded/this.total:0},sizeUploaded:function(){var e=this.endByte-this.startByte;return this.status()!==n.SUCCESS&&(e=this.progress()*e),e},prepareXhrRequest:function(e,t,i,r){var n=s.evalOpts(this.uploader.opts.query,this.file,this,t);n=s.extend(this.getParams(),n),n=this.uploader.opts.processParams(n,this.file,this,t);var o=s.evalOpts(this.uploader.opts.target,this.file,this,t),a=null;if("GET"===e||"octet"===i){var l=[];s.each(n,(function(e,t){l.push([encodeURIComponent(t),encodeURIComponent(e)].join("="))})),o=this.getTarget(o,l),a=r||null}else a=new FormData,s.each(n,(function(e,t){a.append(t,e)})),void 0!==r&&a.append(this.uploader.opts.fileParameterName,r,this.file.name);return this.xhr.open(e,o,!0),this.xhr.withCredentials=this.uploader.opts.withCredentials,s.each(s.evalOpts(this.uploader.opts.headers,this.file,this,t),(function(e,t){this.xhr.setRequestHeader(t,e)}),this),a}}),t.exports=r},{"./utils":5}],2:[function(e,t,i){var s=e("./utils").each,r={_eventData:null,on:function(e,t){this._eventData||(this._eventData={}),this._eventData[e]||(this._eventData[e]=[]);var i=!1;s(this._eventData[e],(function(e){if(e===t)return i=!0,!1})),i||this._eventData[e].push(t)},off:function(e,t){this._eventData||(this._eventData={}),this._eventData[e]&&this._eventData[e].length&&(t?s(this._eventData[e],(function(i,s){if(i===t)return this._eventData[e].splice(s,1),!1}),this):this._eventData[e]=[])},trigger:function(e){if(this._eventData||(this._eventData={}),!this._eventData[e])return!0;var t=this._eventData[e].slice.call(arguments,1),i=!1;return s(this._eventData[e],(function(e){i=!1===e.apply(this,t)||i}),this),!i}};t.exports=r},{"./utils":5}],3:[function(e,t,i){var s=e("./utils"),r=e("./event"),n=e("./file"),o=e("./chunk"),a="0.6.0",l="undefined"==typeof window,u=!l&&window.navigator.msPointerEnabled,h=function(){if(l)return!1;var e="slice",t=s.isDefined(window.File)&&s.isDefined(window.Blob)&&s.isDefined(window.FileList),i=null;return t&&(i=window.Blob.prototype,s.each(["slice","webkitSlice","mozSlice"],(function(t){if(i[t])return e=t,!1})),t=!!i[e]),t&&(f.sliceName=e),i=null,t}(),p=function(){if(l)return!1;var e=window.document.createElement("input");e.type="file";var t="webkitdirectory"in e||"directory"in e;return e=null,t}();function f(e){this.support=h,this.support&&(this.supportDirectory=p,s.defineNonEnumerable(this,"filePaths",{}),this.opts=s.extend({},f.defaults,e||{}),this.preventEvent=s.bind(this._preventEvent,this),n.call(this,this))}var d=function(e,t,i,s,r){r.readFinished(e.file[f.sliceName](i,s,t))};f.version=a,f.defaults={chunkSize:1048576,forceChunkSize:!1,simultaneousUploads:3,singleFile:!1,fileParameterName:"file",progressCallbacksInterval:500,speedSmoothingFactor:.1,query:{},headers:{},withCredentials:!1,preprocess:null,method:"multipart",testMethod:"GET",uploadMethod:"POST",prioritizeFirstAndLastChunk:!1,allowDuplicateUploads:!1,target:"/",testChunks:!0,generateUniqueIdentifier:null,maxChunkRetries:0,chunkRetryInterval:null,permanentErrors:[404,415,500,501],successStatuses:[200,201,202],onDropStopPropagation:!1,initFileFn:null,readFileFn:d,checkChunkUploadedByResponse:null,initialPaused:!1,processResponse:function(e,t){t(null,e)},processParams:function(e){return e}},f.utils=s,f.event=r,f.File=n,f.Chunk=o,f.prototype=s.extend({},n.prototype),s.extend(f.prototype,r),s.extend(f.prototype,{constructor:f,_trigger:function(e){var t=s.toArray(arguments),i=!this.trigger.apply(this,arguments);return"catchAll"!==e&&(t.unshift("catchAll"),i=!this.trigger.apply(this,t)||i),!i},_triggerAsync:function(){var e=arguments;s.nextTick((function(){this._trigger.apply(this,e)}),this)},addFiles:function(e,t){var i=[],r=this.fileList.length;s.each(e,(function(e){if((!u||u&&e.size>0)&&(e.size%4096!=0||"."!==e.name&&"."!==e.fileName)){var s=this.generateUniqueIdentifier(e);if(this.opts.allowDuplicateUploads||!this.getFromUniqueIdentifier(s)){var r=new n(this,e,this);r.uniqueIdentifier=s,this._trigger("fileAdded",r,t)?i.push(r):n.prototype.removeFile.call(this,r)}}}),this);var o=this.fileList.slice(r);this._trigger("filesAdded",i,o,t)?(s.each(i,(function(e){this.opts.singleFile&&this.files.length>0&&this.removeFile(this.files[0]),this.files.push(e)}),this),this._trigger("filesSubmitted",i,o,t)):s.each(o,(function(e){n.prototype.removeFile.call(this,e)}),this)},addFile:function(e,t){this.addFiles([e],t)},cancel:function(){for(var e=this.fileList.length-1;e>=0;e--)this.fileList[e].cancel()},removeFile:function(e){n.prototype.removeFile.call(this,e),this._trigger("fileRemoved",e)},generateUniqueIdentifier:function(e){var t=this.opts.generateUniqueIdentifier;if(s.isFunction(t))return t(e);var i=e.relativePath||e.webkitRelativePath||e.fileName||e.name;return e.size+"-"+i.replace(/[^0-9a-zA-Z_-]/gim,"")},getFromUniqueIdentifier:function(e){var t=!1;return s.each(this.files,(function(i){if(i.uniqueIdentifier===e)return t=i,!1})),t},uploadNextChunk:function(e){var t=!1,i=o.STATUS.PENDING,r=this.uploader.opts.checkChunkUploadedByResponse;if(this.opts.prioritizeFirstAndLastChunk&&(s.each(this.files,(function(e){if(!e.paused&&(!r||e._firstResponse||!e.isUploading()))return e.chunks.length&&e.chunks[0].status()===i?(e.chunks[0].send(),t=!0,!1):e.chunks.length>1&&e.chunks[e.chunks.length-1].status()===i?(e.chunks[e.chunks.length-1].send(),t=!0,!1):void 0})),t))return t;if(s.each(this.files,(function(e){if(!e.paused){if(r&&!e._firstResponse&&e.isUploading())return;s.each(e.chunks,(function(e){if(e.status()===i)return e.send(),t=!0,!1}))}if(t)return!1})),t)return!0;var n=!1;return s.each(this.files,(function(e){if(!e.isComplete())return n=!0,!1})),n||e||!this.files.length||this._triggerAsync("complete"),n},upload:function(e){var t=this._shouldUploadNext();if(!1!==t){!e&&this._trigger("uploadStart");for(var i=!1,s=1;s<=this.opts.simultaneousUploads-t&&((i=this.uploadNextChunk(!e)||i)||!e);s++);i||e||this._triggerAsync("complete")}},_shouldUploadNext:function(){var e=0,t=!0,i=this.opts.simultaneousUploads,r=o.STATUS.UPLOADING;return s.each(this.files,(function(n){return s.each(n.chunks,(function(s){if(s.status()===r&&++e>=i)return t=!1,!1})),t})),t&&e},assignBrowse:function(e,t,i,r){void 0===e.length&&(e=[e]),s.each(e,(function(e){var n;"INPUT"===e.tagName&&"file"===e.type?n=e:((n=document.createElement("input")).setAttribute("type","file"),s.extend(n.style,{visibility:"hidden",position:"absolute",width:"1px",height:"1px"}),e.appendChild(n),e.addEventListener("click",(function(t){"label"!==e.tagName.toLowerCase()&&n.click()}),!1)),this.opts.singleFile||i||n.setAttribute("multiple","multiple"),t&&n.setAttribute("webkitdirectory","webkitdirectory"),r&&s.each(r,(function(e,t){n.setAttribute(t,e)}));var o=this;n.addEventListener("change",(function(e){o._trigger(e.type,e),e.target.value&&(o.addFiles(e.target.files,e),e.target.value="")}),!1)}),this)},onDrop:function(e){this._trigger(e.type,e),this.opts.onDropStopPropagation&&e.stopPropagation(),e.preventDefault(),this._parseDataTransfer(e.dataTransfer,e)},_parseDataTransfer:function(e,t){e.items&&e.items[0]&&e.items[0].webkitGetAsEntry?this.webkitReadDataTransfer(e,t):this.addFiles(e.files,t)},webkitReadDataTransfer:function(e,t){var i=this,r=e.items.length,n=[];function o(e){e.readEntries((function(t){t.length?(r+=t.length,s.each(t,(function(e){if(e.isFile){var t=e.fullPath;e.file((function(e){a(e,t)}),l)}else e.isDirectory&&o(e.createReader())})),o(e)):u()}),l)}function a(e,t){e.relativePath=t.substring(1),n.push(e),u()}function l(e){throw e}function u(){0==--r&&i.addFiles(n,t)}s.each(e.items,(function(e){var t=e.webkitGetAsEntry();t?t.isFile?a(e.getAsFile(),t.fullPath):o(t.createReader()):u()}))},_assignHelper:function(e,t,i){void 0===e.length&&(e=[e]);var r=i?"removeEventListener":"addEventListener";s.each(e,(function(e){s.each(t,(function(t,i){e[r](i,t,!1)}),this)}),this)},_preventEvent:function(e){s.preventEvent(e),this._trigger(e.type,e)},assignDrop:function(e){this._onDrop=s.bind(this.onDrop,this),this._assignHelper(e,{dragover:this.preventEvent,dragenter:this.preventEvent,dragleave:this.preventEvent,drop:this._onDrop})},unAssignDrop:function(e){this._assignHelper(e,{dragover:this.preventEvent,dragenter:this.preventEvent,dragleave:this.preventEvent,drop:this._onDrop},!0),this._onDrop=null}}),t.exports=f},{"./chunk":1,"./event":2,"./file":4,"./utils":5}],4:[function(e,t,i){var s=e("./utils"),r=e("./chunk");function n(e,t,i){s.defineNonEnumerable(this,"uploader",e),this.isRoot=this.isFolder=e===this,s.defineNonEnumerable(this,"parent",i||null),s.defineNonEnumerable(this,"files",[]),s.defineNonEnumerable(this,"fileList",[]),s.defineNonEnumerable(this,"chunks",[]),s.defineNonEnumerable(this,"_errorFiles",[]),s.defineNonEnumerable(this,"file",null),this.id=s.uid(),this.isRoot||!t?this.file=null:s.isString(t)?(this.isFolder=!0,this.file=null,this.path=t,this.parent.path&&(t=t.substr(this.parent.path.length)),this.name="/"===t.charAt(t.length-1)?t.substr(0,t.length-1):t):(this.file=t,this.fileType=this.file.type,this.name=t.fileName||t.name,this.size=t.size,this.relativePath=t.relativePath||t.webkitRelativePath||this.name,this._parseFile()),this.paused=e.opts.initialPaused,this.error=!1,this.allError=!1,this.aborted=!1,this.completed=!1,this.averageSpeed=0,this.currentSpeed=0,this._lastProgressCallback=Date.now(),this._prevUploadedSize=0,this._prevProgress=0,this.bootstrap()}function o(e){var t=[],i=e.split("/"),s=i.length,r=1;if(i.splice(s-1,1),s--,i.length)for(;r<=s;)t.push(i.slice(0,r++).join("/")+"/");return t}s.extend(n.prototype,{_parseFile:function(){var e=o(this.relativePath);if(e.length){var t=this.uploader.filePaths;s.each(e,(function(i,s){var r=t[i];r||(r=new n(this.uploader,i,this.parent),t[i]=r,this._updateParentFileList(r)),this.parent=r,r.files.push(this),e[s+1]||r.fileList.push(this)}),this)}else this._updateParentFileList()},_updateParentFileList:function(e){e||(e=this);var t=this.parent;t&&t.fileList.push(e)},_eachAccess:function(e,t){this.isFolder?s.each(this.files,(function(t,i){return e.call(this,t,i)}),this):t.call(this,this)},bootstrap:function(){if(!this.isFolder){var e=this.uploader.opts;s.isFunction(e.initFileFn)&&e.initFileFn.call(this,this),this.abort(!0),this._resetError(),this._prevProgress=0;for(var t=e.forceChunkSize?Math.ceil:Math.floor,i=Math.max(t(this.size/e.chunkSize),1),n=0;n<i;n++)this.chunks.push(new r(this.uploader,this,n))}},_measureSpeed:function(){var e=this.uploader.opts.speedSmoothingFactor,t=Date.now()-this._lastProgressCallback;if(t){var i=this.sizeUploaded();this.currentSpeed=Math.max((i-this._prevUploadedSize)/t*1e3,0),this.averageSpeed=e*this.currentSpeed+(1-e)*this.averageSpeed,this._prevUploadedSize=i,this.parent&&this.parent._checkProgress()&&this.parent._measureSpeed()}},_checkProgress:function(e){return Date.now()-this._lastProgressCallback>=this.uploader.opts.progressCallbacksInterval},_chunkEvent:function(e,t,i){var s=this.uploader,n=r.STATUS,o=this,a=this.getRoot(),l=function(){o._measureSpeed(),s._trigger("fileProgress",a,o,e),o._lastProgressCallback=Date.now()};switch(t){case n.PROGRESS:this._checkProgress()&&l();break;case n.ERROR:this._error(),this.abort(!0),s._trigger("fileError",a,this,i,e);break;case n.SUCCESS:if(this._updateUploadedChunks(i,e),this.error)return;clearTimeout(this._progeressId),this._progeressId=0;var u=Date.now()-this._lastProgressCallback;u<s.opts.progressCallbacksInterval&&(this._progeressId=setTimeout(l,s.opts.progressCallbacksInterval-u)),this.isComplete()?(clearTimeout(this._progeressId),l(),this.currentSpeed=0,this.averageSpeed=0,s._trigger("fileSuccess",a,this,i,e),a.isComplete()&&s._trigger("fileComplete",a,this)):this._progeressId||l();break;case n.RETRY:s._trigger("fileRetry",a,this,e)}},_updateUploadedChunks:function(e,t){var i=this.uploader.opts.checkChunkUploadedByResponse;if(i){var r=t.xhr;s.each(this.chunks,(function(s){if(!s.tested){var n=i.call(this,s,e);s!==t||n||(s.xhr=null),n&&(s.xhr=r),s.tested=!0}}),this),this._firstResponse?this.uploader.uploadNextChunk():(this._firstResponse=!0,this.uploader.upload(!0))}else this.uploader.uploadNextChunk()},_error:function(){this.error=this.allError=!0;for(var e=this.parent;e&&e!==this.uploader;)e._errorFiles.push(this),e.error=!0,e._errorFiles.length===e.files.length&&(e.allError=!0),e=e.parent},_resetError:function(){this.error=this.allError=!1;for(var e=this.parent,t=-1;e&&e!==this.uploader;)t=e._errorFiles.indexOf(this),e._errorFiles.splice(t,1),e.allError=!1,e._errorFiles.length||(e.error=!1),e=e.parent},isComplete:function(){if(!this.completed){var e=!1;this._eachAccess((function(t){if(!t.isComplete())return e=!0,!1}),(function(){if(this.error)e=!0;else{var t=r.STATUS;s.each(this.chunks,(function(i){var s=i.status();if(s===t.ERROR||s===t.PENDING||s===t.UPLOADING||s===t.READING||1===i.preprocessState||1===i.readState)return e=!0,!1}))}})),this.completed=!e}return this.completed},isUploading:function(){var e=!1;return this._eachAccess((function(t){if(t.isUploading())return e=!0,!1}),(function(){var t=r.STATUS.UPLOADING;s.each(this.chunks,(function(i){if(i.status()===t)return e=!0,!1}))})),e},resume:function(){this._eachAccess((function(e){e.resume()}),(function(){this.paused=!1,this.aborted=!1,this.uploader.upload()})),this.paused=!1,this.aborted=!1},pause:function(){this._eachAccess((function(e){e.pause()}),(function(){this.paused=!0,this.abort()})),this.paused=!0},cancel:function(){this.uploader.removeFile(this)},retry:function(e){var t=function(e){e.error&&e.bootstrap()};e?e.bootstrap():this._eachAccess(t,(function(){this.bootstrap()})),this.uploader.upload()},abort:function(e){if(!this.aborted){this.currentSpeed=0,this.averageSpeed=0,this.aborted=!e;var t=this.chunks;e&&(this.chunks=[]);var i=r.STATUS.UPLOADING;s.each(t,(function(e){e.status()===i&&(e.abort(),this.uploader.uploadNextChunk())}),this)}},progress:function(){var e=0,t=0,i=0;return this._eachAccess((function(s,r){e+=s.progress()*s.size,t+=s.size,r===this.files.length-1&&(i=t>0?e/t:this.isComplete()?1:0)}),(function(){if(this.error)i=1;else{if(1===this.chunks.length)return this._prevProgress=Math.max(this._prevProgress,this.chunks[0].progress()),void(i=this._prevProgress);var e=0;s.each(this.chunks,(function(t){e+=t.progress()*(t.endByte-t.startByte)}));var t=e/this.size;this._prevProgress=Math.max(this._prevProgress,t>.9999?1:t),i=this._prevProgress}})),i},getSize:function(){var e=0;return this._eachAccess((function(t){e+=t.size}),(function(){e+=this.size})),e},getFormatSize:function(){var e=this.getSize();return s.formatSize(e)},getRoot:function(){if(this.isRoot)return this;for(var e=this.parent;e;){if(e.parent===this.uploader)return e;e=e.parent}return this},sizeUploaded:function(){var e=0;return this._eachAccess((function(t){e+=t.sizeUploaded()}),(function(){s.each(this.chunks,(function(t){e+=t.sizeUploaded()}))})),e},timeRemaining:function(){var e=0,t=0,i=0;return this._eachAccess((function(r,n){r.paused||r.error||(t+=r.size-r.sizeUploaded(),i+=r.averageSpeed),n===this.files.length-1&&(e=s(t,i))}),(function(){if(this.paused||this.error)e=0;else{var t=this.size-this.sizeUploaded();e=s(t,this.averageSpeed)}})),e;function s(e,t){return e&&!t?Number.POSITIVE_INFINITY:e||t?Math.floor(e/t):0}},removeFile:function(e){if(e.isFolder)for(;e.files.length;){var t=e.files[e.files.length-1];this._removeFile(t)}this._removeFile(e)},_delFilePath:function(e){e.path&&this.filePaths&&delete this.filePaths[e.path],s.each(e.fileList,(function(e){this._delFilePath(e)}),this)},_removeFile:function(e){if(!e.isFolder){s.each(this.files,(function(t,i){if(t===e)return this.files.splice(i,1),!1}),this),e.abort();for(var t,i=e.parent;i&&i!==this;)t=i.parent,i._removeFile(e),i=t}e.parent===this&&s.each(this.fileList,(function(t,i){if(t===e)return this.fileList.splice(i,1),!1}),this),this.isRoot||!this.isFolder||this.files.length||(this.parent._removeFile(this),this.uploader._delFilePath(this)),e.parent=null},getType:function(){return this.isFolder?"folder":this.file.type&&this.file.type.split("/")[1]},getExtension:function(){return this.isFolder?"":this.name.substr(2+(~-this.name.lastIndexOf(".")>>>0)).toLowerCase()}}),t.exports=n},{"./chunk":1,"./utils":5}],5:[function(e,t,i){var s=Object.prototype,r=Array.prototype,n=s.toString,o=function(e){return"[object Function]"===n.call(e)},a=Array.isArray||function(e){return"[object Array]"===n.call(e)},l=function(e){return"[object Object]"===n.call(e)&&Object.getPrototypeOf(e)===s},u=0,h={uid:function(){return++u},noop:function(){},bind:function(e,t){return function(){return e.apply(t,arguments)}},preventEvent:function(e){e.preventDefault()},stop:function(e){e.preventDefault(),e.stopPropagation()},nextTick:function(e,t){setTimeout(h.bind(e,t),0)},toArray:function(e,t,i){return void 0===t&&(t=0),void 0===i&&(i=e.length),r.slice.call(e,t,i)},isPlainObject:l,isFunction:o,isArray:a,isObject:function(e){return Object(e)===e},isString:function(e){return"string"==typeof e},isUndefined:function(e){return void 0===e},isDefined:function(e){return void 0!==e},each:function(e,t,i){if(h.isDefined(e.length))for(var s=0,r=e.length;s<r&&!1!==t.call(i,e[s],s,e);s++);else for(var n in e)if(!1===t.call(i,e[n],n,e))break},evalOpts:function(e,t){return h.isFunction(e)&&(t=h.toArray(arguments),e=e.apply(null,t.slice(1))),e},extend:function(){var e,t,i,s,r,n,u=arguments[0]||{},p=1,f=arguments.length,d=!1;for("boolean"==typeof u&&(d=u,u=arguments[1]||{},p++),"object"==typeof u||o(u)||(u={}),p===f&&(u=this,p--);p<f;p++)if(null!=(e=arguments[p]))for(t in e)i=u[t],u!==(s=e[t])&&(d&&s&&(l(s)||(r=a(s)))?(r?(r=!1,n=i&&a(i)?i:[]):n=i&&l(i)?i:{},u[t]=h.extend(d,n,s)):void 0!==s&&(u[t]=s));return u},formatSize:function(e){return e<1024?e.toFixed(0)+" bytes":e<1048576?(e/1024).toFixed(0)+" KB":e<1073741824?(e/1024/1024).toFixed(1)+" MB":(e/1024/1024/1024).toFixed(1)+" GB"},defineNonEnumerable:function(e,t,i){Object.defineProperty(e,t,{enumerable:!1,configurable:!0,writable:!0,value:i})}};t.exports=h},{}]},{},[3])(3);
/*!
 * Uploader - Uploader library implements html5 file upload and provides multiple simultaneous, stable, fault tolerant and resumable uploads
 * @version v0.6.0
 * @author dolymood <dolymood@gmail.com>
 * @link https://github.com/simple-uploader/Uploader
 * @license MIT
 */function F(e){return e.replace(/[A-Z]/g,(e=>`-${e.toLowerCase()}`))}const C={name:"uploader-btn",props:{directory:{type:Boolean,default:!1},single:{type:Boolean,default:!1},attrs:{type:Object,default:()=>({})}},setup(r){const n=e(null),o=t("uploader"),a=o.support;return i((()=>{s((()=>{o.assignBrowse(n.value,r.directory,r.single,r.attrs)}))})),{btn:n,support:a}}},P={class:"uploader-btn",ref:"btn"};C.render=function(e,t,i,s,u,h){return r((n(),o("label",P,[a(e.$slots,"default")],512)),[[l,s.support]])};const U={name:"uploader-drop",setup(){const i=t("uploader");let r=e(null),n=e("");const o=i.support,a=()=>{n="uploader-dragover"},l=()=>{n=""},h=()=>{n="uploader-droped"};return s((()=>{const e=r.value;i.assignDrop(e),i.on("dragenter",a),i.on("dragleave",l),i.on("drop",h)})),u((()=>{const e=r.value;i.off("dragenter",a),i.off("dragleave",l),i.off("drop",h),i.unAssignDrop(e)})),{drop:r,dropClass:n,support:o,onDragEnter:a,onDragLeave:l,onDrop:h}}};U.render=function(e,t,i,s,u,h){return r((n(),o("div",{class:["uploader-drop",s.dropClass],ref:"drop"},[a(e.$slots,"default")],2)),[[l,s.support]])};const w={name:"uploader-unsupport",setup:()=>({support:t("uploader").support})},A={class:"uploader-unsupport"},D=h("p",null,[p(" Your browser, unfortunately, is not supported by Uploader.js. The library requires support for "),h("a",{href:"http://www.w3.org/TR/FileAPI/"},"the HTML5 File API"),p(" along with "),h("a",{href:"http://www.w3.org/TR/FileAPI/#normalization-of-params"},"file slicing"),p(". ")],-1);w.render=function(e,t,i,s,u,h){return r((n(),o("div",A,[a(e.$slots,"default",{},(()=>[D]))],512)),[[l,!s.support]])};const z=["fileProgress","fileSuccess","fileComplete","fileError"];const T={name:"uploader-file",props:{file:{type:Object,default:()=>({})},list:{type:Boolean,default:!1}},setup(t){const s=f();let r={},n=0;const o=e(null),a=e(!1),l=e(!1),u=e(0),h=e(0),p=e(!1),g=e(!1),m=e(0),S=e(""),y=e(0),_=e(0),b=e(0),k=e(""),R=e(""),E=e(""),F=d((()=>{let e=t.file.isFolder?"folder":"unknown";const i=t.file.uploader.opts.categoryMap||{image:["gif","jpg","jpeg","png","bmp","webp"],video:["mp4","m3u8","rmvb","avi","swf","3gp","mkv","flv"],audio:["mp3","wav","wma","ogg","aac","flac"],document:["doc","txt","docx","pages","epub","pdf","numbers","csv","xls","xlsx","keynote","ppt","pptx"]};return Object.keys(i).forEach((t=>{i[t].indexOf(R.value)>-1&&(e=t)})),e})),C=d((()=>{_.value=Math.floor(100*_.value);const e=`translateX(${Math.floor(_.value-100)}%)`;return{progress:`${_.value}%`,webkitTransform:e,mozTransform:e,msTransform:e,transform:e}})),P=d((()=>`${x.utils.formatSize(u.value)} / s`)),U=d((()=>{let e=l;return p.value?"success":e.value?"error":g.value?"uploading":a.value?"paused":"waiting"})),w=d((()=>{const e=t.file.uploader.fileStatusText;let i=U.value;return i="function"==typeof e?e(U.value,o.value):e[U.value],i||U})),A=d((()=>{const e=t.file;if(b.value===Number.POSITIVE_INFINITY||0===b.value)return"";let i=function(e){const t=Math.floor(e/31536e3);if(t)return t+" year"+o(t);const i=Math.floor((e%=31536e3)/86400);if(i)return i+" day"+o(i);const s=Math.floor((e%=86400)/3600);if(s)return s+" hour"+o(s);const r=Math.floor((e%=3600)/60);if(r)return r+" minute"+o(r);const n=e%60;return n+" second"+o(n);function o(e){return e>1?"s":""}}(b.value);const s=e.uploader.opts.parseTimeRemaining;return s&&(i=s(b.value,i)),i})),D=()=>{a.value=t.file.paused,l.value=t.file.error,g.value=t.file.isUploading()},T=e=>{let t=e;try{t=JSON.parse(e)}catch(i){}o.value=t},N=(e,i)=>{const r=i[0],n=i[1],o=t.list?r:n;if(JSON.stringify(t.file)===JSON.stringify(o)){if(t.list&&"fileSuccess"===e)return void T(i[2]);s.ctx[`${e}`](i)}},I=()=>{_.value=t.file.progress(),u.value=t.file.averageSpeed,h.value=t.file.currentSpeed,b.value=t.file.timeRemaining(),y.value=t.file.sizeUploaded(),D()},L=(e,t,i)=>{e&&T(i),I(),l.value=!1,p.value=!0,g.value=!1};return c(U,((e,t)=>{t&&"uploading"===e&&"uploading"!==t?n=setTimeout((()=>{E.value="uploader-file-progressing"}),200):(clearTimeout(n),E.value="")})),i((()=>{a.value=t.file.paused,l.value=t.file.error,u.value=t.file.averageSpeed,h.value=t.file.currentSpeed,p.value=t.file.isComplete(),g.value=t.file.isUploading(),m.value=t.file.getSize(),S.value=t.file.getFormatSize(),y.value=t.file.sizeUploaded(),_.value=t.file.progress(),b.value=t.file.timeRemaining(),k.value=t.file.getType(),R.value=t.file.getExtension();z.forEach((e=>{t.file.uploader.on(e,(e=>(r[e]=(...t)=>{N(e,t)},r[e]))(e))}))})),v((()=>{z.forEach((e=>{t.file.uploader.off(e,r[e])})),r=null})),{response:o,paused:a,error:l,averageSpeed:u,currentSpeed:h,isComplete:p,isUploading:g,size:m,formatedSize:S,uploadedSize:y,progress:_,timeRemaining:b,type:k,extension:R,progressingClass:E,fileCategory:F,progressStyle:C,formatedAverageSpeed:P,status:U,statusText:w,formatedTimeRemaining:A,actionCheck:D,pause:()=>{t.file.pause(),D(),I()},resume:()=>{t.file.resume(),D()},remove:()=>{t.file.cancel()},retry:()=>{t.file.retry(),D()},processResponse:T,fileEventsHandler:N,fileProgress:I,fileSuccess:L,fileComplete:()=>{L()},fileError:(e,t,i)=>{I(),T(i),l.value=!0,p.value=!1,g.value=!1}}}},N={class:"uploader-file-info"},I={class:"uploader-file-name"},L={class:"uploader-file-size"},O=h("div",{class:"uploader-file-meta"},null,-1),B={class:"uploader-file-status"},G={class:"uploader-file-actions"};T.render=function(e,t,i,s,u,f){return n(),o("div",{class:"uploader-file",status:s.status},[a(e.$slots,"default",{file:i.file,list:i.list,status:s.status,paused:s.paused,error:s.error,response:s.response,averageSpeed:s.averageSpeed,formatedAverageSpeed:s.formatedAverageSpeed,currentSpeed:s.currentSpeed,isComplete:s.isComplete,isUploading:s.isUploading,size:s.size,formatedSize:s.formatedSize,uploadedSize:s.uploadedSize,progress:s.progress,progressStyle:s.progressStyle,progressingClass:s.progressingClass,timeRemaining:s.timeRemaining,formatedTimeRemaining:s.formatedTimeRemaining,type:s.type,extension:s.extension,fileCategory:s.fileCategory},(()=>[h("div",{class:["uploader-file-progress",s.progressingClass],style:s.progressStyle},null,6),h("div",N,[h("div",I,[h("i",{class:"uploader-file-icon",icon:s.fileCategory},null,8,["icon"]),p(g(i.file.name),1)]),h("div",L,g(s.formatedSize),1),O,h("div",B,[r(h("span",null,g(s.statusText),513),[[l,"uploading"!==s.status]]),r(h("span",null,[h("span",null,g(s.progressStyle.progress)+" ",1),h("em",null,g(s.formatedAverageSpeed)+" ",1),h("i",null,g(s.formatedTimeRemaining),1)],512),[[l,"uploading"===s.status]])]),h("div",G,[h("span",{class:"uploader-file-pause",onClick:t[1]||(t[1]=(...e)=>s.pause&&s.pause(...e))}),h("span",{class:"uploader-file-resume",onClick:t[2]||(t[2]=(...e)=>s.resume&&s.resume(...e))},"️"),h("span",{class:"uploader-file-retry",onClick:t[3]||(t[3]=(...e)=>s.retry&&s.retry(...e))}),h("span",{class:"uploader-file-remove",onClick:t[4]||(t[4]=(...e)=>s.remove&&s.remove(...e))})])])]))],8,["status"])};const M={name:"uploader-list",components:{UploaderFile:T},setup:()=>({fileList:t("uploader").fileList})},j={class:"uploader-list"};M.render=function(e,t,i,s,r,l){const u=m("uploader-file");return n(),o("div",j,[a(e.$slots,"default",{fileList:s.fileList},(()=>[h("ul",null,[(n(!0),o(S,null,y(s.fileList,(e=>(n(),o("li",{key:e.id},[h(u,{file:e,list:!0},null,8,["file"])])))),128))])]))])};const q={name:"uploader-files",components:{UploaderFile:T},setup:()=>({files:t("uploader").files})},$={class:"uploader-files"};q.render=function(e,t,i,s,r,l){const u=m("uploader-file");return n(),o("div",$,[a(e.$slots,"default",{files:s.files},(()=>[h("ul",null,[(n(!0),o(S,null,y(s.files,(e=>(n(),o("li",{key:e.id},[h(u,{file:e},null,8,["file"])])))),128))])]))])};const H={name:"uploader",props:{options:{type:Object,default:()=>({})},autoStart:{type:Boolean,default:!0},fileStatusText:{type:[Object,Function],default:()=>({success:"success",error:"error",uploading:"uploading",paused:"paused",waiting:"waiting"})}},setup(t,{emit:i}){const s=e(null),r=e(!1),n=e([]),o=e([]),a=f();let l=new x(t.options);const u=()=>{r.value=!0},h=e=>{const t=b(e);if(i(F("fileAdded"),t),t.ignored)return!1},p=(e,t)=>{if(i(F("filesAdded"),e,t),e.ignored||t.ignored)return!1},d=e=>{n.value=l.files,o.value=l.fileList},c=(e,i)=>{n.value=l.files,o.value=l.fileList,t.autoStart&&l.upload()},g=(...e)=>{const t=e[0],s={fileAdded:!0,filesAdded:!0,uploadStart:"uploadStart"}[t];if(s){if(!0===s)return;a.ctx[s].apply(a.ctx[s],e.slice(1))}e[0]=F(t),i.apply(a.ctx,e)};return t.options.initialPaused=!t.autoStart,l.fileStatusText=t.fileStatusText,l.on("catchAll",g),l.on("fileAdded",h),l.on("filesAdded",p),l.on("fileRemoved",d),l.on("filesSubmitted",c),l.uploadStart=u,v((()=>{l.off("catchAll",g),l.off("fileAdded",h),l.off("filesAdded",p),l.off("fileRemoved",d),l.off("filesSubmitted",c),l=null})),_("uploader",b(l)),{uploader:l,started:r,files:n,fileList:o,uploadStart:u,fileAdded:h,filesAdded:p,fileRemoved:d,filesSubmitted:c,allEvent:g,uploaderList:s}},components:{UploaderBtn:C,UploaderDrop:U,UploaderUnsupport:w,UploaderList:M,UploaderFiles:q,UploaderFile:T}},X={class:"uploader"},Y=h("p",null,"Drop files here to upload or",-1),J=p("select files"),V=p("select folder");H.render=function(e,t,i,s,r,l){const u=m("uploader-unsupport"),p=m("uploader-btn"),f=m("uploader-drop"),d=m("uploader-list");return n(),o("div",X,[a(e.$slots,"default",{files:s.files,fileList:s.fileList,started:s.started},(()=>[h(u),h(f,null,{default:k((()=>[Y,h(p,null,{default:k((()=>[J])),_:1}),h(p,{directory:!0},{default:k((()=>[V])),_:1})])),_:1}),h(d)]))])};const Z={version:"1.0.0-beta.3",install:function(e,t){e.component(H.name,H),e.component(C.name,C),e.component(U.name,U),e.component(w.name,w),e.component(M.name,M),e.component(q.name,q),e.component(T.name,T)},Uploader:H,UploaderBtn:C,UploaderDrop:U,UploaderUnsupport:w,UploaderList:M,UploaderFiles:q,UploaderFile:T};export default Z;
