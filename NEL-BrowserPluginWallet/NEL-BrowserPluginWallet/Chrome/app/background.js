//function getDomainFromUrl(url){
//	var host = "null";
//	if(typeof url === "undefined" || null === url)
//		url = window.location.href;
//	var regex = /.*\:\/\/([^\/]*).*/;
//	var match = url.match(regex);
//	if(typeof match != "undefined" && null != match)
//		host = match[1];
//	return host;
//}

//function checkForValidUrl(tabId, changeInfo, tab) {
//    var a = getDomainFromUrl(tab.url).toLowerCase();
//	if(getDomainFromUrl(tab.url).toLowerCase()==="localhost"){
//		chrome.pageAction.show(tabId);
//	}
//};

//chrome.tabs.onUpdated.addListener(checkForValidUrl);

//var articleData = {};
//articleData.error = "加载中...";
//chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
//	if(request.type!==="cnblog-article-information")
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

// const local =  chrome.storage.local
// local.set({"value" : "test"})
// local.get("value",function(data){
//     alert(data);
// })

sendConnentEventByTabURL=()=>{
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {        
            if(tab.url === localStorage.URL)
            {
                //alert(tab.url);
                chrome.tabs.sendMessage(tab.id, {
                    message: "event",
                    data:{event: "disconnented！from background"}
                })
            }
        });
    }) 
    // chrome.tabs.query({ url: localStorage.URL}, function (tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {
    //         message: "event",
    //         data:{event: "disconnented！from background"}
    //     })
    // }) 
}

const nelApiUrl = 'https://api.nel.group/api/testnet';

var testValue = "This is background！"

setBadgeText = (text) =>{
    chrome.browserAction.setBadgeText({text: text});
    chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
}
setBadgeText('1');

showNotify = (title,msg) =>{
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'NEL_38.png',
        title: title,
        message: msg
    });
}
showNotify('后台提示','已经加载了后台js！')

getBalanceByAddr = (addr,callback) => {
    $.jsonRPC.setup({
        endPoint: nelApiUrl,
        namespace: ''
    });
    $.jsonRPC.request('getbalance', {
        params: [addr],
        success: function (data) {
            var result = data.result
            if (result !== null) {
                localStorage.balances = JSON.stringify(result)
                callback(JSON.stringify(result));            
            }
            else{callback('')};
        },
        error: function (data) {
            callback('');
        }
    });
}

gettransfertxhex = (from,to,asset,value,callback) => {
    // alert(from);
    // alert(to);
    // alert(asset);
    // alert(value);

    $.jsonRPC.setup({
        endPoint: nelApiUrl,
        namespace: ''
    });
    $.jsonRPC.request('gettransfertxhex', {
        params: [from,to,asset,value],
        success: function (data) {
            var result = data.result[0].transfertxhex
            if (result !== null) {
                //alert('001');
                //alert(JSON.stringify(result));
                callback(result);            
            }
            
            else{
                // alert('002');
                callback('')};
        },
        error: function (data) {
            //alert('003');
            callback('');
        }
    });
}

callcontractfortest = (scriptHash, invokeParam,callback) => {
    //alert(scriptHash);
    //alert(invokeParam);
    invokeParam = JSON.parse(invokeParam)
    //alert(invokeParam);
    var data = {
        "jsonrpc": "2.0",
        "method": "callcontractfortest",
        "params": [scriptHash,invokeParam],
        "id": 1
    }
    var data = JSON.stringify(data);
    
    fetch(nelApiUrl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
          },
        body: data
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log('callcontractfortest response:',JSON.stringify(data));
        callback(JSON.stringify(data));
      });
}

getinvoketxhex = (addr_pay, invoke_script, gas_consumed,callback) => {
    var data = {
        "jsonrpc": "2.0",
        "method": "getinvoketxhex",
        "params": [addr_pay,invoke_script,gas_consumed],
        "id": 1
    }
    var data = JSON.stringify(data);
    
    fetch(nelApiUrl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
          },
        body: data
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log('callcontractfortest response:',JSON.stringify(data));
        callback(JSON.stringify(data));
      });
}

