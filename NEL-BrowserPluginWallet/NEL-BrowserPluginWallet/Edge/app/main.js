// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
$.base64.utf8encode = true;
$.base64.utf8decode = true;

//页面载入
$(function(){
    showWalletInfo();
    //alert($.base64.encode("好人"));
    //alert($.base64.decode($.base64.encode("好人")))  
    //alert($.base64.decode(localStorage.wallet.replace("data:;base64,","")));
});

function walletClear() {
    //alert('clr');
    localStorage.walletFileName = "";
    localStorage.wallet = "";
    localStorage.wallets = "";
    localStorage.balances = ""
    $("#walletName").text(localStorage.walletFileName);
    $("#wallet").text(localStorage.wallet);
    $("#listAddress").empty();
    $("#tableBalance tr:not(:first)").remove();
}

function changeFile() {
    //alert('FileChange');
    //alert($('#txtFile').val());
    localStorage.walletFileName = $('#txtFile').val().replace('C:\\fakepath\\', '');

    var oFReader = new FileReader();
    var file = document.getElementById('txtFile').files[0];

    //alert(getObjectURL(file));
    oFReader.readAsDataURL(file);
    oFReader.onloadend = function (oFRevent) {
        src = oFRevent.target.result;
        localStorage.wallet = src;

        showWalletInfo();
    }
}

function showWalletInfo() {
    $("#walletName").text(localStorage.walletFileName);
    $("#wallet").text(localStorage.wallet);
    $("#tableWallet tbody tr:eq(1)").hide();

    var walletData = JSON.parse($.base64.decode(localStorage.wallet.replace("data:;base64,", "")));
    var wallets = new Array();
    $("#listAddress").empty();
    $.each(walletData.accounts, function (index, value) {
        wallets[index] = value.address;
        $("#listAddress").append("<option value='" + value.address + "'>" + value.address + "</option>");
    });
    getAddr(wallets[0]);
    localStorage.wallets = wallets;
}

function changeListAddress() {
    var addrSelected = $("#listAddress").find("option:selected").text();
    //alert(addrSelected);
    getAddr(addrSelected);
}

//function getAssetInfo(assetid) {
//    $.jsonRPC.setup({
//        endPoint: 'http://47.96.168.8:81/api/testnet',
//        namespace: ''
//    });
//    $.jsonRPC.request('getasset', {
//        params: [assetid],
//        success: function (data) {
//            var result = data.result
//            if (result != null) {
//                var assetName = result[0].name[1].name;

//                if (assetName == "AntShare") { assetName = "NEO" }
//                else if (assetName == "AntCoin") { assetName = "GAS" }

//                var assetMap = JSON.parse(localStorage.assetMap);
//                assetMap[assetid] = assetName;
//                $("#listAsset").append("<option value='" + assetid + "'>" + assetName + "</option>");
//                localStorage.assetMap = JSON.stringify(assetMap);
//            }
//        }
//            else {// "No Data!"}
//        },
//        error: function (data) {
//            return data.error.message;
//        }
//    });
//}

function map2array(map) {
    var list = [];
    for (var key in map) {
        list.push([key, map[key]]);
    }
    return list;
};

function getAddr(addr){
    $.jsonRPC.setup({
        endPoint: 'http://47.96.168.8:81/api/testnet',
        namespace: ''
    });
    $.jsonRPC.request('getbalance', {
        params: [addr],
        success: function (data) {
            var result = data.result
            if (result != null) {

                $("#tableBalance tr:not(:first)").remove();
                $.each(result, function (index, value) {
                    var asset = value.asset;
                    var name = value.name[0].name;
                    if (name == "小蚁股") { name = "NEO" }
                    else if (name == "小蚁币") { name = "GAS" }
                    value.name[0].name = name;
                    var balance = value.balance
                    var newRow = "<tr><td>" + asset + "</td><td>" + name + "</td><td>" + balance + "</td></tr>";
                    $("#tableBalance tr:last").after(newRow);
                });
                $("#tableBalance tr td:nth-child(1)").hide();

                localStorage.balances = JSON.stringify(result)
            }
            else { $('#balance').text("No Data!"); }
        },
        error: function (data) {
            //alert(data.error.message);
            $("#tableBalance tr:not(:first)").remove();
        }
    });
}

