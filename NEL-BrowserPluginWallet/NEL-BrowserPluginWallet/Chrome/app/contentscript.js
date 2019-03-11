//var postInfo = $("#datatable");
//if(postInfo.length!==1){
//	chrome.runtime.sendMessage({type:"cnblog-article-information", error:"获取文章信息失败."});
//}
//else{
//	var msg = {
//		type: "cnblog-article-information",
//        addrIn: $("#txtAddrIn").val(),
//        addrOut: $("#txtAddrOut").val(),
//        assetID: $("#listAssetID option:selected").val(),
//        amounts: $("#txtAmounts").val(),
//	};
//	chrome.runtime.sendMessage(msg);
//}


// 向页面注入JS
function injectCustomJs(jsPath)
{
    jsPath = jsPath || 'inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function()
    {
        // 放在页面不好看，执行完后移除掉
        this.parentNode.removeChild(this);
    };
    document.head.appendChild(temp);
}

function sendMsgTest() {
    window.postMessage({"test": '这里是contentScript.js'}, '*');
}

// 接收向页面注入的JS
window.addEventListener("message", function(e)
{   
    //获取Dapp页面信息
    var refTitle = document.title;
    var refDomain = document.URL;
    var refIcoUrl = refDomain + $("head link[rel*='icon']").attr("href");
    // alert(refTitle) 
    // alert(refDomain) 
    // alert(refIcoUrl)
    refInfo = {refTitle,refDomain,refIcoUrl}

    request = e.data;

    if(request.key === "getAccount")
    {
        chrome.runtime.sendMessage({
            key:'getAccount', 
            msg:{}
        });
    }
    if(request.key === "sendTransferTx")
    {
        alert('ContentScript: sendInvokeTx');

        chrome.runtime.sendMessage({
            key:'sendTransferTx', 
            msg:{
                refInfo : refInfo,
                from : request.msg.from, 
                to : request.msg.to , 
                asset : request.msg.asset ,
                value:request.msg.value
            }
        });
    }
    if(request.key === "sendInvokeTx")
    {
        alert('ContentScript: sendInvokeTx');

        var scriptHash = request.msg.scriptHash;
        var invokeParam = request.msg.invokeParam;
        // alert(scriptHash);
        // alert(invokeParam);

        chrome.runtime.sendMessage({
            key:'sendInvokeTx', 
            msg:{
                refInfo : refInfo,
                scriptHash : scriptHash, 
                invokeParam : invokeParam
            }
        });
    }
    console.log(request);
}, false);

$(function(){
    injectCustomJs()
    sendMsgTest()
});

// function getAsset(addr) {
//     $.jsonRPC.setup({
//         endPoint: 'http://47.96.168.8:81/api/testnet',
//         namespace: ''
//     });
//     $.jsonRPC.request('getbalance', {
//         params: [addr],
//         success: function (data) {
//             var result = data.result
//             if (result !== null) {
//                 $("#listAssetID").empty();
//                 $.each(result, function (index, value) {
//                     var name = value.name[0].name;
//                     if (name === "小蚁股") { name = "NEO" }
//                     else if (name === "小蚁币") { name = "GAS" }
//                     $("#listAssetID").append("<option value='" + value.asset + "'>" + value.balance + "&nbsp;" + name + "</option>");
//                 });
//             }
//             //else { $('#balance').text("No Data!"); }
//         },
//         error: function (data) {
//             //alert(data.error.message);
//             $("#listAssetID").empty();
//         }
//     });
// }

//初始化
// chrome.runtime.sendMessage({ key: "getWallets" },
//     function (response) {
//         var wallets = response.result.split(",");
//         $("#listAddrOut").empty();
//         $.each(wallets, function (index, value) {
//             $("#listAddrOut").append("<option value='" + value + "'>" + value + "</option>");
//         });
//         getAsset(wallets[0]);
//     });
//chrome.runtime.sendMessage({ key: "getbalances" },
//    function (response) {
//        var balances = JSON.parse(response.result);
//        $("#listAssetID").empty();
//        $.each(balances, function (index, value) {
//            $("#listAssetID").append("<option value='" + value.asset + "'>" + value.balance + "&nbsp;" + value.name[0].name + "</option>");
//        });
//    });

function convertFromHex(hex) {
    var hex2 = hex.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex2.length; i += 2)
        str += String.fromCharCode(parseInt(hex2.substr(i, 2), 16));
    return str;
}

