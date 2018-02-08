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
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.key == "nns") {
            var nns = request.value;
            namehash(nns);
            sendResponse({ result: "received:" + nns });
        };
        if (request.key == "getWallet") {
            openWallet(localStorage.wallet);
            sendResponse({ result: "received:" + localStorage.wallet });
        }
        if (request.key == "getWallets") {
            sendResponse({ result: localStorage.wallets });
        }
        if (request.key == "getbalances") {
            sendResponse({ result: localStorage.balances });
        }
        if (request.key == "doTansfar") {
            doTansfar(request.value);
        }
    });

$.base64.utf8encode = true;
$.base64.utf8decode = true;

var port = null;
var hostName = "nel.qingmingzi.pluginwallet";
port = chrome.runtime.connectNative(hostName);
port.onMessage.addListener(onNativeMessage);

function onNativeMessage(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        switch (message.data.key) {
            case "namehash":
                chrome.tabs.sendMessage(tabs[0].id, { message: "setNNShash", data: message.data.data }, function (response) {
                    //var result = document.createElement("div")
                    //result.textContent = response.result       
                    //document.body.appendChild(result)
                    //alert(response.result);
                });
                break;
            case "openWallet":
                chrome.tabs.sendMessage(tabs[0].id, { message: "setAddrOut", data: message.data.data }, function (response) {
                    //var result = document.createElement("div")
                    //result.textContent = response.result       
                    //document.body.appendChild(result)
                    //alert(response.result);
                });
                break;
            case "doTansfar":
                chrome.tabs.sendMessage(tabs[0].id, { message: "doTansfar", data: message.data.data }, function (response) {
                    //var result = document.createElement("div")
                    //result.textContent = response.result       
                    //document.body.appendChild(result)
                    //alert(response.result);
                });
                break;
        }
    });
}

function namehash(nns) {
    message = { "text": "namehash","data": nns };
    port.postMessage(message);
}

function openWallet(wallet) {
    message = { "text": "openWallet", "wallet": wallet };
    var a = JSON.stringify(message);
    port.postMessage(message);
}

function doTansfar(tansfarInfo) {
    //tansfarInfo["wallet"] = localStorage.wallet;
    var wallet = JSON.parse($.base64.decode(localStorage.wallet.replace("data:;base64,", "")));
    $.each(wallet.accounts, function (index, value) {
        if (value.address == tansfarInfo.addrOut) {
            tansfarInfo["key"] = value.key;
            return false;
        }
    });
    message = { "text": "doTansfar", "tansfarInfo": tansfarInfo };
    var a = JSON.stringify(message);
    port.postMessage(message);
}