var port = null;
var getKeys = function (obj) {
    var keys = [];
    for (var key in obj) {
        keys.push(key);
    }
    return keys;
}
function appendMessage(text) {
    document.getElementById('response').innerHTML += "<p>" + text + "</p>";
}
function updateUiState() {
    if (port) {
        document.getElementById('connect-button').style.display = 'none';
        document.getElementById('input-text').style.display = 'block';
        document.getElementById('send-message-button').style.display = 'block';
    } else {
        document.getElementById('connect-button').style.display = 'block';
        document.getElementById('input-text').style.display = 'none';
        document.getElementById('send-message-button').style.display = 'none';
    }
}
function sendNativeMessage() {
    //chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //    chrome.tabs.sendMessage(tabs[0].id, { message: "setTitel2" }, function (response) {
    //        //var result = document.createElement("div")
    //        //result.textContent = response.result       
    //        //document.body.appendChild(result)
    //        appendMessage("response message: <b>" + response.result + "</b>");
    //    });
    //});  
    var oFReader = new FileReader();
    var file = document.getElementById('txtFile').files[0];
    //alert(getObjectURL(file));
    oFReader.readAsDataURL(file);
    oFReader.onloadend = function (oFRevent) {
        src = oFRevent.target.result;

        message = { "text": document.getElementById('input-text').value, "wallet": src, "PSW": $('#txtPSW').val() };
        var a = JSON.stringify(message);
        port.postMessage(message);
        appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
        //alert(JSON.stringify(message))
    }
}

function sendTx(data) {
    var pubkeyStr = data.split('|')[0];
    var signStr = data.split('|')[1];
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "sendTX", pubkey: data.split('|')[0], sign: data.split('|')[1] }, function (response) {
            var data = response
        });
    });
}

function onNativeMessage(message) {
    appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");

    if (message.data.split('|')[1] != null) {
        sendTx(message.data)
    }

    //chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //    chrome.tabs.sendMessage(tabs[0].id, { message: "setNNShash", data: JSON.stringify(message.data) }, function (response) {
    //        //var result = document.createElement("div")
    //        //result.textContent = response.result       
    //        //document.body.appendChild(result)
    //        appendMessage("response message: <b>" + response.result + "</b>");
    //    });
    //});
}
function onDisconnected() {
    appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
    port = null;
    updateUiState();
}
function connect() {
    //chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //    chrome.tabs.sendMessage(tabs[0].id, { message: "setTitel" }, function (response) {
    //        //var result = document.createElement("div")
    //        //result.textContent = response.result       
    //        //document.body.appendChild(result)
    //        appendMessage("response message: <b>" + response.result + "</b>");
    //    });
    //});  

    var hostName = "nel.qingmingzi.pluginwallet";
    appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
    port = chrome.runtime.connectNative(hostName);
    port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);
    updateUiState();
}

function getdata()
{
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "getTx" }, function (response) {
            appendMessage("response message: <b>" + response.result + "</b>");
            var Tx = response.result;

            var oFReader = new FileReader();
            var file = document.getElementById('txtFile').files[0];
            //alert(getObjectURL(file));
            oFReader.readAsDataURL(file);
            oFReader.onloadend = function (oFRevent) {
                src = oFRevent.target.result;

                var hostName = "nel.qingmingzi.pluginwallet";
                port = chrome.runtime.connectNative(hostName);
                port.onMessage.addListener(onNativeMessage);

                message = { "text": "sign", "wallet": src, "PSW": $('#txtPSW').val(), "Tx": Tx };
                var a = JSON.stringify(message);
                port.postMessage(message);
                appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
                //alert(JSON.stringify(message))
            }
        });
    });  
}

//function getObjectURL(file) {
//    var url = null;
//    if (window.createObjcectURL != undefined) {
//        url = window.createOjcectURL(file);
//    } else if (window.URL != undefined) {
//        url = window.URL.createObjectURL(file);
//    } else if (window.webkitURL != undefined) {
//        url = window.webkitURL.createObjectURL(file);
//    }
//    return url;
//} 

document.addEventListener('DOMContentLoaded', function () {
    //document.getElementById('connect-button').addEventListener(
    //    'click', connect);
    //document.getElementById('send-message-button').addEventListener(
    //    'click', sendNativeMessage);
    //document.getElementById('butGetData').addEventListener(
    //    'click', getdata);
    //document.getElementById('butSendTx').addEventListener(
    //    'click', sendTx);
    document.getElementById('butWalletClear').addEventListener(
        'click', walletClear);
    document.getElementById('txtFile').addEventListener(
        'change', changeFile);
    document.getElementById('listAddress').addEventListener(
        'change', changeListAddress);
    //updateUiState();

    //var data = chrome.extension.getBackgroundPage().articleData;
    //if (data.error) {
    //    $("#message").text(data.error);
    //    $("#content").hide();
    //} else {
    //    $("#message").hide();
    //    $("#content-addrIn").text(data.addrIn);
    //    $("#content-addrOut").text(data.addrOut);
    //    $("#content-assetID").text(data.assetID);
    //    $("#content-amounts").text(data.amounts);
    //}
});