function convertToHex(str) {
    var hex = '';
    for (var i = 0; i < str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;
}

// function getAddr(nns){
//     $.jsonRPC.setup({
//         endPoint: 'http://101.89.140.195:20332',
//         namespace: ''
//     });
//     $.jsonRPC.request('getstorage', {
//         params: ["706c89208c5b6016a054a58cc83aeda0d70f0f95", nns],
//         success: function (data) {
//             var result = data.result
//             if (result !== null) {
//                 $('#txtAddrIn').val(convertFromHex(data.result));
//             }
//             else { $('#txtAddrIn').val("无解析！");}

//         },
//         error: function (data) {
//             //alert(data.error.message);
//         }
//     });
// }

// $("#listAddrOut").change(function (event) {
//     var addr = $("#listAddrOut").find("option:selected").text();
//     getAsset(addr);
// });

//执行转账
// $('#doTansfar').click(function (event) {
//     var tansfarInfo = { addrIn: $("#txtAddrIn").val(), addrOut: $("#listAddrOut option:selected").val(), assetID: $("#listAssetID option:selected").val(), amounts: $("#txtAmounts").val()};
//     chrome.runtime.sendMessage({ key: "doTansfar", value: tansfarInfo },
//         function (response) {
//             //alert(response.result);
//         });
// });

//执行NeoDun转账
// $('#doTansfarByNelApi').click(function (event) {
//     var addrIn = $("#txtAddrIn").val();
//     var addrOut = $("#listAddrOut option:selected").val();
//     var assetID = $("#listAssetID option:selected").val();
//     var amounts = $("#txtAmounts").val();

//     $.jsonRPC.setup({
//         //endPoint: 'http://localhost:59908/api/testnet',
//         endPoint: 'http://api.nel.group/api/testnet',
//         namespace: ''
//     });
//     $.jsonRPC.request('gettransfertxhex', {
//         params: [addrOut, addrIn, assetID, amounts],
//         success: function (data) {
//             var result = data.result
//             if (result !== null) {
//                 var transfertxhex = result[0].transfertxhex;

//                 //window.open('passwordMatrix.html', '', 'height=400, width=400');
//                 $.get("http://127.0.0.1:50288/_api/sign?data=" + transfertxhex + "&source=" + addrOut, function (data) {
//                     //alert(data);
//                     var J = JSON.parse(data);
//                     var sign = J.signdata.toLowerCase();
//                     var pubkey = J.pubkey.toLowerCase();
//                     //alert(sign);
//                     //alert(pubkey);

//                     $.jsonRPC.setup({
//                         //endPoint: 'http://localhost:59908/api/testnet',
//                         endPoint: 'http://api.nel.group/api/testnet',
//                         namespace: ''
//                     });
//                     $.jsonRPC.request('sendtxplussign', {
//                         params: [transfertxhex, sign, pubkey],
//                         success: function (data) {
//                             var result = data.result
//                             if (result !== null) {
//                                 alert("交易发送结果：" + result[0].sendrawtransactionresult);
//                                 $("#txid").text('txid:0x' + result[0].txid);
//                                 $("#txid").attr('href', 'http://be.nel.group/page/txInfo.html?txid=0x' + result[0].txid)
//                             }
//                         },
//                         error: function (data) {
//                             alert(data.error.message);
//                         }
//                     });
//                 });
//             }
//         },
//         error: function (data) {
//             alert(data.error.message);
//         }
//     });
// });

// $('#butResolve').click(function(event){
//     chrome.runtime.sendMessage({ key: "nns", value: $('#txtNNS').val() },
//         function (response) {
//             //alert(response.result);
//         });
// });

// function sendTransfer_test()
// {
//     var refTitle = document.title;
//     var refDomain = document.URL;
//     var refIcoUrl = refDomain + $("head link[rel*='icon']").attr("href");
//     // alert(refTitle) 
//     // alert(refDomain) 
//     // alert(refIcoUrl)
//     var refInfo = {refTitle,refDomain,refIcoUrl}

//     chrome.runtime.sendMessage({
//         refInfo : refInfo,
//         key:'gettransfertxhex', 
//         from : 'ASBhJFN3XiDu38EdEQyMY3N2XwGh1gd5WW' , 
//         to : 'ASBhJFN3XiDu38EdEQyMY3N2XwGh1gd5WW' , 
//         asset : "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7" ,
//         value:0.01
//     });
// }

// $('#butDoTarnsferTest').click(function (event) {
//     sendTransfer_test();
//     // chrome.runtime.sendMessage({ key: "getWallet" },
//     //     function (response) {
//     //         //$('#txtAddrOut').val(response.result);
//     //     });
// });

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        //alert("content_script Listener：fromBG" + request.result);

        if (request.message === "event"){
            window.postMessage({
                key: "event",
                msg: request.data
            }, '*')
        }
        if (request.message === "getAccount_R"){
            window.postMessage({
                key: "getAccount_R",
                msg: request.data
            }, '*')
        }
        if (request.message === "sendTransferTx_R") {
            window.postMessage({
                key:"sendTransferTx_R",
                msg:{
                    txid: request.data
                }
            }, '*');
        }
        if(request.message === "sendInvokeTx_R"){
            window.postMessage({
                key:"sendInvokeTx_R",
                msg:{
                    txid: request.data
                }
            }, '*');
        }


        //if (request.message === "setTitel") {
        //    $("#cb_post_title_url").text("aaa");
        //    sendResponse({ result: "告诉你" })
        //}
        // else if (request.message === "setNNShash") {
        //     getAddr(request.data);
        //     //$('#txtAddrIn').val(res);
        //     //$("#txtNNS").val(request.data);
        //     //sendResponse({ result: "NNShash Set" })
        // }
        //else if (request.message === "setAddrOut") {
        //    $('#txtAddrOut').val(request.data);
        //    //$('#txtAddrIn').val(res);
        //    //$("#txtNNS").val(request.data);
        //    sendResponse({ result: "AddrOut Set" })
        //}
        //else if (request.message === "getTx") {
        //        var msg = {
        //            result: $("#txScript").val()
        //        };
        //        sendResponse(msg)
        //}
        //else if (request.message === "getData") {
        //    var postInfo = $("#datatable");
        //    if (postInfo.length !== 1) {
        //        sendResponse({result: "获取文章信息失败." });
        //    }
        //    else {
        //        var msg = {
        //            addrIn: $("#txtAddrIn").val(),
        //            addrOut: $("#listAddrOut option:selected").val(),
        //            assetID: $("#listAssetID option:selected").val(),
        //            amounts: $("#txtAmounts").val(),
        //            url: document.URL
        //        };
        //        sendResponse(msg)
        //    }
        //}
        //else if (request.message === "sendTX") {
        //    $("#txPubkey").text(request.pubkey);
        //    $("#txSign").text(request.sign);
        //    $("#txDonePubkey").show();
        //    $("#txDoneSign").show();
        //}
        //else {
        //    $("#cb_post_title_url").text("bcd");
        //    sendResponse({ result: "不告诉你" })
        //}
            
    });  
