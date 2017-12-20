//function getDomainFromUrl(url){
//	var host = "null";
//	if(typeof url == "undefined" || null == url)
//		url = window.location.href;
//	var regex = /.*\:\/\/([^\/]*).*/;
//	var match = url.match(regex);
//	if(typeof match != "undefined" && null != match)
//		host = match[1];
//	return host;
//}

//function checkForValidUrl(tabId, changeInfo, tab) {
//    var a = getDomainFromUrl(tab.url).toLowerCase();
//	if(getDomainFromUrl(tab.url).toLowerCase()=="localhost"){
//		chrome.pageAction.show(tabId);
//	}
//};

//chrome.tabs.onUpdated.addListener(checkForValidUrl);

//var articleData = {};
//articleData.error = "加载中...";
//chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
//	if(request.type!=="cnblog-article-information")
//		return;
//	articleData = request;
//	articleData.firstAccess = "获取中...";
//	if(!articleData.error){
//		$.ajax({
//			url: "http://localhost/first_access.php",
//			cache: false,
//			type: "POST",
//			data: JSON.stringify({url:articleData.url}),
//			dataType: "json"
//		}).done(function(msg) {
//			if(msg.error){
//				articleData.firstAccess = msg.error;
//			} else {
//				articleData.firstAccess = msg.firstAccess;
//			}
//		}).fail(function(jqXHR, textStatus) {
//			articleData.firstAccess = textStatus;
//		});
//	}
//});
var port = null;

function onNativeMessage(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "setNNShash", data:message.data }, function (response) {
            //var result = document.createElement("div")
            //result.textContent = response.result       
            //document.body.appendChild(result)
            //alert(response.result);
        });
    });
}

function namehash(nns) {
    var hostName = "nel.qingmingzi.pluginwallet";
    port = chrome.runtime.connectNative(hostName);
    port.onMessage.addListener(onNativeMessage);

    message = { "text": "namehash","data": nns };
    port.postMessage(message);
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.key == "nns") {
            var nns = request.value;
            namehash(nns);
            sendResponse({ result: "received:" + nns });
        }
    });
