!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("vue")):"function"==typeof define&&define.amd?define(["vue"],t):(e="undefined"!=typeof globalThis?globalThis:e||self)["vue-uploader"]=t(e.Vue)}(this,(function(e){"use strict";function t(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var i={exports:{}};
/*!
   * Uploader - Uploader library implements html5 file upload and provides multiple simultaneous, stable, fault tolerant and resumable uploads
   * @version v0.6.0
   * @author dolymood <dolymood@gmail.com>
   * @link https://github.com/simple-uploader/Uploader
   * @license MIT
   */i.exports=function e(i,r,s){function n(a,l){if(!r[a]){if(!i[a]){if(!l&&t)return t(a);if(o)return o(a,!0);throw new Error("Cannot find module '"+a+"'")}var u=r[a]={exports:{}};i[a][0].call(u.exports,(function(e){var t=i[a][1][e];return n(t||e)}),u,u.exports,e,i,r,s)}return r[a].exports}for(var o=t,a=0;a<s.length;a++)n(s[a]);return n}({1:[function(e,t,i){var r=e("./utils");function s(e,t,i){r.defineNonEnumerable(this,"uploader",e),r.defineNonEnumerable(this,"file",t),r.defineNonEnumerable(this,"bytes",null),this.offset=i,this.tested=!1,this.retries=0,this.pendingRetry=!1,this.preprocessState=0,this.readState=0,this.loaded=0,this.total=0,this.chunkSize=r.evalOpts(e.opts.chunkSize,t,this),this.startByte=this.offset*this.chunkSize,this.endByte=this.computeEndByte(),this.xhr=null}var n=s.STATUS={PENDING:"pending",UPLOADING:"uploading",READING:"reading",SUCCESS:"success",ERROR:"error",COMPLETE:"complete",PROGRESS:"progress",RETRY:"retry"};r.extend(s.prototype,{_event:function(e,t){(t=r.toArray(arguments)).unshift(this),this.file._chunkEvent.apply(this.file,t)},computeEndByte:function(){var e=Math.min(this.file.size,(this.offset+1)*this.chunkSize);return this.file.size-e<this.chunkSize&&!this.uploader.opts.forceChunkSize&&(e=this.file.size),e},getParams:function(){return{chunkNumber:this.offset+1,chunkSize:this.chunkSize,currentChunkSize:this.endByte-this.startByte,totalSize:this.file.size,identifier:this.file.uniqueIdentifier,filename:this.file.name,relativePath:this.file.relativePath,totalChunks:this.file.chunks.length}},getTarget:function(e,t){return t.length?(e.indexOf("?")<0?e+="?":e+="&",e+t.join("&")):e},test:function(){this.xhr=new XMLHttpRequest,this.xhr.addEventListener("load",s,!1),this.xhr.addEventListener("error",s,!1);var e=r.evalOpts(this.uploader.opts.testMethod,this.file,this),t=this.prepareXhrRequest(e,!0);this.xhr.send(t);var i=this;function s(e){var t=i.status(!0);t===n.ERROR?(i._event(t,i.message()),i.uploader.uploadNextChunk()):t===n.SUCCESS?(i._event(t,i.message()),i.tested=!0):i.file.paused||(i.tested=!0,i.send())}},preprocessFinished:function(){this.endByte=this.computeEndByte(),this.preprocessState=2,this.send()},readFinished:function(e){this.readState=2,this.bytes=e,this.send()},send:function(){var e=this.uploader.opts.preprocess,t=this.uploader.opts.readFileFn;if(r.isFunction(e))switch(this.preprocessState){case 0:return this.preprocessState=1,void e(this);case 1:return}switch(this.readState){case 0:return this.readState=1,void t(this.file,this.file.fileType,this.startByte,this.endByte,this);case 1:return}if(!this.uploader.opts.testChunks||this.tested){this.loaded=0,this.total=0,this.pendingRetry=!1,this.xhr=new XMLHttpRequest,this.xhr.upload.addEventListener("progress",a,!1),this.xhr.addEventListener("load",l,!1),this.xhr.addEventListener("error",l,!1);var i=r.evalOpts(this.uploader.opts.uploadMethod,this.file,this),s=this.prepareXhrRequest(i,!1,this.uploader.opts.method,this.bytes);this.xhr.send(s);var o=this}else this.test();function a(e){e.lengthComputable&&(o.loaded=e.loaded,o.total=e.total),o._event(n.PROGRESS,e)}function l(e){var t=o.message();o.processingResponse=!0,o.uploader.opts.processResponse(t,(function(e,t){if(o.processingResponse=!1,o.xhr){o.processedState={err:e,res:t};var i=o.status();if(i===n.SUCCESS||i===n.ERROR)o._event(i,t),i===n.ERROR&&o.uploader.uploadNextChunk();else{o._event(n.RETRY,t),o.pendingRetry=!0,o.abort(),o.retries++;var r=o.uploader.opts.chunkRetryInterval;null!==r?setTimeout((function(){o.send()}),r):o.send()}}}),o.file,o)}},abort:function(){var e=this.xhr;this.xhr=null,this.processingResponse=!1,this.processedState=null,e&&e.abort()},status:function(e){if(1===this.readState)return n.READING;if(this.pendingRetry||1===this.preprocessState)return n.UPLOADING;if(this.xhr){if(this.xhr.readyState<4||this.processingResponse)return n.UPLOADING;var t;this.uploader.opts.successStatuses.indexOf(this.xhr.status)>-1?t=n.SUCCESS:this.uploader.opts.permanentErrors.indexOf(this.xhr.status)>-1||!e&&this.retries>=this.uploader.opts.maxChunkRetries?t=n.ERROR:(this.abort(),t=n.PENDING);var i=this.processedState;return i&&i.err&&(t=n.ERROR),t}return n.PENDING},message:function(){return this.xhr?this.xhr.responseText:""},progress:function(){if(this.pendingRetry)return 0;var e=this.status();return e===n.SUCCESS||e===n.ERROR?1:e===n.PENDING?0:this.total>0?this.loaded/this.total:0},sizeUploaded:function(){var e=this.endByte-this.startByte;return this.status()!==n.SUCCESS&&(e=this.progress()*e),e},prepareXhrRequest:function(e,t,i,s){var n=r.evalOpts(this.uploader.opts.query,this.file,this,t);n=r.extend(this.getParams(),n),n=this.uploader.opts.processParams(n,this.file,this,t);var o=r.evalOpts(this.uploader.opts.target,this.file,this,t),a=null;if("GET"===e||"octet"===i){var l=[];r.each(n,(function(e,t){l.push([encodeURIComponent(t),encodeURIComponent(e)].join("="))})),o=this.getTarget(o,l),a=s||null}else a=new FormData,r.each(n,(function(e,t){a.append(t,e)})),void 0!==s&&a.append(this.uploader.opts.fileParameterName,s,this.file.name);return this.xhr.open(e,o,!0),this.xhr.withCredentials=this.uploader.opts.withCredentials,r.each(r.evalOpts(this.uploader.opts.headers,this.file,this,t),(function(e,t){this.xhr.setRequestHeader(t,e)}),this),a}}),t.exports=s},{"./utils":5}],2:[function(e,t,i){var r=e("./utils").each,s={_eventData:null,on:function(e,t){this._eventData||(this._eventData={}),this._eventData[e]||(this._eventData[e]=[]);var i=!1;r(this._eventData[e],(function(e){if(e===t)return i=!0,!1})),i||this._eventData[e].push(t)},off:function(e,t){this._eventData||(this._eventData={}),this._eventData[e]&&this._eventData[e].length&&(t?r(this._eventData[e],(function(i,r){if(i===t)return this._eventData[e].splice(r,1),!1}),this):this._eventData[e]=[])},trigger:function(e){if(this._eventData||(this._eventData={}),!this._eventData[e])return!0;var t=this._eventData[e].slice.call(arguments,1),i=!1;return r(this._eventData[e],(function(e){i=!1===e.apply(this,t)||i}),this),!i}};t.exports=s},{"./utils":5}],3:[function(e,t,i){var r=e("./utils"),s=e("./event"),n=e("./file"),o=e("./chunk"),a="0.6.0",l="undefined"==typeof window,u=!l&&window.navigator.msPointerEnabled,p=function(){if(l)return!1;var e="slice",t=r.isDefined(window.File)&&r.isDefined(window.Blob)&&r.isDefined(window.FileList),i=null;return t&&(i=window.Blob.prototype,r.each(["slice","webkitSlice","mozSlice"],(function(t){if(i[t])return e=t,!1})),t=!!i[e]),t&&(c.sliceName=e),i=null,t}(),h=function(){if(l)return!1;var e=window.document.createElement("input");e.type="file";var t="webkitdirectory"in e||"directory"in e;return e=null,t}();function c(e){this.support=p,this.support&&(this.supportDirectory=h,r.defineNonEnumerable(this,"filePaths",{}),this.opts=r.extend({},c.defaults,e||{}),this.preventEvent=r.bind(this._preventEvent,this),n.call(this,this))}var d=function(e,t,i,r,s){s.readFinished(e.file[c.sliceName](i,r,t))};c.version=a,c.defaults={chunkSize:1048576,forceChunkSize:!1,simultaneousUploads:3,singleFile:!1,fileParameterName:"file",progressCallbacksInterval:500,speedSmoothingFactor:.1,query:{},headers:{},withCredentials:!1,preprocess:null,method:"multipart",testMethod:"GET",uploadMethod:"POST",prioritizeFirstAndLastChunk:!1,allowDuplicateUploads:!1,target:"/",testChunks:!0,generateUniqueIdentifier:null,maxChunkRetries:0,chunkRetryInterval:null,permanentErrors:[404,415,500,501],successStatuses:[200,201,202],onDropStopPropagation:!1,initFileFn:null,readFileFn:d,checkChunkUploadedByResponse:null,initialPaused:!1,processResponse:function(e,t){t(null,e)},processParams:function(e){return e}},c.utils=r,c.event=s,c.File=n,c.Chunk=o,c.prototype=r.extend({},n.prototype),r.extend(c.prototype,s),r.extend(c.prototype,{constructor:c,_trigger:function(e){var t=r.toArray(arguments),i=!this.trigger.apply(this,arguments);return"catchAll"!==e&&(t.unshift("catchAll"),i=!this.trigger.apply(this,t)||i),!i},_triggerAsync:function(){var e=arguments;r.nextTick((function(){this._trigger.apply(this,e)}),this)},addFiles:function(e,t){var i=[],s=this.fileList.length;r.each(e,(function(e){if((!u||u&&e.size>0)&&(e.size%4096!=0||"."!==e.name&&"."!==e.fileName)){var r=this.generateUniqueIdentifier(e);if(this.opts.allowDuplicateUploads||!this.getFromUniqueIdentifier(r)){var s=new n(this,e,this);s.uniqueIdentifier=r,this._trigger("fileAdded",s,t)?i.push(s):n.prototype.removeFile.call(this,s)}}}),this);var o=this.fileList.slice(s);this._trigger("filesAdded",i,o,t)?(r.each(i,(function(e){this.opts.singleFile&&this.files.length>0&&this.removeFile(this.files[0]),this.files.push(e)}),this),this._trigger("filesSubmitted",i,o,t)):r.each(o,(function(e){n.prototype.removeFile.call(this,e)}),this)},addFile:function(e,t){this.addFiles([e],t)},cancel:function(){for(var e=this.fileList.length-1;e>=0;e--)this.fileList[e].cancel()},removeFile:function(e){n.prototype.removeFile.call(this,e),this._trigger("fileRemoved",e)},generateUniqueIdentifier:function(e){var t=this.opts.generateUniqueIdentifier;if(r.isFunction(t))return t(e);var i=e.relativePath||e.webkitRelativePath||e.fileName||e.name;return e.size+"-"+i.replace(/[^0-9a-zA-Z_-]/gim,"")},getFromUniqueIdentifier:function(e){var t=!1;return r.each(this.files,(function(i){if(i.uniqueIdentifier===e)return t=i,!1})),t},uploadNextChunk:function(e){var t=!1,i=o.STATUS.PENDING,s=this.uploader.opts.checkChunkUploadedByResponse;if(this.opts.prioritizeFirstAndLastChunk&&(r.each(this.files,(function(e){if(!e.paused&&(!s||e._firstResponse||!e.isUploading()))return e.chunks.length&&e.chunks[0].status()===i?(e.chunks[0].send(),t=!0,!1):e.chunks.length>1&&e.chunks[e.chunks.length-1].status()===i?(e.chunks[e.chunks.length-1].send(),t=!0,!1):void 0})),t))return t;if(r.each(this.files,(function(e){if(!e.paused){if(s&&!e._firstResponse&&e.isUploading())return;r.each(e.chunks,(function(e){if(e.status()===i)return e.send(),t=!0,!1}))}if(t)return!1})),t)return!0;var n=!1;return r.each(this.files,(function(e){if(!e.isComplete())return n=!0,!1})),n||e||!this.files.length||this._triggerAsync("complete"),n},upload:function(e){var t=this._shouldUploadNext();if(!1!==t){!e&&this._trigger("uploadStart");for(var i=!1,r=1;r<=this.opts.simultaneousUploads-t&&((i=this.uploadNextChunk(!e)||i)||!e);r++);i||e||this._triggerAsync("complete")}},_shouldUploadNext:function(){var e=0,t=!0,i=this.opts.simultaneousUploads,s=o.STATUS.UPLOADING;return r.each(this.files,(function(n){return r.each(n.chunks,(function(r){if(r.status()===s&&++e>=i)return t=!1,!1})),t})),t&&e},assignBrowse:function(e,t,i,s){void 0===e.length&&(e=[e]),r.each(e,(function(e){var n;"INPUT"===e.tagName&&"file"===e.type?n=e:((n=document.createElement("input")).setAttribute("type","file"),r.extend(n.style,{visibility:"hidden",position:"absolute",width:"1px",height:"1px"}),e.appendChild(n),e.addEventListener("click",(function(t){"label"!==e.tagName.toLowerCase()&&n.click()}),!1)),this.opts.singleFile||i||n.setAttribute("multiple","multiple"),t&&n.setAttribute("webkitdirectory","webkitdirectory"),s&&r.each(s,(function(e,t){n.setAttribute(t,e)}));var o=this;n.addEventListener("change",(function(e){o._trigger(e.type,e),e.target.value&&(o.addFiles(e.target.files,e),e.target.value="")}),!1)}),this)},onDrop:function(e){this._trigger(e.type,e),this.opts.onDropStopPropagation&&e.stopPropagation(),e.preventDefault(),this._parseDataTransfer(e.dataTransfer,e)},_parseDataTransfer:function(e,t){e.items&&e.items[0]&&e.items[0].webkitGetAsEntry?this.webkitReadDataTransfer(e,t):this.addFiles(e.files,t)},webkitReadDataTransfer:function(e,t){var i=this,s=e.items.length,n=[];function o(e){e.readEntries((function(t){t.length?(s+=t.length,r.each(t,(function(e){if(e.isFile){var t=e.fullPath;e.file((function(e){a(e,t)}),l)}else e.isDirectory&&o(e.createReader())})),o(e)):u()}),l)}function a(e,t){e.relativePath=t.substring(1),n.push(e),u()}function l(e){throw e}function u(){0==--s&&i.addFiles(n,t)}r.each(e.items,(function(e){var t=e.webkitGetAsEntry();t?t.isFile?a(e.getAsFile(),t.fullPath):o(t.createReader()):u()}))},_assignHelper:function(e,t,i){void 0===e.length&&(e=[e]);var s=i?"removeEventListener":"addEventListener";r.each(e,(function(e){r.each(t,(function(t,i){e[s](i,t,!1)}),this)}),this)},_preventEvent:function(e){r.preventEvent(e),this._trigger(e.type,e)},assignDrop:function(e){this._onDrop=r.bind(this.onDrop,this),this._assignHelper(e,{dragover:this.preventEvent,dragenter:this.preventEvent,dragleave:this.preventEvent,drop:this._onDrop})},unAssignDrop:function(e){this._assignHelper(e,{dragover:this.preventEvent,dragenter:this.preventEvent,dragleave:this.preventEvent,drop:this._onDrop},!0),this._onDrop=null}}),t.exports=c},{"./chunk":1,"./event":2,"./file":4,"./utils":5}],4:[function(e,t,i){var r=e("./utils"),s=e("./chunk");function n(e,t,i){r.defineNonEnumerable(this,"uploader",e),this.isRoot=this.isFolder=e===this,r.defineNonEnumerable(this,"parent",i||null),r.defineNonEnumerable(this,"files",[]),r.defineNonEnumerable(this,"fileList",[]),r.defineNonEnumerable(this,"chunks",[]),r.defineNonEnumerable(this,"_errorFiles",[]),r.defineNonEnumerable(this,"file",null),this.id=r.uid(),this.isRoot||!t?this.file=null:r.isString(t)?(this.isFolder=!0,this.file=null,this.path=t,this.parent.path&&(t=t.substr(this.parent.path.length)),this.name="/"===t.charAt(t.length-1)?t.substr(0,t.length-1):t):(this.file=t,this.fileType=this.file.type,this.name=t.fileName||t.name,this.size=t.size,this.relativePath=t.relativePath||t.webkitRelativePath||this.name,this._parseFile()),this.paused=e.opts.initialPaused,this.error=!1,this.allError=!1,this.aborted=!1,this.completed=!1,this.averageSpeed=0,this.currentSpeed=0,this._lastProgressCallback=Date.now(),this._prevUploadedSize=0,this._prevProgress=0,this.bootstrap()}function o(e){var t=[],i=e.split("/"),r=i.length,s=1;if(i.splice(r-1,1),r--,i.length)for(;s<=r;)t.push(i.slice(0,s++).join("/")+"/");return t}r.extend(n.prototype,{_parseFile:function(){var e=o(this.relativePath);if(e.length){var t=this.uploader.filePaths;r.each(e,(function(i,r){var s=t[i];s||(s=new n(this.uploader,i,this.parent),t[i]=s,this._updateParentFileList(s)),this.parent=s,s.files.push(this),e[r+1]||s.fileList.push(this)}),this)}else this._updateParentFileList()},_updateParentFileList:function(e){e||(e=this);var t=this.parent;t&&t.fileList.push(e)},_eachAccess:function(e,t){this.isFolder?r.each(this.files,(function(t,i){return e.call(this,t,i)}),this):t.call(this,this)},bootstrap:function(){if(!this.isFolder){var e=this.uploader.opts;r.isFunction(e.initFileFn)&&e.initFileFn.call(this,this),this.abort(!0),this._resetError(),this._prevProgress=0;for(var t=e.forceChunkSize?Math.ceil:Math.floor,i=Math.max(t(this.size/e.chunkSize),1),n=0;n<i;n++)this.chunks.push(new s(this.uploader,this,n))}},_measureSpeed:function(){var e=this.uploader.opts.speedSmoothingFactor,t=Date.now()-this._lastProgressCallback;if(t){var i=this.sizeUploaded();this.currentSpeed=Math.max((i-this._prevUploadedSize)/t*1e3,0),this.averageSpeed=e*this.currentSpeed+(1-e)*this.averageSpeed,this._prevUploadedSize=i,this.parent&&this.parent._checkProgress()&&this.parent._measureSpeed()}},_checkProgress:function(e){return Date.now()-this._lastProgressCallback>=this.uploader.opts.progressCallbacksInterval},_chunkEvent:function(e,t,i){var r=this.uploader,n=s.STATUS,o=this,a=this.getRoot(),l=function(){o._measureSpeed(),r._trigger("fileProgress",a,o,e),o._lastProgressCallback=Date.now()};switch(t){case n.PROGRESS:this._checkProgress()&&l();break;case n.ERROR:this._error(),this.abort(!0),r._trigger("fileError",a,this,i,e);break;case n.SUCCESS:if(this._updateUploadedChunks(i,e),this.error)return;clearTimeout(this._progeressId),this._progeressId=0;var u=Date.now()-this._lastProgressCallback;u<r.opts.progressCallbacksInterval&&(this._progeressId=setTimeout(l,r.opts.progressCallbacksInterval-u)),this.isComplete()?(clearTimeout(this._progeressId),l(),this.currentSpeed=0,this.averageSpeed=0,r._trigger("fileSuccess",a,this,i,e),a.isComplete()&&r._trigger("fileComplete",a,this)):this._progeressId||l();break;case n.RETRY:r._trigger("fileRetry",a,this,e)}},_updateUploadedChunks:function(e,t){var i=this.uploader.opts.checkChunkUploadedByResponse;if(i){var s=t.xhr;r.each(this.chunks,(function(r){if(!r.tested){var n=i.call(this,r,e);r!==t||n||(r.xhr=null),n&&(r.xhr=s),r.tested=!0}}),this),this._firstResponse?this.uploader.uploadNextChunk():(this._firstResponse=!0,this.uploader.upload(!0))}else this.uploader.uploadNextChunk()},_error:function(){this.error=this.allError=!0;for(var e=this.parent;e&&e!==this.uploader;)e._errorFiles.push(this),e.error=!0,e._errorFiles.length===e.files.length&&(e.allError=!0),e=e.parent},_resetError:function(){this.error=this.allError=!1;for(var e=this.parent,t=-1;e&&e!==this.uploader;)t=e._errorFiles.indexOf(this),e._errorFiles.splice(t,1),e.allError=!1,e._errorFiles.length||(e.error=!1),e=e.parent},isComplete:function(){if(!this.completed){var e=!1;this._eachAccess((function(t){if(!t.isComplete())return e=!0,!1}),(function(){if(this.error)e=!0;else{var t=s.STATUS;r.each(this.chunks,(function(i){var r=i.status();if(r===t.ERROR||r===t.PENDING||r===t.UPLOADING||r===t.READING||1===i.preprocessState||1===i.readState)return e=!0,!1}))}})),this.completed=!e}return this.completed},isUploading:function(){var e=!1;return this._eachAccess((function(t){if(t.isUploading())return e=!0,!1}),(function(){var t=s.STATUS.UPLOADING;r.each(this.chunks,(function(i){if(i.status()===t)return e=!0,!1}))})),e},resume:function(){this._eachAccess((function(e){e.resume()}),(function(){this.paused=!1,this.aborted=!1,this.uploader.upload()})),this.paused=!1,this.aborted=!1},pause:function(){this._eachAccess((function(e){e.pause()}),(function(){this.paused=!0,this.abort()})),this.paused=!0},cancel:function(){this.uploader.removeFile(this)},retry:function(e){var t=function(e){e.error&&e.bootstrap()};e?e.bootstrap():this._eachAccess(t,(function(){this.bootstrap()})),this.uploader.upload()},abort:function(e){if(!this.aborted){this.currentSpeed=0,this.averageSpeed=0,this.aborted=!e;var t=this.chunks;e&&(this.chunks=[]);var i=s.STATUS.UPLOADING;r.each(t,(function(e){e.status()===i&&(e.abort(),this.uploader.uploadNextChunk())}),this)}},progress:function(){var e=0,t=0,i=0;return this._eachAccess((function(r,s){e+=r.progress()*r.size,t+=r.size,s===this.files.length-1&&(i=t>0?e/t:this.isComplete()?1:0)}),(function(){if(this.error)i=1;else{if(1===this.chunks.length)return this._prevProgress=Math.max(this._prevProgress,this.chunks[0].progress()),void(i=this._prevProgress);var e=0;r.each(this.chunks,(function(t){e+=t.progress()*(t.endByte-t.startByte)}));var t=e/this.size;this._prevProgress=Math.max(this._prevProgress,t>.9999?1:t),i=this._prevProgress}})),i},getSize:function(){var e=0;return this._eachAccess((function(t){e+=t.size}),(function(){e+=this.size})),e},getFormatSize:function(){var e=this.getSize();return r.formatSize(e)},getRoot:function(){if(this.isRoot)return this;for(var e=this.parent;e;){if(e.parent===this.uploader)return e;e=e.parent}return this},sizeUploaded:function(){var e=0;return this._eachAccess((function(t){e+=t.sizeUploaded()}),(function(){r.each(this.chunks,(function(t){e+=t.sizeUploaded()}))})),e},timeRemaining:function(){var e=0,t=0,i=0;return this._eachAccess((function(s,n){s.paused||s.error||(t+=s.size-s.sizeUploaded(),i+=s.averageSpeed),n===this.files.length-1&&(e=r(t,i))}),(function(){if(this.paused||this.error)e=0;else{var t=this.size-this.sizeUploaded();e=r(t,this.averageSpeed)}})),e;function r(e,t){return e&&!t?Number.POSITIVE_INFINITY:e||t?Math.floor(e/t):0}},removeFile:function(e){if(e.isFolder)for(;e.files.length;){var t=e.files[e.files.length-1];this._removeFile(t)}this._removeFile(e)},_delFilePath:function(e){e.path&&this.filePaths&&delete this.filePaths[e.path],r.each(e.fileList,(function(e){this._delFilePath(e)}),this)},_removeFile:function(e){if(!e.isFolder){r.each(this.files,(function(t,i){if(t===e)return this.files.splice(i,1),!1}),this),e.abort();for(var t,i=e.parent;i&&i!==this;)t=i.parent,i._removeFile(e),i=t}e.parent===this&&r.each(this.fileList,(function(t,i){if(t===e)return this.fileList.splice(i,1),!1}),this),this.isRoot||!this.isFolder||this.files.length||(this.parent._removeFile(this),this.uploader._delFilePath(this)),e.parent=null},getType:function(){return this.isFolder?"folder":this.file.type&&this.file.type.split("/")[1]},getExtension:function(){return this.isFolder?"":this.name.substr(2+(~-this.name.lastIndexOf(".")>>>0)).toLowerCase()}}),t.exports=n},{"./chunk":1,"./utils":5}],5:[function(e,t,i){var r=Object.prototype,s=Array.prototype,n=r.toString,o=function(e){return"[object Function]"===n.call(e)},a=Array.isArray||function(e){return"[object Array]"===n.call(e)},l=function(e){return"[object Object]"===n.call(e)&&Object.getPrototypeOf(e)===r},u=0,p={uid:function(){return++u},noop:function(){},bind:function(e,t){return function(){return e.apply(t,arguments)}},preventEvent:function(e){e.preventDefault()},stop:function(e){e.preventDefault(),e.stopPropagation()},nextTick:function(e,t){setTimeout(p.bind(e,t),0)},toArray:function(e,t,i){return void 0===t&&(t=0),void 0===i&&(i=e.length),s.slice.call(e,t,i)},isPlainObject:l,isFunction:o,isArray:a,isObject:function(e){return Object(e)===e},isString:function(e){return"string"==typeof e},isUndefined:function(e){return void 0===e},isDefined:function(e){return void 0!==e},each:function(e,t,i){if(p.isDefined(e.length))for(var r=0,s=e.length;r<s&&!1!==t.call(i,e[r],r,e);r++);else for(var n in e)if(!1===t.call(i,e[n],n,e))break},evalOpts:function(e,t){return p.isFunction(e)&&(t=p.toArray(arguments),e=e.apply(null,t.slice(1))),e},extend:function(){var e,t,i,r,s,n,u=arguments[0]||{},h=1,c=arguments.length,d=!1;for("boolean"==typeof u&&(d=u,u=arguments[1]||{},h++),"object"==typeof u||o(u)||(u={}),h===c&&(u=this,h--);h<c;h++)if(null!=(e=arguments[h]))for(t in e)i=u[t],u!==(r=e[t])&&(d&&r&&(l(r)||(s=a(r)))?(s?(s=!1,n=i&&a(i)?i:[]):n=i&&l(i)?i:{},u[t]=p.extend(d,n,r)):void 0!==r&&(u[t]=r));return u},formatSize:function(e){return e<1024?e.toFixed(0)+" bytes":e<1048576?(e/1024).toFixed(0)+" KB":e<1073741824?(e/1024/1024).toFixed(1)+" MB":(e/1024/1024/1024).toFixed(1)+" GB"},defineNonEnumerable:function(e,t,i){Object.defineProperty(e,t,{enumerable:!1,configurable:!0,writable:!0,value:i})}};t.exports=p},{}]},{},[3])(3);var r=i.exports;function s(e){return e.replace(/[A-Z]/g,(e=>`-${e.toLowerCase()}`))}const n={name:"uploader-btn",props:{directory:{type:Boolean,default:!1},single:{type:Boolean,default:!1},attrs:{type:Object,default:()=>({})}},setup(t){const i=e.ref(null),r=e.inject("uploader"),s=r.support;return e.onMounted((()=>{e.nextTick((()=>{r.assignBrowse(i.value,t.directory,t.single,t.attrs)}))})),{btn:i,support:s}}},o={class:"uploader-btn",ref:"btn"};n.render=function(t,i,r,s,n,a){return e.withDirectives((e.openBlock(),e.createBlock("label",o,[e.renderSlot(t.$slots,"default")],512)),[[e.vShow,s.support]])};const a={name:"uploader-drop",setup(){const t=e.inject("uploader");let i=e.ref(null),r=e.ref("");const s=t.support,n=()=>{r="uploader-dragover"},o=()=>{r=""},a=()=>{r="uploader-droped"};return e.nextTick((()=>{const e=i.value;t.assignDrop(e),t.on("dragenter",n),t.on("dragleave",o),t.on("drop",a)})),e.onBeforeUnmount((()=>{const e=i.value;t.off("dragenter",n),t.off("dragleave",o),t.off("drop",a),t.unAssignDrop(e)})),{drop:i,dropClass:r,support:s,onDragEnter:n,onDragLeave:o,onDrop:a}}};a.render=function(t,i,r,s,n,o){return e.withDirectives((e.openBlock(),e.createBlock("div",{class:["uploader-drop",s.dropClass],ref:"drop"},[e.renderSlot(t.$slots,"default")],2)),[[e.vShow,s.support]])};const l={name:"uploader-unsupport",setup:()=>({support:e.inject("uploader").support})},u={class:"uploader-unsupport"},p=e.createVNode("p",null,[e.createTextVNode(" Your browser, unfortunately, is not supported by Uploader.js. The library requires support for "),e.createVNode("a",{href:"http://www.w3.org/TR/FileAPI/"},"the HTML5 File API"),e.createTextVNode(" along with "),e.createVNode("a",{href:"http://www.w3.org/TR/FileAPI/#normalization-of-params"},"file slicing"),e.createTextVNode(". ")],-1);l.render=function(t,i,r,s,n,o){return e.withDirectives((e.openBlock(),e.createBlock("div",u,[e.renderSlot(t.$slots,"default",{},(()=>[p]))],512)),[[e.vShow,!s.support]])};const h=["fileProgress","fileSuccess","fileComplete","fileError"];const c={name:"uploader-file",props:{file:{type:Object,default:()=>({})},list:{type:Boolean,default:!1}},setup(t){const i=e.getCurrentInstance();let s={},n=0;const o=e.ref(null),a=e.ref(!1),l=e.ref(!1),u=e.ref(0),p=e.ref(0),c=e.ref(!1),d=e.ref(!1),f=e.ref(0),v=e.ref(""),g=e.ref(0),m=e.ref(0),S=e.ref(0),y=e.ref(""),k=e.ref(""),_=e.ref(""),b=e.computed((()=>{let e=t.file.isFolder?"folder":"unknown";const i=t.file.uploader.opts.categoryMap||{image:["gif","jpg","jpeg","png","bmp","webp"],video:["mp4","m3u8","rmvb","avi","swf","3gp","mkv","flv"],audio:["mp3","wav","wma","ogg","aac","flac"],document:["doc","txt","docx","pages","epub","pdf","numbers","csv","xls","xlsx","keynote","ppt","pptx"]};return Object.keys(i).forEach((t=>{i[t].indexOf(k.value)>-1&&(e=t)})),e})),x=e.computed((()=>{m.value=Math.floor(100*m.value);const e=`translateX(${Math.floor(m.value-100)}%)`;return{progress:`${m.value}%`,webkitTransform:e,mozTransform:e,msTransform:e,transform:e}})),R=e.computed((()=>`${r.utils.formatSize(u.value)} / s`)),E=e.computed((()=>{let e=l;return c.value?"success":e.value?"error":d.value?"uploading":a.value?"paused":"waiting"})),C=e.computed((()=>{const e=t.file.uploader.fileStatusText;let i=E.value;return i="function"==typeof e?e(E.value,o.value):e[E.value],i||E})),N=e.computed((()=>{const e=t.file;if(S.value===Number.POSITIVE_INFINITY||0===S.value)return"";let i=function(e){const t=Math.floor(e/31536e3);if(t)return t+" year"+o(t);const i=Math.floor((e%=31536e3)/86400);if(i)return i+" day"+o(i);const r=Math.floor((e%=86400)/3600);if(r)return r+" hour"+o(r);const s=Math.floor((e%=3600)/60);if(s)return s+" minute"+o(s);const n=e%60;return n+" second"+o(n);function o(e){return e>1?"s":""}}(S.value);const r=e.uploader.opts.parseTimeRemaining;return r&&(i=r(S.value,i)),i})),F=()=>{a.value=t.file.paused,l.value=t.file.error,d.value=t.file.isUploading()},w=e=>{let t=e;try{t=JSON.parse(e)}catch(i){}o.value=t},D=(e,r)=>{const s=r[0],n=r[1],o=t.list?s:n;if(JSON.stringify(t.file)===JSON.stringify(o)){if(t.list&&"fileSuccess"===e)return void w(r[2]);i.ctx[`${e}`](r)}},U=()=>{m.value=t.file.progress(),u.value=t.file.averageSpeed,p.value=t.file.currentSpeed,S.value=t.file.timeRemaining(),g.value=t.file.sizeUploaded(),F()},P=(e,t,i)=>{e&&w(i),U(),l.value=!1,c.value=!0,d.value=!1};return e.watch(E,((e,t)=>{t&&"uploading"===e&&"uploading"!==t?n=setTimeout((()=>{_.value="uploader-file-progressing"}),200):(clearTimeout(n),_.value="")})),e.onMounted((()=>{a.value=t.file.paused,l.value=t.file.error,u.value=t.file.averageSpeed,p.value=t.file.currentSpeed,c.value=t.file.isComplete(),d.value=t.file.isUploading(),f.value=t.file.getSize(),v.value=t.file.getFormatSize(),g.value=t.file.sizeUploaded(),m.value=t.file.progress(),S.value=t.file.timeRemaining(),y.value=t.file.getType(),k.value=t.file.getExtension();h.forEach((e=>{t.file.uploader.on(e,(e=>(s[e]=(...t)=>{D(e,t)},s[e]))(e))}))})),e.onUnmounted((()=>{h.forEach((e=>{t.file.uploader.off(e,s[e])})),s=null})),{response:o,paused:a,error:l,averageSpeed:u,currentSpeed:p,isComplete:c,isUploading:d,size:f,formatedSize:v,uploadedSize:g,progress:m,timeRemaining:S,type:y,extension:k,progressingClass:_,fileCategory:b,progressStyle:x,formatedAverageSpeed:R,status:E,statusText:C,formatedTimeRemaining:N,actionCheck:F,pause:()=>{t.file.pause(),F(),U()},resume:()=>{t.file.resume(),F()},remove:()=>{t.file.cancel()},retry:()=>{t.file.retry(),F()},processResponse:w,fileEventsHandler:D,fileProgress:U,fileSuccess:P,fileComplete:()=>{P()},fileError:(e,t,i)=>{U(),w(i),l.value=!0,c.value=!1,d.value=!1}}}},d={class:"uploader-file-info"},f={class:"uploader-file-name"},v={class:"uploader-file-size"},g=e.createVNode("div",{class:"uploader-file-meta"},null,-1),m={class:"uploader-file-status"},S={class:"uploader-file-actions"};c.render=function(t,i,r,s,n,o){return e.openBlock(),e.createBlock("div",{class:"uploader-file",status:s.status},[e.renderSlot(t.$slots,"default",{file:r.file,list:r.list,status:s.status,paused:s.paused,error:s.error,response:s.response,averageSpeed:s.averageSpeed,formatedAverageSpeed:s.formatedAverageSpeed,currentSpeed:s.currentSpeed,isComplete:s.isComplete,isUploading:s.isUploading,size:s.size,formatedSize:s.formatedSize,uploadedSize:s.uploadedSize,progress:s.progress,progressStyle:s.progressStyle,progressingClass:s.progressingClass,timeRemaining:s.timeRemaining,formatedTimeRemaining:s.formatedTimeRemaining,type:s.type,extension:s.extension,fileCategory:s.fileCategory},(()=>[e.createVNode("div",{class:["uploader-file-progress",s.progressingClass],style:s.progressStyle},null,6),e.createVNode("div",d,[e.createVNode("div",f,[e.createVNode("i",{class:"uploader-file-icon",icon:s.fileCategory},null,8,["icon"]),e.createTextVNode(e.toDisplayString(r.file.name),1)]),e.createVNode("div",v,e.toDisplayString(s.formatedSize),1),g,e.createVNode("div",m,[e.withDirectives(e.createVNode("span",null,e.toDisplayString(s.statusText),513),[[e.vShow,"uploading"!==s.status]]),e.withDirectives(e.createVNode("span",null,[e.createVNode("span",null,e.toDisplayString(s.progressStyle.progress)+" ",1),e.createVNode("em",null,e.toDisplayString(s.formatedAverageSpeed)+" ",1),e.createVNode("i",null,e.toDisplayString(s.formatedTimeRemaining),1)],512),[[e.vShow,"uploading"===s.status]])]),e.createVNode("div",S,[e.createVNode("span",{class:"uploader-file-pause",onClick:i[1]||(i[1]=(...e)=>s.pause&&s.pause(...e))}),e.createVNode("span",{class:"uploader-file-resume",onClick:i[2]||(i[2]=(...e)=>s.resume&&s.resume(...e))},"️"),e.createVNode("span",{class:"uploader-file-retry",onClick:i[3]||(i[3]=(...e)=>s.retry&&s.retry(...e))}),e.createVNode("span",{class:"uploader-file-remove",onClick:i[4]||(i[4]=(...e)=>s.remove&&s.remove(...e))})])])]))],8,["status"])};const y={name:"uploader-list",components:{UploaderFile:c},setup:()=>({fileList:e.inject("uploader").fileList})},k={class:"uploader-list"};y.render=function(t,i,r,s,n,o){const a=e.resolveComponent("uploader-file");return e.openBlock(),e.createBlock("div",k,[e.renderSlot(t.$slots,"default",{fileList:s.fileList},(()=>[e.createVNode("ul",null,[(e.openBlock(!0),e.createBlock(e.Fragment,null,e.renderList(s.fileList,(t=>(e.openBlock(),e.createBlock("li",{key:t.id},[e.createVNode(a,{file:t,list:!0},null,8,["file"])])))),128))])]))])};const _={name:"uploader-files",components:{UploaderFile:c},setup:()=>({files:e.inject("uploader").files})},b={class:"uploader-files"};_.render=function(t,i,r,s,n,o){const a=e.resolveComponent("uploader-file");return e.openBlock(),e.createBlock("div",b,[e.renderSlot(t.$slots,"default",{files:s.files},(()=>[e.createVNode("ul",null,[(e.openBlock(!0),e.createBlock(e.Fragment,null,e.renderList(s.files,(t=>(e.openBlock(),e.createBlock("li",{key:t.id},[e.createVNode(a,{file:t},null,8,["file"])])))),128))])]))])};const x="fileAdded",R="filesAdded",E="uploadStart",C={name:"uploader",props:{options:{type:Object,default:()=>({})},autoStart:{type:Boolean,default:!0},fileStatusText:{type:[Object,Function],default:()=>({success:"success",error:"error",uploading:"uploading",paused:"paused",waiting:"waiting"})}},setup(t,{emit:i}){const n=e.ref(null),o=e.ref(!1),a=e.ref([]),l=e.ref([]),u=e.getCurrentInstance();let p=new r(t.options);const h=()=>{o.value=!0},c=t=>{const r=e.reactive(t);if(i(s(x),r),r.ignored)return!1},d=(e,t)=>{if(i(s(R),e,t),e.ignored||t.ignored)return!1},f=e=>{a.value=p.files,l.value=p.fileList},v=(e,i)=>{a.value=p.files,l.value=p.fileList,t.autoStart&&p.upload()},g=(...e)=>{const t=e[0],r={[x]:!0,[R]:!0,[E]:"uploadStart"}[t];if(r){if(!0===r)return;u.ctx[r].apply(u.ctx[r],e.slice(1))}e[0]=s(t),i.apply(u.ctx,e)};return t.options.initialPaused=!t.autoStart,p.fileStatusText=t.fileStatusText,p.on("catchAll",g),p.on(x,c),p.on(R,d),p.on("fileRemoved",f),p.on("filesSubmitted",v),p.uploadStart=h,e.onUnmounted((()=>{p.off("catchAll",g),p.off(x,c),p.off(R,d),p.off("fileRemoved",f),p.off("filesSubmitted",v),p=null})),e.provide("uploader",e.reactive(p)),{uploader:p,started:o,files:a,fileList:l,uploadStart:h,fileAdded:c,filesAdded:d,fileRemoved:f,filesSubmitted:v,allEvent:g,uploaderList:n}},components:{UploaderBtn:n,UploaderDrop:a,UploaderUnsupport:l,UploaderList:y,UploaderFiles:_,UploaderFile:c}},N={class:"uploader"},F=e.createVNode("p",null,"Drop files here to upload or",-1),w=e.createTextVNode("select files"),D=e.createTextVNode("select folder");C.render=function(t,i,r,s,n,o){const a=e.resolveComponent("uploader-unsupport"),l=e.resolveComponent("uploader-btn"),u=e.resolveComponent("uploader-drop"),p=e.resolveComponent("uploader-list");return e.openBlock(),e.createBlock("div",N,[e.renderSlot(t.$slots,"default",{files:s.files,fileList:s.fileList,started:s.started},(()=>[e.createVNode(a),e.createVNode(u,null,{default:e.withCtx((()=>[F,e.createVNode(l,null,{default:e.withCtx((()=>[w])),_:1}),e.createVNode(l,{directory:!0},{default:e.withCtx((()=>[D])),_:1})])),_:1}),e.createVNode(p)]))])};return{version:"1.0.0-beta.3",install:function(e,t){e.component(C.name,C),e.component(n.name,n),e.component(a.name,a),e.component(l.name,l),e.component(y.name,y),e.component(_.name,_),e.component(c.name,c)},Uploader:C,UploaderBtn:n,UploaderDrop:a,UploaderUnsupport:l,UploaderList:y,UploaderFiles:_,UploaderFile:c}}));