sendtxplussign = (transfertxhex,transfertxhexSign,pubkeyHex,callback) => {
    $.jsonRPC.setup({
        endPoint: nelApiUrl,
        namespace: ''
    });
    $.jsonRPC.request('sendtxplussign', {
        params: [transfertxhex,transfertxhexSign,pubkeyHex],
        success: function (data) {
            var result = data
            if (result !== null) {
                callback(JSON.stringify(data));            
            }
            
            else{
                // alert('002');
                callback('')};
        },
        error: function (data) {
            //alert('003');
            callback('');
        }
    });
}

Uint8Array.prototype.toHexString = function () {
    var s = "";
    for (var i = 0; i < this.length; i++) {
        s += (this[i] >>> 4).toString(16);
        s += (this[i] & 0xf).toString(16);
    }
    return s;
};
console.info(ThinNeo.Helper.GetAddressFromScriptHash("0x0b193415c6f098b02e81a3b14d0e3b08e9c3f79a".hexToBytes()));

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // if (request.key === "nns") {
        //     //chrome.tabs.create({ url: "main.html" });
        //     var nns = request.value;
        //     namehash(nns);
        //     sendResponse({ result: "received:" + nns });
        // };
        // if (request.key === "getWallet") {
        //     openWallet(localStorage.wallet);
        //     sendResponse({ result: "received:" + localStorage.wallet });
        // }
        // if (request.key === "getWallets") {
        //     sendResponse({ result: localStorage.wallets });
        // }
        // if (request.key === "getbalances") {
        //     sendResponse({ result: localStorage.balances });
        // }
        // if (request.key === "doTansfar") {
        //     doTansfar(request.value);
        // }
        if (request.key === "getAccount") {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    message: "getAccount_R",
                    data:{
                        addr : localStorage.wallets,
                        balance: localStorage.balances
                    }
                })
            })
        }
        if (request.key === 'sendInvokeTx')
        {
            alert('Background: sendInvokeTx');

            var scriptHash = request.msg.scriptHash;
            var invokeParam = request.msg.invokeParam;
            //alert(scriptHash);
            //alert(invokeParam);

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                // alert("title" + tabs[0].title);
                // alert("url" + tabs[0].url);
                // alert("favIconUrl" + tabs[0].favIconUrl);
                var notify = window.open ('notify.html', 'notify', 'height=600, width=350, top=150, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no')
                notify.onload = function() {
                    alert("notify onLoad")
                    // alert(request.refInfo.refTitle)
                    // alert(request.refInfo.refDomain) 
                    // alert(request.refInfo.refIcoUrl)

                    // var dom = notify.document;
                    
                    // var para=document.createElement("p");
                    // var node=document.createTextNode(request.refInfo.refTitle);
                    // para.appendChild(node);

                    // var element=dom.getElementById("#refInfo");
                    // element.appendChild(para);
                    //$("#notify").contents().find("#refTitle").text(request.refInfo.refTitle);

                    // notify.document.getElementById("refTitle").innerHTML = request.msg.refInfo.refTitle
                    // notify.document.getElementById("refDomain").innerHTML = request.msg.refInfo.refDomain
                    // notify.document.getElementById("refIcoUrl").src = request.msg.refInfo.refIcoUrl

                    notify.document.getElementById("refTitle").innerHTML = tabs[0].title
                    notify.document.getElementById("refDomain").innerHTML = tabs[0].url
                    notify.document.getElementById("refIcoUrl").src = tabs[0].favIconUrl

                    localStorage.TITLE = tabs[0].title
                    localStorage.URL = tabs[0].url

                    notify.document.getElementById("TxInfo").innerHTML = "<p>合约HASH： " + scriptHash + "</ p>" + "<p>合约入参： " + invokeParam + "</ p>"

                    var _$ = document.querySelector.bind(notify.document);

                        _$('#notify_ok').onclick = function (e) {
                            alert(e.target.textContent + ' clicked!');
                            notify.close()

                            var nep2 = JSON.parse(localStorage.wallet).accounts[0].key;
                            var passWord =_$('#passWord').value;
                            // alert("nep2: " + nep2);
                            // alert("pw : " + passWord);

                            callcontractfortest(scriptHash,invokeParam,function(callback1){
                                alert(callback1);
                                callback1 =  JSON.parse(callback1);
                                getinvoketxhex(localStorage.wallets,callback1.result[0].script,callback1.result[0].gas_consumed,function(callback2){
                                    var invoketxhex =JSON.parse(callback2).result[0].invoketxhex;
                                    alert(invoketxhex);
                                    console.log("invoketxhex= " + invoketxhex);

                                    var n = 16384;
                                    var r = 8;
                                    var p = 8
                    
                                    ThinNeo.Helper.GetPrivateKeyFromNep2(nep2, passWord, n, r, p, (info, result) => {
                                        console.log("info= " + info);
                                        var prikey = result;
                                        console.log("result= " + prikey.toHexString());
                                        var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                                        console.log("pubkey= " + pubkey.toHexString());
                                        var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                                        console.log("address= " + address);
                                        var invoketxhexSigned = ThinNeo.Helper.Sign(invoketxhex.hexToBytes(), prikey).toHexString();
                                        console.log("invoketxhexSigned= " + invoketxhexSigned);
    
                                        sendtxplussign(invoketxhex,invoketxhexSigned,pubkey.toHexString(),function(sendResult){
                                            chrome.tabs.sendMessage(tabs[0].id, {message: "sendInvokeTx_R",data:JSON.parse(sendResult).result[0].txid , result: sendResult}) 
                                        })                                                              
                                    });     
                                })
                            })
                        }
                        _$('#notify_cancle').onclick = function (e) {
                            alert(e.target.textContent + ' clicked!');
                            notify.close()

                            sendConnentEventByTabURL()

                            chrome.tabs.sendMessage(tabs[0].id, {result: "签名请求被拒绝！"})                      
                        }
                }

                //获得关闭事件
                var loop = setInterval(function() { 
                       if(notify.closed) {    
                           clearInterval(loop);    
                           alert('notify Closed');
                       }    
                    }, 1000);
            })
        }
        if (request.key === "sendTransferTx")
        {
            // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            //     chrome.tabs.sendMessage(tabs[0].id, {result: data})                             
            // })

            alert("bg: sendTransferTx")

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                var notify = window.open ('notify.html', 'notify', 'height=600, width=350, top=150, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no')
                notify.onload = function() {
                    alert("notify onLoad")
                    // alert(request.refInfo.refTitle)
                    // alert(request.refInfo.refDomain) 
                    // alert(request.refInfo.refIcoUrl)

                    // var dom = notify.document;
                    
                    // var para=document.createElement("p");
                    // var node=document.createTextNode(request.refInfo.refTitle);
                    // para.appendChild(node);

                    // var element=dom.getElementById("#refInfo");
                    // element.appendChild(para);
                    //$("#notify").contents().find("#refTitle").text(request.refInfo.refTitle);

                    // notify.document.getElementById("refTitle").innerHTML = request.msg.refInfo.refTitle
                    // notify.document.getElementById("refDomain").innerHTML = request.msg.refInfo.refDomain
                    // notify.document.getElementById("refIcoUrl").src = request.msg.refInfo.refIcoUrl

                    notify.document.getElementById("refTitle").innerHTML = tabs[0].title
                    notify.document.getElementById("refDomain").innerHTML = tabs[0].url
                    notify.document.getElementById("refIcoUrl").src = tabs[0].favIconUrl

                    var assetName = request.msg.asset;
                    if(assetName === '0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b') assetName = 'NEO'
                    if(assetName === '0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7') assetName = 'GAS'              
                    notify.document.getElementById("TxInfo").innerHTML = "<p>从： " + request.msg.from + "</ p>" + "<p>转出到： " + request.msg.to + "</ p>" + "<p>资产： " + assetName + "</ p>" + "<p>金额： " + request.msg.value + "</ p>" 

                    var _$ = document.querySelector.bind(notify.document);

                        _$('#notify_ok').onclick = function (e) {
                            alert(e.target.textContent + ' clicked!');
                            notify.close()

                            var nep2 = JSON.parse(localStorage.wallet).accounts[0].key;
                            var passWord =_$('#passWord').value;
                            // alert("nep2: " + nep2);
                            // alert("pw : " + passWord);

                            gettransfertxhex(request.msg.from,request.msg.to,request.msg.asset,request.msg.value,function(transfertxhex)
                            {
                                console.log("transfertxhex= " + transfertxhex);

                                var n = 16384;
                                var r = 8;
                                var p = 8
                
                                ThinNeo.Helper.GetPrivateKeyFromNep2(nep2, passWord, n, r, p, (info, result) => {
                                    console.log("info= " + info);
                                    var prikey = result;
                                    console.log("result= " + prikey.toHexString());
                                    var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                                    console.log("pubkey= " + pubkey.toHexString());
                                    var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                                    console.log("address= " + address);
                                    var transfertxhexSigned = ThinNeo.Helper.Sign(transfertxhex.hexToBytes(), prikey).toHexString();
                                    console.log("transfertxhexSigned= " + transfertxhexSigned);

                                    sendtxplussign(transfertxhex,transfertxhexSigned,pubkey.toHexString(),function(sendResult){
                                        chrome.tabs.sendMessage(tabs[0].id, {message: "sendTransferTx_R",data:JSON.parse(sendResult).result[0].txid , result: sendResult}) 
                                    })                                                              
                                });                                                                                               
                                
                                //chrome.runtime.sendMessage({result: data});
                            })
                        }
                        _$('#notify_cancle').onclick = function (e) {
                            alert(e.target.textContent + ' clicked!');
                            notify.close()

                            sendConnentEventByTabURL();

                            chrome.tabs.sendMessage(tabs[0].id, {result: "签名请求被拒绝！"})                      
                        }
                }

                //获得关闭事件
                var loop = setInterval(function() { 
                       if(notify.closed) {    
                           clearInterval(loop);    
                           alert('notify Closed');
                       }    
                    }, 1000);
            })
        }
        if (request.key === 'getBalanceByAddr')
        {
            //alert (request.message);
            getBalanceByAddr(request.message,function(data)
            {
                //alert("bg:" + data);
                //sendResponse({result: "from bg:" + data});
                chrome.runtime.sendMessage({result: data});
            })
            sendResponse({ result : "received:" + request.message });
        }
        if (request.key === "test")
        {          
            sendResponse({ result: "background get test request" + thin.Helper.GetPublicKeyScriptHash_FromAddress(request.message)});
            console.info("background get test request")          
        }
    });

// $.base64.utf8encode = true;
// $.base64.utf8decode = true;

//var port = null;
//var hostName = "nel.qingmingzi.pluginwallet";
//port = chrome.runtime.connectNative(hostName);
//port.onMessage.addListener(onNativeMessage);

//function onNativeMessage(message) {
//    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//        switch (message.data.key) {
//            case "namehash":
//                chrome.tabs.sendMessage(tabs[0].id, { message: "setNNShash", data: message.data.data }, function (response) {
//                    //var result = document.createElement("div")
//                    //result.textContent = response.result       
//                    //document.body.appendChild(result)
//                    //alert(response.result);
//                });
//                break;
//            case "openWallet":
//                chrome.tabs.sendMessage(tabs[0].id, { message: "setAddrOut", data: message.data.data }, function (response) {
//                    //var result = document.createElement("div")
//                    //result.textContent = response.result       
//                    //document.body.appendChild(result)
//                    //alert(response.result);
//                });
//                break;
//            case "doTansfar":
//                chrome.tabs.sendMessage(tabs[0].id, { message: "doTansfar", data: message.data.data }, function (response) {
//                    //var result = document.createElement("div")
//                    //result.textContent = response.result       
//                    //document.body.appendChild(result)
//                    //alert(response.result);
//                });
//                break;
//        }
//    });
//}

// function namehash(nns) {
//     message = { "text": "namehash","data": nns };
//     port.postMessage(message);
// }

// function openWallet(wallet) {
//     message = { "text": "openWallet", "wallet": wallet };
//     var a = JSON.stringify(message);
//     port.postMessage(message);
// }

// function doTansfar(tansfarInfo) {
//     //tansfarInfo["wallet"] = localStorage.wallet;
//     var wallet = JSON.parse($.base64.decode(localStorage.wallet.replace("data:;base64,", "")));
//     $.each(wallet.accounts, function (index, value) {
//         if (value.address === tansfarInfo.addrOut) {
//             tansfarInfo["key"] = value.key;
//             return false;
//         }
//     });
//     message = { "text": "doTansfar", "tansfarInfo": tansfarInfo };
//     var a = JSON.stringify(message);
//     port.postMessage(message);
// }